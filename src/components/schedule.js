import {Button, Card, Col, Row} from "react-bootstrap";
import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {useHistory} from 'react-router-dom';

const SchdBlock=({schd})=>{
    const history = useHistory();
    return <Col md={4}>
        <div style={{padding:'10px'}}>
            <Card>
                <Card.Header>
                    <Card.Title>
                        เวลา: {schd.examDate}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {schd.schedule}
                    <Button className="ml-2" onClick={e=>history.push('/schedule/'+schd.id)}>View</Button>
                </Card.Body>
                <Card.Footer>
                    <Card.Text className="text-right">Student: {schd.studentCount}</Card.Text>
                </Card.Footer>
            </Card>
        </div>
    </Col>
}
const Schedule = ()=>{
    const {daySchedule} = useContext(StateContext);
    return <>
        <h3 className="title">การสอบวันที่ {daySchedule.date}</h3>
        <Row>
            {daySchedule.schedules.map(schd=>
                <SchdBlock schd={schd}/>
            )}
        </Row>
    </>
}
export default observer(Schedule);