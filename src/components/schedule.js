import {Alert, Badge, Button, Card, Col, Row, Modal, Form} from "react-bootstrap";
import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import Config from "../config";
import {getEmailByScheduleDetail, getSchedules} from "./services";
import {$mobx} from "mobx";

const Schedule = ({month,year}) => {
    const [showModal, setShowModal] = useState(false);
    const [studentsWithGroup, setStudentsWithGroup] = useState(null);
    const [schedules,setSchedules] = useState(null);
    const state = useContext(StateContext);

    useEffect(()=>{
        state.scheduleMenu=[];
    },[]);

    useEffect(()=>{
       getSchedules(month,year).then(results=>{
           setSchedules(results);
       });
    },[month,year]);

    async function showEmail(schd){
        let studentsWithGroup = await getEmailByScheduleDetail(schd.SchdID,schd.SchdDetailID);
        setStudentsWithGroup(studentsWithGroup);
        setShowModal(true);
    }
    function hideModal(){
        setStudentsWithGroup(null);
        setShowModal(false);
    }
    return <>
        <h3>รอบสอบของ ปี {year}</h3>
        {
            schedules && Object.keys(schedules).map(day => {
                return (
                    <Card key={day} className="mt-2">
                        <Card.Header>
                            <Card.Text>การสอบวันที่ {day}</Card.Text>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {schedules[day].map((schd,i) =>
                                    <SchdBlock key={`${schd.examDate}_${i}`} schd={schd} onEmail={showEmail.bind(this,schd)}/>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                )
            })
        }
        <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                {studentsWithGroup
                    ?<Modal.Title>Email ในรอบสอบ {studentsWithGroup.title}</Modal.Title>
                    :<Modal.Title>Loading...</Modal.Title>
                }
            </Modal.Header>
            <Modal.Body>
                {
                    studentsWithGroup
                        ?<>
                            {
                                Object.keys(studentsWithGroup).map(group=>{
                                    let emailText='';
                                    return <div key={group}>
                                        <h3 style={{textTransform:'capitalize'}}>{group}</h3>
                                        {
                                            studentsWithGroup[group].map(std=>{
                                                emailText+=`${std.RegKKU.KKUMAIL},`
                                            })
                                        }
                                        <Form.Control rows={5} as='textarea'
                                                      onChange={e=>{}}
                                                      onClick={e=>e.target.select()}
                                                      value={emailText.substr(0,emailText.length-1)}/>
                                    </div>
                                })
                            }
                        </>
                        :<div>Loading....</div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={hideModal}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}


const SchdBlock = ({schd,onEmail}) => {
    const history = useHistory();
    return <Col md={4}>
        <div style={{padding: '10px'}}>
            <Card>
                <Card.Header>
                    <Card.Title>
                        <small>{schd.ExamTimeStart}-{schd.ExamTimeEnd}</small>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="text-center">
                    {schd.ModuleType=="1"?<Alert variant="danger">ทฤษฎี</Alert>:<Alert variant="info">ปฏิบัติ</Alert>}
                        <div className="text-center">
                            <Button className="ml-2" onClick={e => history.push(Config.adminPath(`/schedule/${schd.SchdID}/${schd.SchdDetailID}`))}>Enter</Button>
                            <Button variant="secondary" className="ml-2" onClick={onEmail}>Email</Button>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Card.Text className="text-right">Seats: {schd.NumberOfSeats}</Card.Text>
                </Card.Footer>
            </Card>
        </div>
    </Col>
}

export default observer(Schedule);
