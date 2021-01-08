import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {Badge, Button, Table} from "react-bootstrap";
import {render} from "@testing-library/react";

const ViewStudent = () => {
    const state = useContext(StateContext);
    const {id, group} = useParams();
    const [schedule, setSchedule] = useState();

    useEffect(() => {
        state.scheduleMenu = [
            {to: '/schedule/' + id, title: 'Group'},
            {to: `/schedule/${id}/${group}`, title: 'Students'}
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
                </>
                : <div>Loading...</div>
        }
    </div>
}
export default observer(ViewStudent);