import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {createRef, useContext, useEffect, useRef, useState} from "react";
import StateContext from "../mobx/global-context";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    FormControl, FormLabel,
    Image,
    InputGroup, ListGroup,
    Modal,
    Row,
    Table
} from "react-bootstrap";
import {render} from "@testing-library/react";
import { uid } from 'uid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ScrollToTop from 'react-scroll-up';
import {
    changeCheckInState,
    getCheckInStudents,
    getEmailByScheduleDetail,
    getMeetURL,
    getScheduleInfo,
    removeMeetURL,
    setMeetURL,
    pairUserData,
    confirmBox,
    loadStudentPicture,
    unSend,
    getRejectLogs,
    getMeetToken, sendChatMessage, getChatMessage
} from "../components/services";
import {toast} from "react-toastify";
import { confirmAlert } from 'react-confirm-alert'; // Import
import queue from 'async/queue';
import Config from "../config";
import moment from "moment";



let reloadStudentsTimer=void 0;
let reloadStudentPicturesTimer=void 0;
const pictureQueueSize=5;
const ViewStudent = () => {
    const state = useContext(StateContext);
    const {SchdID, SchdDetailID,group} = useParams();
    const [schedule, setSchedule] = useState();
    const [meetRoom,setMeetRoom] = useState('');
    const [students,setStudents] = useState([]);
    const [loadingBtn,setLoadingBtn] = useState({});
    const [filter,setFilter] = useState('');
    const [copiedState,setCopiedState] = useState(0);
    const [userPairingText,setUserPairingText] = useState('');
    const [userPairing,setUserPairing] = useState(null);
    const [showEmail,setShowEmail] = useState(false);
    const [showRejectMsg,setShowRejectMsg] = useState(false);
    const [rejectMsg,setRejectMsg] = useState('');
    const [selectedStd,setSelectedStd] = useState(null);
    const [rejectLogs,setRejectLogs] = useState(null);
    const [token,setToken] = useState(null);
    const [showMsg,setShowMsg] = useState(null);
    const [recentChat,setRecentChat] = useState(null);
    const [msg,setMsg] = useState('');
    const q = useRef(null);
    const textAreaRejectMsg=createRef();
    const divLeaveLog=createRef();
    const textAreaMsg=createRef();

    useEffect(() => {
        state.scheduleMenu = [
            {to: `/schedule/${SchdID}/${SchdDetailID}`, title: 'Group'},
            {to: `/schedule/${SchdID}/${SchdDetailID}/${group}`, title: 'Students'}
        ];
        getMeetToken().then(data=>{
            setToken(data.token);
        });
        getMeetURL(SchdID,SchdDetailID,group).then(data=>{
            if(data){
                setMeetRoom(data.meet_url);
                setCopiedState(4);
            }
        });
        reloadStudents();
        getScheduleInfo(SchdID,SchdDetailID).then(res=>{
            setSchedule(res);
        })
        return ()=>{
            clearInterval(reloadStudentsTimer);
            clearInterval(reloadStudentPicturesTimer);
            if(q.current)q.current.kill();
        }
    }, []);

    useEffect(()=>{
        if(divLeaveLog.current){
            divLeaveLog.current.scrollTop=0;
        }
    },[rejectLogs,divLeaveLog]);

    useEffect(()=>{
        let textArr=userPairingText.split(/\n/);
        let buffer={};
        let currentName=null;
        let expGetName=new RegExp('(.+)(?:\\d+:\\d+) ?(?:AM|PM)?');
        let expGetCode=new RegExp('((?:\\d{9}\\-\\d{1})|(?:\\d{10}))');
        textArr.map(line=>{
            let name=line.match(expGetName);
            let code=line.match(expGetCode);
            if(name && (name[1]=='You'||name[1]=='คุณ'))return;
            if(name){
                currentName=name[1].trim();
                if(currentName.substr(-1).match(/1/)){
                    currentName=currentName.substr(0,currentName.length-1);
                }
            }else if(currentName && code){
                let existed = students.find(student=>student.StudentID==fixStudentCode(code[1]));
                let existedCopied={...existed};
                if(existedCopied){
                    if(existedCopied.avatar_name && existedCopied.avatar_name!=currentName){
                        console.log(existedCopied.avatar_name,currentName);
                        existedCopied.pairError=true;
                    }
                    buffer[currentName]=existedCopied;
                }
            }
        })
        if(Object.keys(buffer).length>0){
            setUserPairing({...buffer});
        }else{
            setUserPairing(null);
        }
    },[userPairingText]);

    function reloadStudents(){
        getRejectLogs(SchdID,SchdDetailID,group).then(data=>{
            setRejectLogs(data);
        })
        getCheckInStudents(SchdID,SchdDetailID,group).then(async res=>{
            q.current = queue((std, callback)=>{
                loadStudentPicture(std.Username).then(()=>{
                    callback();
                });
            }, pictureQueueSize);
            q.current.drain(function() {
                console.log('PIC FINISHED');
                clearInterval(reloadStudentPicturesTimer);
                reloadStudentPicturesTimer=setInterval(()=>{reloadStudents()},15*1000);
            });
            res.map(std=>{
                q.current.push(std);
            });
            setStudents(sortState(res));
        });
    }

    function sortState(students){
        students.sort((a,b)=>{
            if(a.check_in_status=='1' && b.check_in_status=='0')return 1;
            if(a.check_in_status=='0' && b.check_in_status=='1')return -1;
            return 0;
        })
        return students;
    }

    function approve(std) {
        chState(std,1);
    }

    function fixStudentCode(code){
        if(!code.match(/\d{9}\-\d{1}/)){
            return code.substr(0,9)+'-'+code.substr(-1)
        }
        return code;
    }

     function sendRejectMsg(){
        chState(selectedStd,0,rejectMsg);
        setShowRejectMsg(false);
        setRejectMsg('');
    }

    async function sendMsg(){
        let result = await sendChatMessage(SchdID,SchdDetailID,group,selectedStd.Username,msg);
        if(!result.error){
            console.log(selectedStd);
            toast.success('Message has been send.');
            await getRecentMessage(selectedStd);
            setShowMsg(false);
            setSelectedStd(null);
            setMsg('');
        }
    }

    async function reject(std) {
        setSelectedStd(std);
        setShowRejectMsg(true);
    }

    useEffect(()=>{
        if(textAreaRejectMsg.current)textAreaRejectMsg.current.focus();
    },[textAreaRejectMsg])

    useEffect(()=>{
        if(textAreaMsg.current)textAreaMsg.current.focus();
    },[textAreaMsg])

    async function chState(std,state,msg){
        setLoadingBtn(prevState => ({...prevState,[std.StdRegistID]:true}))
        await changeCheckInState(std.StdRegistID,state,msg);
        if(state==1){
            toast.success(std.StudentID+' Approved.');
        }else{
            toast.success(std.StudentID+' Rejected.');
        }
        setTimeout(()=>{
            setStudents(old => {
                let existed = old.find(v=>v.Username==std.Username);
                existed.check_in_status=state;
                return sortState(old);
            });
            setLoadingBtn(prevState => ({...prevState,[std.StdRegistID]:false}))
        },200);
        clearTimeout(reloadStudentsTimer);
        reloadStudentsTimer=setTimeout(async ()=>{
            reloadStudents();
        },2000);
    }

    function startGoogleMeet(){
        setCopiedState(1);
        setTimeout(()=>{
            setCopiedState(2);
            setTimeout(()=>{
                window.open("https://meet.google.com");
                setCopiedState(3);
            },2000);
        },1000);

    }

    function getEmail(){
        let emailText='';
        students.map(std=>{
            emailText+=std.email+',';
        });
        return emailText.substr(0,emailText.length-1);
    }

    async function broadcast(){
        if(meetRoom.match(/meet.google.com\//)){
            await setMeetURL(SchdID,SchdDetailID,group,meetRoom);
            setCopiedState(4);
            toast.success(`Broadcast success.`);
        }else{
            toast.warn('Please fill Google meet link.')
        }
    }

    async function pairUser(approve=false){
        if(!userPairing) return;
        let buffer=[];
        Object.keys(userPairing).map(pair=>{
            let student=userPairing[pair];
            if(student){
                let {Username,StudentID}=student;
                buffer.push({
                    approve,
                    Username,
                    avatar_name:pair,
                    SchdID,
                    SchdDetailID,
                    group
                });
            }

        })
        await pairUserData(buffer);
        setUserPairingText('');
        reloadStudents();
        if(approve){
            toast.success('Pair user and approve success.')
        }else{
            toast.success('Pair user success.')
        }
    }

    function pairUserAndApprove(){
        confirmBox('Pair user and Approve',null,()=>{
            pairUser(true);
        })
    }

    async function getRecentMessage(std){
        let rc = await getChatMessage(SchdID,SchdDetailID,group,std.Username);
        setRecentChat(rc);
    }

    return <div>
        {
            (schedule && students)
                ? <>
                    <Row>
                        <Col>
                            <div>
                                <Form.Group>
                                    {copiedState==4
                                        ?
                                        <Button variant="danger" onClick={e=>{
                                            confirmBox('Stop broadcast',null,()=>{
                                                removeMeetURL(SchdID,SchdDetailID,group).then(()=>{
                                                    setCopiedState(0);
                                                    setMeetRoom('');
                                                })
                                            })
                                        }}>Stop Google meet</Button>
                                        :
                                        <CopyToClipboard text={getEmail()}
                                                          onCopy={()=>{startGoogleMeet()}}
                                        >
                                            <Button variant="primary">Start Google meet</Button>
                                        </CopyToClipboard>
                                    }
                                    {!!copiedState &&
                                    <div>
                                        {(copiedState==1 || copiedState==2) && <Alert variant="success" className="mt-2 mb-1">Copied email to clipboard.</Alert>}
                                        {copiedState==2 && <Alert variant="warning">Starting Google meet.</Alert>}
                                        {copiedState==3 && <div>
                                            <InputGroup className="mb-3 mt-4" id="search">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon1">Google meet URL</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    placeholder="meet.google.com/xxx-yyy-zzz"
                                                    value={meetRoom}
                                                    onChange={e=>{
                                                        let url = e.target.value.match(/(https:\/\/meet\.google\.com\/.+)/);
                                                        if(url){
                                                            let meetUrl=url[1].split('?');
                                                            setMeetRoom(meetUrl[0]);
                                                        }else{
                                                            toast.error('No Google meet url found.')
                                                        }
                                                    }}
                                                />
                                                <InputGroup.Append>
                                                    <Button variant="danger" onClick={e=>{broadcast()}}>Broadcast</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </div>
                                        }
                                        {copiedState==4 &&
                                        <>
                                            <Alert variant="success" className="mt-2">Broadcasting... <Badge variant="danger">{meetRoom}</Badge> to every client.</Alert>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>User pairing tool</Form.Label>
                                                        <Form.Control as="textarea" rows={7} value={userPairingText} onChange={e=>setUserPairingText(e.target.value)}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>User pairing results</Form.Label>
                                                        {userPairing
                                                            ?
                                                            <Table>
                                                                <thead>
                                                                <tr>
                                                                    <th>Code</th>
                                                                    <th>Name</th>
                                                                    <th>Google meet name</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {Object.keys(userPairing).map((pair,i)=>{
                                                                    let student=userPairing[pair];
                                                                   return  <tr key={student.StudentID+'_'+i}>
                                                                       <td>{student.pairError
                                                                           ?
                                                                           <div>{student.StudentID}
                                                                               <Badge className="ml-1" variant="danger">
                                                                                   Existed -> {student.avatar_name}
                                                                               </Badge>
                                                                           </div>
                                                                           :
                                                                           student.StudentID}
                                                                       </td>
                                                                       <td>{student.FirstName_Th} {student.LastName_Th}</td>
                                                                       <td>{pair}</td>
                                                                   </tr>
                                                                    })
                                                                }
                                                                </tbody>
                                                            </Table>
                                                            :
                                                            <div>Waiting... input</div>

                                                        }
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            {userPairing && Object.keys(userPairing).length>0 &&
                                            <>
                                                <Form.Group className="text-center">
                                                    <Button onClick={e=>pairUser()} className="mr-4">Pair</Button>
                                                    <Button onClick={e=>pairUserAndApprove()} variant="secondary">Pair and approve</Button>
                                                </Form.Group>
                                            </>
                                            }
                                        </>
                                        }
                                    </div>
                                    }
                                    </Form.Group>
                                {meetRoom && token && copiedState==4 &&
                                    <div className="mb-2">
                                        {/*<FormLabel style={{color:'green'}}>Google meet token:</FormLabel> <FormControl type="text" value={`${meetRoom}?token=${token}`} onClick={e=>e.target.select()}/>*/}
                                        <InputGroup className="mb-3">
                                            <FormControl readOnly type="text" defaultValue={`${meetRoom}?token=${token}`} onClick={e=>e.target.select()}/>
                                            <InputGroup.Append>
                                                <a className="btn btn-dark" target='_blank' href={`${meetRoom}?token=${token}`}>Start Google Meet Admin</a>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {meetRoom && token && copiedState==4 &&
                            <Row>
                                <Col>
                                    <Card className="mb-4">
                                        <Card.Header>Leave logs</Card.Header>
                                        <Card.Body>
                                            <div ref={divLeaveLog} style={{maxHeight:'200px',overflowY:'auto'}}>
                                                {rejectLogs && rejectLogs.length>0?
                                                    <ListGroup>
                                                        {
                                                            rejectLogs.map((logData,i)=>{
                                                                return <ListGroup.Item variant='danger' key={logData.created}>
                                                                    <Row>
                                                                        <Col>{rejectLogs.length-i}) {logData.log}</Col>
                                                                        <Col xs='auto'>{moment.unix(logData.created).format('DD/MM/YYYY HH:mm:ss')}</Col>
                                                                    </Row>
                                                                </ListGroup.Item>
                                                            })
                                                        }
                                                    </ListGroup>
                                                    :
                                                    <div>- No logs -</div>
                                                }

                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            }
                            <Row>
                                <Col xs={'auto'}>
                                    <h3>นักศึกในกลุ่ม <span className="text-uppercase">{group}</span></h3>
                                </Col>
                                <Col>
                                    <Button variant="outline-secondary" className="ml-2" onClick={e=>setShowEmail(true)}>View email</Button>
                                </Col>
                            </Row>
                            <div dangerouslySetInnerHTML={{__html:schedule.DateRegist_Desc_Th}}></div>
                            <div>ภาค {schedule.ModuleType==1?<Badge variant="danger">ทฤษฎี</Badge>:<Badge variant="info">ปฏิบัติ</Badge>} ประจำวันที่ {schedule.ExamDate} / {schedule.ExamTimeStart}-{schedule.ExamTimeEnd}</div>
                            <InputGroup className="mb-3 mt-4" id="search">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">ค้นหา</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Code | Avatar name | FName | LName | Email"
                                    value={filter}
                                    onChange={e=>setFilter(e.target.value)}
                                />
                                <InputGroup.Append>
                                    <Button variant="dark" onClick={e=>setFilter('')}>Reset</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            {/*<div className="table-responsive">*/}
                                <Table className="sticky table-hover">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Picture</th>
                                    <th>Code</th>
                                    <th>Avatar name</th>
                                    <th>Name</th>
                                    <th className="d-none d-md-table-cell">Email</th>
                                    <th className="d-none d-md-table-cell">Status</th>
                                    <th>Check In</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    students && students
                                        .filter(std=>{
                                            if(!filter)return true;
                                            let regExp=new RegExp(`${filter}`,'ig');
                                            return (
                                                std.StudentID.match(regExp)
                                                || std.FirstName_Th.match(regExp)
                                                || std.LastName_Th.match(regExp)
                                                || std.email.match(regExp)
                                                || (std.avatar_name && std.avatar_name.match(regExp))
                                            )
                                        })
                                        .map((std, i) =>
                                            <tr key={'std_'+i} className={std.check_in_status=='1' ? 'text-success text-white' : ''}>
                                                <td>{i + 1}</td>
                                                <td width="150">
                                                    {typeof state.studentPicture[std.Username] == 'undefined'?
                                                        <Alert variant='info'>Loading...</Alert>
                                                        :
                                                        <>
                                                            {state.studentPicture[std.Username]?
                                                                <Image src={(state.studentPicture[std.Username].cache?Config.baseUrl:'')+state.studentPicture[std.Username].student_image_data} fluid rounded/>
                                                                :
                                                                <Image style={{opacity:'0.3'}} src={`${Config.basePath}/images/user_avatar.svg`} fluid rounded/>
                                                            }
                                                        </>
                                                    }
                                                </td>
                                                <td style={{whiteSpace:'nowrap'}}>
                                                    {std.StudentID}
                                                    <div>
                                                        <Button className="mt-2" variant="warning" onClick={async e=>{
                                                            setSelectedStd(std);
                                                            setShowMsg(true);
                                                            await getRecentMessage(std);
                                                        }}>MSG</Button>
                                                    </div>
                                                </td>
                                                <td>{std.avatar_name?<strong variant='info' style={{fontSize:'110%'}}>{std.avatar_name}</strong>:'Not pair'}</td>
                                                <td>{std.FirstName_Th} {std.LastName_Th}</td>
                                                <td className="d-none d-md-table-cell"><p style={{wordBreak:'break-word'}}>{std.email}</p></td>
                                                <td className="d-none d-md-table-cell">
                                                    {
                                                        std.check_in_status=='1'
                                                            ? <Badge variant="success" className="ml-1">Approved</Badge>
                                                            : <Badge variant="info" className="ml-1">Waiting</Badge>
                                                    }
                                                    {
                                                        std.IPAddress && <Badge variant="warning" className="ml-1">{std.IPAddress}</Badge>
                                                    }
                                                    <div>
                                                        {
                                                            std.IsStart && <Badge variant="secondary" className="ml-1">Logged In</Badge>
                                                        }
                                                        {
                                                            (std.IsEnd && std.IsEnd!='0') && <Badge variant="danger" className="ml-1"><span style={{cursor:'pointer'}} href='#' onClick={e=>{
                                                                confirmBox('Un-Send',`Remove finish state for this ${std.StudentID} ?`,async ()=>{
                                                                    let result = await unSend(std.StdRegistID);
                                                                    if(!result.error){
                                                                        setStudents(prevState => {
                                                                            let existed = prevState.find(v=>v.StudentID==std.StudentID)
                                                                            existed.IsEnd=null;
                                                                            return [...prevState];
                                                                        })
                                                                    }
                                                                })
                                                            }}>Exited</span></Badge>
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    {std.check_in_status=='1'
                                                        ? <Button variant="danger" type="button" disabled={loadingBtn[std.StdRegistID]} onClick={reject.bind(this, std)}>Reject{loadingBtn[std.StdRegistID]?'...':''}</Button>
                                                        : <Button variant="success" type="button" disabled={loadingBtn[std.StdRegistID]} onClick={approve.bind(this, std)}>Approve{loadingBtn[std.StdRegistID]?'...':''}</Button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                }
                                </tbody>
                            </Table>
                            {/*</div>*/}
                        </Col>
                    </Row>
                    <Modal show={showMsg} onHide={e=> {
                        setShowMsg(false)
                        setSelectedStd(null);
                        setMsg('');
                    }}>
                        <Modal.Header>Send Message to {selectedStd?
                            `${selectedStd.StudentID} / ${selectedStd.FirstName_Th} ${selectedStd.LastName_Th}`
                            :
                            'Loading...'
                        }</Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Message text</Form.Label>
                                <Form.Control as="textarea" ref={textAreaMsg} onChange={e=>{
                                    let v = e.target.value;
                                    setMsg(v);
                                }} value={msg} />
                            </Form.Group>
                            {Array.isArray(recentChat) && recentChat.length>0 &&
                            <ListGroup>
                                {
                                    recentChat.map(chat=>
                                        <ListGroup.Item>{moment.unix(chat.created).format('HH:mm:ss')} - {chat.message}</ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='light' onClick={e=>setShowMsg(false)}>Close</Button>
                            <Button variant='dark' onClick={e=>sendMsg()}>Send Message</Button>
                        </Modal.Footer>
                    </Modal>

                <Modal show={showRejectMsg} onHide={e=> {
                    setShowRejectMsg(false)
                    setSelectedStd(null);
                    setRejectMsg('');
                }}>
                    <Modal.Header>Reject Message</Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Cause</Form.Label>
                            <Form.Control as="textarea" ref={textAreaRejectMsg} onChange={e=>{
                                let v = e.target.value;
                                setRejectMsg(v);
                            }} value={rejectMsg} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='light' onClick={e=>setShowRejectMsg(false)}>Close</Button>
                        <Button variant='dark' onClick={e=>sendRejectMsg()}>Send and Reject</Button>
                    </Modal.Footer>
                </Modal>
                    <Modal show={showEmail} onHide={e=>setShowEmail(false)}>
                        <Modal.Header closeButton>
                            <span className="text-uppercase">Email {group}:</span>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control rows={20} as="textarea" onChange={e=>{}} onClick={e=>e.target.select()} value={getEmail()}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={e=>setShowEmail(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <ScrollToTop showUnder={160}>
                        <img src={`${Config.basePath}/images/up_arrow_round.png`}/>
                    </ScrollToTop>
                </>
                : <div>Loading...</div>
        }
    </div>
}
export default observer(ViewStudent);
