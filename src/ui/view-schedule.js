import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {Link, useParams} from 'react-router-dom';
import {Button, Card, Col, Row} from "react-bootstrap";

const ViewSchedule = () => {
    const {students} = useContext(StateContext);
    const {id, group} = useParams();
    const [schedule,setSchedule] = useState(null);
    console.log('===', id, group);

    useEffect(()=>{
        setTimeout(()=>{
            const schedule={
                id: 1,
                examCode: 'ems-121212',
                examDate: '12-12-12',
                studentCount: 50,
                students:{
                    Group1:[
                        {
                            code: '602254535-2',
                            email: 'ffff@kkumail.com',
                            fullname: 'xxxx oooo',
                            approved: true,
                        },
                        {
                            code: '602253343-2',
                            email: 'ttttee@kkumail.com',
                            fullname: 'ffgf ssss',
                            approved: false,
                        }
                    ],
                    Group2:[
                        {
                            code: '602254535-2',
                            email: 'ffff@kkumail.com',
                            fullname: 'xxxx oooo',
                            approved: true,
                        },
                        {
                            code: '602253343-2',
                            email: 'ttttee@kkumail.com',
                            fullname: 'ffgf ssss',
                            approved: false,
                        }
                    ]
                }
            };
            setSchedule({...schedule});
        },500);
    },[]);

    function getGroup() {
        let key = Object.keys(schedule.students)[group ? group - 1 : 0];
        console.log('===', key);
        return students[key] || [];
    }
    if(!schedule)return <div>Loading...</div>
    return <>
        <h3>รอบสอบ {schedule.examCode} ซึ่งมีทั้งหมด {Object.keys(schedule.students).length} กลุ่ม</h3>
        <Row>
            {
                Object.keys(schedule.students).map(grp =>
                    <Col key={grp}>
                        <Card>
                            <Card.Body>
                                {grp} <Link to={`/schedule/${id}/${grp}`} className="btn btn-primary">View</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            }
        </Row>
    </>
}
export default observer(ViewSchedule);