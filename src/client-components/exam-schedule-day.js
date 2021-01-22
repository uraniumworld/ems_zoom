import Header from "./header";
import {Badge, Button, Card, Col, Container, Row} from "react-bootstrap";
import classNames from 'classnames'
const striptags = require('striptags');

const ExamScheduleDay = ({schedules})=>{
    console.log(schedules);
    if(!schedules)return <div>Loading...</div>
    return <div>
        <Header/>
        <Container className="mt-4">
            <Row>
                {
                    schedules.map(schd=>{
                        return <Col key={schd.SchdDetailID} md={6} className="mb-2">
                            <Card>
                                <Card.Header>
                                    <div>{striptags(schd.DateRegist_Desc_Th)}</div>
                                </Card.Header>
                                <Card.Body>
                                    {schd.ModuleType=='1'?
                                        <Badge variant='danger' className="mr-2">Theory</Badge>
                                        :
                                        <Badge variant='info' className="mr-2">Workshop</Badge>
                                    }
                                    <span>{schd.ExamDate} / {schd.ExamTimeStart}-{schd.ExamTimeEnd}</span>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="text-right">
                                        <Button variant='primary' className="ml-auto">Start Exam</Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    })
                }
            </Row>
        </Container>
    </div>
}
export default ExamScheduleDay;