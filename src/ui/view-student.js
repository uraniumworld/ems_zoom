import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {Badge, Button, Form, FormControl, InputGroup, Table} from "react-bootstrap";
import {render} from "@testing-library/react";
import { uid } from 'uid';

const ViewStudent = () => {
    const state = useContext(StateContext);
    const {SchdID, SchdDetailID,group} = useParams();
    const [schedule, setSchedule] = useState();
    const [show,setShow] = useState(true);
    const [room,setRoom] = useState('');
    const [srcRoom,setSrcRoom] = useState(null);

    useEffect(() => {
        state.scheduleMenu = [
            {to: `/schedule/${SchdID}/${SchdDetailID}`, title: 'Group'},
            {to: `/schedule/${SchdID}/${SchdDetailID}/${group}`, title: 'Students'}
        ];
        setTimeout(() => {
            let fakeData = {
                schedule:{
                    id: 1,
                    schedule: 'ems-121212',
                    examDate: '12-12-12',
                    studentCount: 50,
                },
                students:[
                    {
                        code: '602254535-2',
                        email: 'ffff@kkumail.com',
                        fullname: 'xxxx oooo',
                        approved: false,
                        logged: false,
                    },
                    {
                        code: '612234350-5',
                        email: 'gggg@kkumail.com',
                        fullname: 'nnn qqqq',
                        approved: true,
                        logged: true,
                    },
                ]
            };
            setSchedule(fakeData);
        }, 500);

    }, []);

    function approve(std) {
        setSchedule(old => {
            let student = old.students.find(s => s.code == std.code);
            if (student) student.approved = true;
            return {...old};
        });
    }

    function reject(std) {
        setSchedule(old => {
            let student = old.students.find(s => s.code == std.code);
            if (student) student.approved = false;
            return {...old};
        });
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

                    <Button onClick={e=>{
                        setShow(old=>!old);
                    }}>{show?'Hide':'Show'}</Button>
                    <div style={{display:show?'block':'none'}}>
                        <h3>นักศึกในกลุ่ม {group}</h3>
                        <Table>
                            <thead>
                            <tr>
                                <td>#</td>
                                <td>Code</td>
                                <td>Fullname</td>
                                <td>Email</td>
                                <td>Status</td>
                                <td>Check In</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                schedule.students.map((std, i) =>
                                    <tr key={std.code} className={std.approved ? 'bg-success text-white' : ''}>
                                        <td>{i + 1}</td>
                                        <td>{std.code}</td>
                                        <td>{std.fullname}</td>
                                        <td>{std.email}</td>
                                        <td>
                                            {
                                                std.approved
                                                    ? <Badge variant="light">Approved</Badge>
                                                    : <Badge variant="info">Waiting</Badge>
                                            }
                                            {
                                                std.logged && <Badge variant="secondary" className="ml-2">Logged In</Badge>
                                            }
                                        </td>
                                        <td>
                                            {std.approved
                                                ? <Button variant="danger" onClick={reject.bind(this, std)}>Reject</Button>
                                                : <Button variant="success" onClick={approve.bind(this, std)}>Approve</Button>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>
                </>
                : <div>Loading...</div>
        }
    </div>
}
export default observer(ViewStudent);