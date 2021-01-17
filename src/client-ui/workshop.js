import {Alert, Badge, Button, Card, Col, Container, FormControl, Modal, Nav, Navbar, Row} from "react-bootstrap";
import Footer from "../components/footer";
import React, {useEffect, useState} from "react";
import {Form} from "formik";
import {download, getWorkshopQuestion, getWorkshopUser, uploadWorkshopFile} from "../client-components/client-services";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileWord, faFileExcel, faFilePowerpoint, faDatabase, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import classNames from "classnames";
import {useParams} from "react-router-dom";


//http://localhost:3000/exam/workshop/125180/3474


const Workshop = () => {
    const [questions, setQuestions] = useState();
    const [filter, setFilter] = useState('1');
    const [currentUserWorkshop, setCurrentUserWorkshop] = useState(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const {StdRegistID, SchdDetailID} = useParams();

    useEffect(() => {
        getWorkshopQuestion(StdRegistID, SchdDetailID).then(data => setQuestions(data))
        reloadWorkshopFile();
    }, []);

    useEffect(() => {
    }, [filter]);

    function getPracticeName(PracticeID, size) {
        switch (PracticeID) {
            case '1':
                return {
                    name: 'Microsoft Word',
                    icon: <FontAwesomeIcon style={{fontSize: size}} icon={faFileWord}/>,
                    color: '#0062cc',
                    class: 'primary',
                };
            case '2':
                return {
                    name: 'Microsoft Excel',
                    icon: <FontAwesomeIcon style={{fontSize: size}} icon={faFileExcel}/>,
                    color: '#1e7e34',
                    class: 'success',
                };
            case '3':
                return {
                    name: 'Microsoft Powerpoint',
                    icon: <FontAwesomeIcon style={{fontSize: size}} icon={faFilePowerpoint}/>,
                    color: '#d39e00',
                    class: 'warning',
                };
            case '4':
                return {
                    name: 'Microsoft Access',
                    icon: <FontAwesomeIcon style={{fontSize: size}} icon={faDatabase}/>,
                    color: '#ea2971',
                    class: 'danger',
                };
        }
    }

    function reloadWorkshopFile() {
        getWorkshopUser(StdRegistID, SchdDetailID).then(data => setCurrentUserWorkshop(data));
    }

    function uploadFile(e) {
        let file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('StdRegistID', StdRegistID);
        formData.append('SchdDetailID', SchdDetailID);
        uploadWorkshopFile(formData);
    }

    async function confirmSubmit() {
        await reloadWorkshopFile();
        setShowConfirmSubmit(true);
    }

    return <>
        {(questions && currentUserWorkshop)
            ?
            <div className="container-wrapper" style={{paddingLeft: '120px'}}>
                <div className="exam-sidebar">
                    <ul>
                        {questions.map((q, i) => {
                            let icon;
                            let color;
                            switch (q.PracticeID) {
                                case '1':
                                    icon = faFileWord;
                                    color = '#0062cc';
                                    break;
                                case '2':
                                    icon = faFileExcel;
                                    color = '#1e7e34';
                                    break;
                                case '3':
                                    icon = faFilePowerpoint;
                                    color = '#d39e00';
                                    break;
                                case '4':
                                    icon = faDatabase;
                                    color = '#ea2971';
                                    break;
                            }
                            return (
                                <li key={'q_' + i} style={{cursor: 'pointer', background: color}} className={
                                    classNames({
                                        'exam-workshop-active': filter == q.PracticeID,
                                        'exam-word-color': q.PracticeID == 1,
                                        'exam-excel-color': q.PracticeID == 2,
                                        'exam-powerpoint-color': q.PracticeID == 3,
                                        'exam-access-color': q.PracticeID == 4,
                                    })} onClick={e => setFilter(q.PracticeID)}>
                                    <span className="mr-1">{i + 1}.</span><FontAwesomeIcon style={{fontSize: '50px'}}
                                                                                           icon={icon}/>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <Container className="exam-container">
                    <div className="exam-top-menu">
                        <Navbar bg="light" expand="md">
                            <Navbar.Brand href="#home">EMS KKU - Workshop</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <Navbar.Collapse>
                                <Nav className="mr-auto">
                                    <Nav.Link href="#home">
                                        <Button variant='primary' onClick={e => confirmSubmit()}>Submit and
                                            exit</Button>
                                    </Nav.Link>
                                </Nav>
                                <Nav className="ml-auto">

                                    <Nav.Link href="#link">
                                        <div>
                                            <Badge className="mr-2">
                                                <span className="mr-2">{currentUserWorkshop.student.StudentID}</span>
                                                <span className="mr-2">|</span>
                                                <span>{currentUserWorkshop.student.FirstName_Th} {currentUserWorkshop.student.LastName_Th}</span>
                                            </Badge>
                                            <Button variant="danger">Logout</Button>
                                        </div>
                                    </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </div>
                    <div className="exam-content">
                        <Card className={classNames(' mb-4', {
                            'bg-primary text-light': filter == '1',
                            'bg-success text-light': filter == '2',
                            'bg-warning text-dark': filter == '3',
                            'bg-danger text-light': filter == '4',
                        })}>
                            <Card.Header>Your workshop documents {(() => {
                                switch (filter) {
                                    case '1':
                                        return <strong>Microsoft Word</strong>;
                                    case '2':
                                        return <strong>Microsoft Excel</strong>;
                                    case '3':
                                        return <strong>Microsoft Powerpoint</strong>;
                                    case '4':
                                        return <strong>Microsoft Access</strong>;
                                }
                            })()}</Card.Header>
                            <Card.Body>
                                {
                                    (() => {
                                        let existed = currentUserWorkshop['practice_answer'].find(v => v.PracticeID == filter);
                                        if (existed) {
                                            return <Badge variant='light' style={{fontSize: '15px'}}>
                                                <Button variant='light' onClick={e => download(existed.RowID)}>
                                                    <FontAwesomeIcon style={{fontSize: '20px'}} className='mr-1'
                                                                     icon={faCheckCircle}/>
                                                    <span>{existed.FileName}</span>
                                                </Button>
                                            </Badge>
                                        } else {
                                            return <span>After you finish please upload your file here.</span>
                                        }
                                    })()
                                }
                            </Card.Body>
                            <Card.Footer className="bg-dark text-light">
                                <strong className="mr-4">Upload document for score:</strong>
                                <input type='file' onChange={e => uploadFile(e)}/>
                            </Card.Footer>
                        </Card>
                        <div>
                            {
                                questions.filter(question => question.PracticeID == filter).map((question, i) => {
                                    let practice = getPracticeName(question.PracticeID);
                                    return <Row key={'question_' + i}>
                                        <Col>
                                            <div className="mb-4">
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Text>
                                                            <h4 style={{color: practice.color}}>{practice.icon} {practice.name} Questions</h4>
                                                        </Card.Text>
                                                    </Card.Header>
                                                    <Card.Body style={{overflowX: 'auto'}}>
                                                        <div
                                                            dangerouslySetInnerHTML={{__html: question.PracticeQuestionTh}}></div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Col>
                                    </Row>
                                })
                            }
                        </div>
                    </div>
                </Container>
                <Modal className='exam-confirm-modal' size='lg' show={showConfirmSubmit} onHide={e => setShowConfirmSubmit(false)}>
                    <Modal.Header closeButton>
                        <span className="text-uppercase">Confirm to submit</span>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-2'><strong>Uploaded file:</strong></div>
                        {
                            currentUserWorkshop.practice_answer.map(answer => {
                                let practice = getPracticeName(answer.PracticeID);
                                return <Alert variant={practice.class}>
                                    <strong className='mr-2'>{practice.icon} {practice.name}</strong>
                                    <a href='#' className={'text-'+practice.class} onClick={e=>{e.preventDefault();download(answer.RowID)}}>{answer.FileName}</a>
                                </Alert>
                            })
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={e => setShowConfirmSubmit(false)}>
                            Yes, Submit and exit
                        </Button>
                        <Button variant="secondary" onClick={e => setShowConfirmSubmit(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            :
            <Alert variant='info'>Loading...</Alert>
        }
    </>
}
export default Workshop;
