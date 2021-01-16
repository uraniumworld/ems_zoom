import {Alert, Button, Card, Col, Container, FormControl, Nav, Navbar, Row} from "react-bootstrap";
import Footer from "../components/footer";
import React, {useEffect, useState} from "react";
import {Form} from "formik";
import {getWorkshopQuestion} from "../client-components/client-services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileWord,faFileExcel,faFilePowerpoint,faDatabase } from '@fortawesome/free-solid-svg-icons'
import classNames  from "classnames";
import {useParams} from "react-router-dom";

const Workshop = ()=>{
    const [questions,setQuestions]=useState();
    const [filter,setFilter]=useState('1');
    const {id} = useParams();

    useEffect(()=>{
        getWorkshopQuestion(id).then(data=>setQuestions(data))
    },[]);

    function getPracticeName(PracticeID){
        switch (PracticeID){
            case '1':
                return 'MS-Word';
            case '2':
                return 'MS-Excel';
            case '3':
                return 'MS-Powerpoint';
            case '4':
                return 'MS-Access';
        }
    }

    if(!questions)return <Alert variant='info'>Loading...</Alert>
    return <>
        <div className="container-wrapper">

            <div className="exam-sidebar">
                <ul>
                    {questions.map(q=>{
                        let icon;
                        let color;
                        switch (q.PracticeID){
                            case '1':
                                icon=faFileWord;
                                color='#0062cc';
                                break;
                            case '2':
                                icon=faFileExcel;
                                color='#1e7e34';
                                break;
                            case '3':
                                icon=faFilePowerpoint;
                                color='#d39e00';
                                break;
                            case '4':
                                icon=faDatabase;
                                color='#ea2971';
                                break;
                        }
                        return (
                            <li style={{cursor:'pointer',background:color}} className={
                                classNames({
                                'exam-workshop-active':filter==q.PracticeID,
                                'exam-word-color':q.PracticeID==1,
                                'exam-excel-color':q.PracticeID==2,
                                'exam-powerpoint-color':q.PracticeID==3,
                                'exam-access-color':q.PracticeID==4,
                            })} onClick={e=>setFilter(q.PracticeID)}>
                                <FontAwesomeIcon style={{fontSize:'50px'}} icon={icon} />
                            </li>
                        )
                    })}
                </ul>
            </div>
            <Container className="exam-container">
                <div className="exam-top-menu">
                    <Navbar bg="light" expand="md">
                        <Navbar.Brand href="#home">EMS KKU - Workshop</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse>
                            <Nav className="ml-auto">
                                <Nav.Link href="#home">
                                    <Button variant='primary'>Submit and exit</Button>
                                </Nav.Link>
                                <Nav.Link href="#link">
                                    <Button variant="danger">Logout</Button>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className="exam-content">
                    {
                        questions.filter(question=>question.PracticeID==filter).map((question,i)=>
                            <Row key={'question_'+i}>
                                <Col>
                                    <div className="mb-4">
                                        <Card>
                                            <Card.Header>{getPracticeName(question.PracticeID)}</Card.Header>
                                            <Card.Body><div dangerouslySetInnerHTML={{__html:question.PracticeQuestionTh}}></div></Card.Body>
                                            <Card.Footer className="bg-dark text-light">
                                                <strong className="mr-4">Upload document for score:</strong> <input type='file'/>
                                            </Card.Footer>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        )
                    }
                </div>
            </Container>
        </div>
    </>
}
export default Workshop;
