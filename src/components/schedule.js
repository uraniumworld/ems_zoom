import {Alert, Badge, Button, Card, Col, Row, Modal, Form} from "react-bootstrap";
import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import Config from "../config";
import {getSchedules} from "./services";
import {$mobx} from "mobx";

const Schedule = ({month,year}) => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
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

    function showEmail(schd){
        setTimeout(()=>{
            let exampleContent={
                Group1:[
                    '123456@kkumail.com',
                    '123456@kkumail.com',
                    '123456@kkumail.com',
                    '123456@kkumail.com',
                ],
                Group2:[
                    '123456@kkumail.com',
                    '123456@kkumail.com',
                    '123456@kkumail.com',
                    '123456@kkumail.com',
                ]
            };
            setModalContent({title: schd.examDate,content:getContent(exampleContent)});
        },500);
        setShowModal(true);
    }
    function hideModal(){
        setModalContent(null);
        setShowModal(false);
    }
    function getContent(groupData){
        let text='';
        Object.keys(groupData).map(group=>{
            text+=group+'\n';
            groupData[group].map(email=>{
                text+=email+'\n';
            })
        });
        return text;
    }
    return <>
        <h3>รอบสอบของ ปี {year}</h3>
        {
            Array.isArray(schedules) && schedules.map(schedule => {
                return (
                    <Card key={schedule.SchdDetailID} className="mt-2">
                        <Card.Header>
                            <Card.Text>การสอบวันที่ {schedule.ExamDate} {schedule.ExamTimeStart}-{schedule.ExamTimeEnd}</Card.Text>
                        </Card.Header>
                        <Card.Body>
                            {/*<Row>*/}
                            {/*    {day.schedules.map((schd,i) =>*/}
                            {/*        <SchdBlock key={`${schd.examDate}_${i}`} schd={schd} onEmail={showEmail.bind(this,schd)}/>*/}
                            {/*    )}*/}
                            {/*</Row>*/}
                        </Card.Body>
                    </Card>
                )
            })
        }
        <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                {modalContent
                    ?<Modal.Title>Email ในรอบสอบ {modalContent.title}</Modal.Title>
                    :<Modal.Title>Loading...</Modal.Title>
                }
            </Modal.Header>
            <Modal.Body>
                {
                    modalContent
                    ?<Form.Control as="textarea"
                                   rows={20}
                                   value={modalContent.content}
                                   onChange={()=>{}}
                        ></Form.Control>
                    :'Loading...'
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
                    <Card.Title>เวลา: {schd.examDate}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="text-center">
                        <Alert variant="info">{schd.schedule}</Alert>
                        <div className="text-center">
                            <Button className="ml-2" onClick={e => history.push('/schedule/' + schd.id)}>Enter</Button>
                            <Button variant="secondary" className="ml-2" onClick={onEmail}>Email</Button>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Card.Text className="text-right">Student: {schd.studentCount}</Card.Text>
                </Card.Footer>
            </Card>
        </div>
    </Col>
}

export default observer(Schedule);
