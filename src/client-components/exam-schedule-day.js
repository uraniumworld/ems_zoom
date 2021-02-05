import Header from "./header";
import {Alert, Badge, Button, Card, Col, Container, Row} from "react-bootstrap";
import classNames from 'classnames'
import {useHistory} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faCheck, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
const striptags = require('striptags');

const ExamScheduleDay = ({schedules})=>{
    console.log(schedules);
    const history = useHistory();
    if(!schedules)return <div>Loading...</div>
    return <div>
        <Header/>
        <Container className="mt-4">
            <Row>
                {Array.isArray(schedules) && schedules.length>0?
                    <>
                        {
                            schedules.map(schd=>{
                                return <Col key={schd.SchdDetailID} md={6} className="mb-2">
                                    <Card>
                                        <Card.Header>
                                            <div>{striptags(schd.DateRegist_Desc_Th)}</div>
                                        </Card.Header>
                                        <Card.Body>
                                            {schd.ModuleType=='1'?
                                                <Badge variant='danger' className="mr-2 mb-2" style={{fontSize:'100%'}}>Theory</Badge>
                                                :
                                                <Badge variant='info' className="mr-2 mb-2" style={{fontSize:'100%'}}>Workshop</Badge>
                                            }
                                            <div><strong>Exam Code:</strong> #{schd.SchdCode}</div>
                                            <span><strong>Date/Time:</strong> {schd.ExamDate} / {schd.ExamTimeStart}-{schd.ExamTimeEnd}</span>
                                        </Card.Body>
                                        <Card.Footer>
                                            <div className="text-right">
                                                {schd.IsEnd=='1'?
                                                    <>
                                                        <Button variant="success" disabled={true} className="mr-2 disabled">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2"/>
                                                            <span>Submitted</span>
                                                        </Button>
                                                        <a href="https://kku.world/exam" target='_blank' className="btn btn-info" >
                                                            <span className="mr-1">Go to profile page</span>
                                                            <FontAwesomeIcon icon={faArrowRight}/>
                                                        </a>
                                                    </>
                                                    :
                                                    <Button variant='primary' className="ml-auto" onClick={e=>{
                                                        let examType = schd.ModuleType=='2'?'workshop':'theory';
                                                        history.push(`/exam/${examType}/${schd.StdRegistID}`)
                                                    }}>Start Exam</Button>
                                                }
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            })
                        }
                    </>
                    :
                    <Col>
                        <Alert variant='danger'>No schedule in this time.</Alert>
                    </Col>
                }

            </Row>
        </Container>
    </div>
}
export default ExamScheduleDay;
