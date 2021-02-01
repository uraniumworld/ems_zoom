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
import React, {useContext, useEffect, useState} from "react";
import {Form} from "formik";
import {
    download,
    getWorkshopQuestion,
    getWorkshopUser,
    updateO365URL,
    uploadWorkshopFile
} from "../client-components/client-services";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileWord, faFileExcel, faFilePowerpoint, faDatabase, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import classNames from "classnames";
import {useParams} from "react-router-dom";
import ClientTopMenu from "../client-components/client-top-menu";
import {toast} from "react-toastify";
import TimerClock from "../client-components/timer-clock";
import ClientWorkshopUploader from "../client-components/client-workshop-uploader";
import {getPracticeName, getWorkshopType, textLimit} from "../client-components/client-tools";

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



    async function reloadWorkshopFile() {
       let result =await getWorkshopUser(StdRegistID, SchdDetailID);
        setCurrentUserWorkshop(result);
    }

    async function confirmSubmit() {
        await reloadWorkshopFile();
        setShowConfirmSubmit(true);
    }

    function getQuestion() {
        let workshop=currentUserWorkshop['practice_answer'].find(v => v.PracticeID == filter);
        return workshop
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
                        workshop={getQuestion()}
                        StdRegistID={StdRegistID}
                        onUploadSuccess={(uploaded,e)=>{
                            reloadWorkshopFile();
                        }}
                        onLinkUpdated={result=>{
                            let question=getQuestion();
                            let title=getWorkshopType(question.PracticeID,true);
                            toast.success(`${title} O365 Link Updated.`)
                            reloadWorkshopFile();
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
                                    <span>Confirm to submit</span>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <div className='mb-2'><strong>Uploaded files:</strong></div>
                                {
                                    currentUserWorkshop.practice_answer.map(answer => {
                                    let practice = getPracticeName(answer.PracticeID);
                                    return <Alert key={'wk_'+answer.PracticeID} variant={practice.class}>
                                    <strong className='mr-2'>{practice.icon} {practice.name}</strong>
                                    <a href='#' className={'text-'+practice.class} onClick={e=>{e.preventDefault();download(answer.RowID)}}>{answer.FileName}</a>
                                    <div><span className="mr-2 font-weight-bold">o360 Link:</span><span>{answer.url?<a href={answer.url} target='_blank'>{textLimit(answer.url)}</a>:'- No Link -'}</span></div>
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
