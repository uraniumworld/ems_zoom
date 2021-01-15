import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {Badge, Button, Col, Form, FormControl, InputGroup, Row, Table} from "react-bootstrap";
import {render} from "@testing-library/react";
import { uid } from 'uid';
import {
    changeCheckInState,
    getCheckInStudents,
    getEmailByScheduleDetail,
    getScheduleInfo
} from "../components/services";
import {toast} from "react-toastify";

const ViewStudent = () => {
    const state = useContext(StateContext);
    const {SchdID, SchdDetailID,group} = useParams();
    const [schedule, setSchedule] = useState();
    const [show,setShow] = useState(true);
    const [room,setRoom] = useState('');
    const [srcRoom,setSrcRoom] = useState(null);
    const [students,setStudents] = useState([]);
    const [loadingBtn,setLoadingBtn] = useState({});
    const [filter,setFilter] = useState(null);

    useEffect(() => {
        state.scheduleMenu = [
            {to: `/schedule/${SchdID}/${SchdDetailID}`, title: 'Group'},
            {to: `/schedule/${SchdID}/${SchdDetailID}/${group}`, title: 'Students'}
        ];
        getCheckInStudents(SchdID,SchdDetailID,group).then(res=>{
            setStudents(res);
        });
        getScheduleInfo(SchdID,SchdDetailID).then(res=>{
            setSchedule(res);
        })
        // setTimeout(() => {
        //     let fakeData = {
        //         schedule:{
        //             id: 1,
        //             schedule: 'ems-121212',
        //             examDate: '12-12-12',
        //             studentCount: 50,
        //         },
        //         students:[
        //             {
        //                 code: '602254535-2',
        //                 email: 'ffff@kkumail.com',
        //                 fullname: 'xxxx oooo',
        //                 approved: false,
        //                 logged: false,
        //             },
        //             {
        //                 code: '612234350-5',
        //                 email: 'gggg@kkumail.com',
        //                 fullname: 'nnn qqqq',
        //                 approved: true,
        //                 logged: true,
        //             },
        //         ]
        //     };
        //     setSchedule(fakeData);
        // }, 500);

    }, []);

    function approve(std) {
        chState(std,1);
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

    return <div>
        {
            schedule
                ? <>
                    <Form.Group>
                        <Button variant="outline-secondary" onClick={e=>{
                            let id = uid();
                            setRoom(id)
                            setSrcRoom('https://meet.kku.ac.th/'+id);
                        }}>Start room</Button>
                        {room &&
                        <>
                            <span className="ml-2">Room: <Badge variant="info">{room}</Badge></span>
                            <div className="text-center"><Button variant="success">Broadcast</Button></div>
                        </>
                        }
                    </Form.Group>
                    {
                        srcRoom &&
                        <iframe allow="camera; microphone; fullscreen; display-capture" src={srcRoom} style={
                            {
                                height: show?'50vh':'calc(100vh - 100px)',
                                width: '100%',
                                border: '0px'
                            }
                        }></iframe>
                    }
                    {/*<Button onClick={e=>{*/}
                    {/*    setShow(old=>!old);*/}
                    {/*}}>{show?'Hide':'Show'}</Button>*/}
                    <Row>
                        <Col>
                            <h3>นักศึกในกลุ่ม <span className="text-uppercase">{group}</span></h3>
                            <InputGroup className="mb-3" id="search">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">ค้นหา</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Code | FName | LName | Email"
                                    value={filter}
                                    onChange={e=>setFilter(e.target.value)}
                                />
                                <InputGroup.Append>
                                    <Button variant="dark" onClick={e=>setFilter('')}>Reset</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Code</th>
                                    <th>Fullname</th>
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