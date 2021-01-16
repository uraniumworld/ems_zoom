import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {Alert, Badge, Button, Col, Form, FormControl, InputGroup, Row, Table} from "react-bootstrap";
import {render} from "@testing-library/react";
import { uid } from 'uid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
    changeCheckInState,
    getCheckInStudents,
    getEmailByScheduleDetail, getMeetURL,
    getScheduleInfo, removeMeetURL, setMeetURL,pairUserData
} from "../components/services";
import {toast} from "react-toastify";

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

    useEffect(() => {
        state.scheduleMenu = [
            {to: `/schedule/${SchdID}/${SchdDetailID}`, title: 'Group'},
            {to: `/schedule/${SchdID}/${SchdDetailID}/${group}`, title: 'Students'}
        ];
        getMeetURL(SchdID,SchdDetailID,group).then(data=>{
            if(data){
                setMeetRoom(data.meet_url);
                setCopiedState(4);
            }
        });
        getCheckInStudents(SchdID,SchdDetailID,group).then(res=>{
            setStudents(res);
        });
        getScheduleInfo(SchdID,SchdDetailID).then(res=>{
            setSchedule(res);
        })

    }, []);

    useEffect(()=>{
        let textArr=userPairingText.split(/\n/);
        let buffer={};
        let currentName=null;
        let expGetName=new RegExp('([a-zA-Z\\. _\\-]+)(?:\\d+:\\d+) ?(?:AM|PM)?',);
        let expGetCode=new RegExp('((?:\\d{9}\\-\\d{1})|(?:\\d{10}))',);
        textArr.map(line=>{
            let name=line.match(expGetName);
            let code=line.match(expGetCode);
            if(name){
                currentName=name[1].trim();
            }else if(currentName && code){
                let existed = students.find(student=>student.StudentID==fixStudentCode(code[1]));
                if(existed){
                    buffer[currentName]=existed;
                }
            }
        })
        console.log('==',buffer);
        if(Object.keys(buffer).length>0){
            setUserPairing({...buffer});
        }else{
            setUserPairing(null);
        }
    },[userPairingText]);

    function approve(std) {
        chState(std,1);
    }

    function fixStudentCode(code){
        if(!code.match(/\d{9}\-\d{1}/)){
            return code.substr(0,9)+'-'+code.substr(-1)
        }
        return code;
    }

    async function reject(std) {
        chState(std,0);
    }

    async function chState(std,state){
        setLoadingBtn(prevState => ({...prevState,[std.StdRegistID]:true}))
        await changeCheckInState(std.StdRegistID,state);
        let reloadData = await getCheckInStudents(SchdID,SchdDetailID,group);
        if(state==1){
            toast.success(std.StudentID+' Approved.');
        }else{
            toast.warning(std.StudentID+' Rejected.');
        }
        setStudents(reloadData);
        setLoadingBtn(prevState => ({...prevState,[std.StdRegistID]:false}))
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
        await setMeetURL(SchdID,SchdDetailID,group,meetRoom);
        setCopiedState(4);
        toast.success(`Broadcast success.`);
    }

    async function pairUser(){
        if(!userPairing) return;
        let buffer=[];
        Object.keys(userPairing).map(pair=>{
            let student=userPairing[pair];
            if(student){
                let {Username,StudentID}=student;
                buffer.push({
                    Username,
                    avatar_name:pair,
                    SchdID,
                    SchdDetailID,
                    group
                });
            }

        })
        console.log(buffer);
        await pairUserData(buffer);
        let reloadData = await getCheckInStudents(SchdID,SchdDetailID,group);
        setStudents(reloadData);

    }

    return <div>
        {
            schedule
                ? <>
                    <Row>
                        <Col>
                            <div>
                                <Form.Group>
                                    {copiedState==4
                                        ?
                                        <Button variant="danger" onClick={e=>{
                                            removeMeetURL(SchdID,SchdDetailID,group).then(()=>{
                                                setCopiedState(0);
                                                setMeetRoom('');
                                            })
                                        }}>Stop Google meet</Button>
                                        :
                                        <CopyToClipboard text={getEmail()}
                                                          onCopy={()=>{startGoogleMeet()}}
                                        >
                                            <Button variant="secondary">Start Google meet</Button>
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
                                                    onChange={e=>setMeetRoom(e.target.value)}
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
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>User pairing tool</Form.Label>
                                                        <Form.Control as="textarea" rows={7} value={userPairingText} onChange={e=>setUserPairingText(e.target.value)}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
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
                                                                {Object.keys(userPairing).map(pair=>{
                                                                    let student=userPairing[pair];
                                                                   return  <tr key={student.StudentID}>
                                                                       <td>{student.StudentID}</td>
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
                                            <Form.Group className="text-center">
                                                <Button onClick={e=>pairUser()}>Pair</Button>
                                            </Form.Group>
                                        </>
                                        }
                                    </div>
                                    }
                                    </Form.Group>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h3>นักศึกในกลุ่ม <span className="text-uppercase">{group}</span></h3>
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
                            <Table className="sticky">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Code</th>
                                    <th>Avatar name</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Check In</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    students && students
                                        .filter(std=>{
                                            if(!filter)return true;
                                            let regExp=new RegExp(`^${filter}`,'ig');
                                            return (
                                                std.StudentID.match(regExp)
                                                || std.FirstName_Th.match(regExp)
                                                || std.LastName_Th.match(regExp)
                                                || std.email.match(regExp)
                                                || (std.avatar_name && std.avatar_name.match(regExp))
                                            )
                                        })
                                        .sort((a,b)=>{
                                            if(a.check_in_status=='1' && b.check_in_status=='0')return 1;
                                            if(a.check_in_status=='0' && b.check_in_status=='1')return -1;
                                            return 0;
                                        }).map((std, i) =>
                                            <tr key={std.StudentID} className={std.check_in_status=='1' ? 'bg-success text-white' : ''}>
                                                <td>{i + 1}</td>
                                                <td>{std.StudentID}</td>
                                                <td>{std.avatar_name?<strong variant='info' style={{fontSize:'110%'}}>{std.avatar_name}</strong>:'Not pair'}</td>
                                                <td>{std.FirstName_Th} {std.LastName_Th}</td>
                                                <td>{std.email}</td>
                                                <td>
                                                    {
                                                        std.check_in_status=='1'
                                                            ? <Badge variant="light" className="ml-1">Approved</Badge>
                                                            : <Badge variant="info" className="ml-1">Waiting</Badge>
                                                    }
                                                    <div>
                                                        {
                                                            std.IsStart && <Badge variant="secondary" className="ml-1">Logged In</Badge>
                                                        }
                                                        {
                                                            std.IsEnd && <Badge variant="danger" className="ml-1">Exited</Badge>
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    {std.check_in_status=='1'
                                                        ? <Button variant="danger" disabled={loadingBtn[std.StdRegistID]} onClick={reject.bind(this, std)}>Reject{loadingBtn[std.StdRegistID]?'...':''}</Button>
                                                        : <Button variant="success" disabled={loadingBtn[std.StdRegistID]} onClick={approve.bind(this, std)}>Approve{loadingBtn[std.StdRegistID]?'...':''}</Button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
                : <div>Loading...</div>
        }
    </div>
}
export default observer(ViewStudent);
