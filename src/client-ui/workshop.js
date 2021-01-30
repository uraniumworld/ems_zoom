import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    FormControl,
    InputGroup,
    Modal,
    Nav,
    Navbar,
    Row
} from "react-bootstrap";
import Footer from "../components/footer";
import React, {useEffect, useState} from "react";
import {Form} from "formik";
import {download, getWorkshopQuestion, getWorkshopUser, uploadWorkshopFile} from "../client-components/client-services";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileWord, faFileExcel, faFilePowerpoint, faDatabase, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import classNames from "classnames";
import {useParams} from "react-router-dom";
import ClientTopMenu from "../client-components/client-top-menu";
import {toast} from "react-toastify";
import TimerClock from "../client-components/timer-clock";
import ClientWorkshopUploader from "../client-components/client-workshop-uploader";


//http://localhost:3000/exam/workshop/125180/3474


const Workshop = ({scheduleInfo, serverTime}) => {
    const [questions, setQuestions] = useState();
    const [filter, setFilter] = useState('1');
    const [currentUserWorkshop, setCurrentUserWorkshop] = useState(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [o365Link, setO365Link] = useState({});
    const {StdRegistID, SchdDetailID} = useParams();

    useEffect(() => {
        getWorkshopQuestion(StdRegistID, SchdDetailID).then(data => setQuestions(data))
        reloadWorkshopFile();
    }, []);

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

    async function confirmSubmit() {
        await reloadWorkshopFile();
        setShowConfirmSubmit(true);
    }

    function getWorkshopType(typeID) {
        switch (typeID) {
            case '1':
                return <strong>Microsoft Word</strong>;
            case '2':
                return <strong>Microsoft Excel</strong>;
            case '3':
                return <strong>Microsoft Powerpoint</strong>;
            case '4':
                return <strong>Microsoft Access</strong>;
        }
    }

    return <>
        {(scheduleInfo && questions && currentUserWorkshop)
            ?
            <div className="container-wrapper" style={{paddingLeft: '120px'}}>
                <div className="exam-sidebar">
                    <TimerClock serverTime={serverTime}
                                expire={`${scheduleInfo.ExamDate} ${scheduleInfo.ExamTimeEnd}`}/>
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
                    <ClientTopMenu type="workshop" scheduleInfo={scheduleInfo} student={currentUserWorkshop}
                                   confirmSubmit={confirmSubmit}/>
                    <div className="exam-content">
                        <ClientWorkshopUploader
                        title={getWorkshopType(filter)}
                        PracticeID={filter}
                        currentUserWorkshop={currentUserWorkshop}
                        StdRegistID={StdRegistID}
                        onUploadSuccess={(uploaded,e)=>{
                            reloadWorkshopFile();
                        }}
                        onLinkChanged={e=>{
                            let value=e.target.value;
                            setO365Link(prevState => ({
                                ...prevState,
                                [filter]:value,
                            }))
                        }}
                        />
                                    <div>
                                {
                                    questions.filter(question => question.PracticeID == filter).map((question, i) => {
                                    let practice = getPracticeName(question.PracticeID);
                                    return <Row key={'question_' + i}>
                                    <Col>
                                    <div className="mb-4">
                                    <Card>
                                    <Card.Header>
                                    <div style={{color: practice.color}}>{practice.icon} {practice.name} Questions</div>
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
                                    return <Alert key={'wk_'+answer.PracticeID} variant={practice.class}>
                                    <strong className='mr-2'>{practice.icon} {practice.name}</strong>
                                    <a href='#' className={'text-'+practice.class} onClick={e=>{e.preventDefault();download(answer.RowID)}}>{answer.FileName}</a>
                                    <div><span className="mr-2 font-weight-bold">o360 Link:</span><span>{o365Link[answer.PracticeID]?<a href={o365Link[answer.PracticeID]} target='_blank'>{o365Link[answer.PracticeID].substr(0,50)+'...'}</a>:'- No Link -'}</span></div>
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
