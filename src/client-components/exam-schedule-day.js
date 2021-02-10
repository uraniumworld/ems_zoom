import Header from "./header";
import {Alert, Badge, Button, Card, Col, Container, Row} from "react-bootstrap";
import classNames from 'classnames'
import {useHistory} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faCheck, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {observer} from "mobx-react";
const striptags = require('striptags');

const ExamScheduleDay = ({schedules,student})=>{
    // console.log(schedules);
    const state = useContext(StateContext);
    const history = useHistory();
    if(typeof schedules == 'undefined')return <Alert variant='info'>Schedule Loading...</Alert>
    return <div>
        <Header/>
        <Container className="mt-4">
            <Row>
                {Array.isArray(schedules) && schedules.length>0?
                    <>
                        {
                            schedules.map(schd=>{
                                return <Col key={schd.SchdDetailID} lg={6} className="mb-4">
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
                                                        <a href="https://kku.world/exam" target='_blank' className="btn btn-info mr-2" >
                                                            <span className="mr-1">Go to profile page</span>
                                                            <FontAwesomeIcon icon={faArrowRight}/>
                                                        </a>
                                                        {
                                                            state.forceSEB.forceSafeExamBrowser &&
                                                            <a className="btn btn-danger" href="https://exit">Exit</a>
                                                        }
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
                        <Alert variant='danger'>
                            No schedule in this time .
                        </Alert>
                        {
                            state.forceSEB.forceSafeExamBrowser &&
                            <div className="text-center"><a className="btn btn-danger" href="https://exit">Exit</a></div>
                        }
                    </Col>
                }

            </Row>
        </Container>
    </div>
}
export default observer(ExamScheduleDay);
