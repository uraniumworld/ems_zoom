import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    FormControl, Image,
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
    download, downloadStarterFileLink, generateMSOffice,
    getWorkshopQuestion,
    getWorkshopUser, submitAndExit,
    updateO365URL, updateStateMSOffice,
    uploadWorkshopFile
} from "../client-components/client-services";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faDatabase,
    faCheckCircle,
    faCheck, faTimesCircle, faTimes
} from '@fortawesome/free-solid-svg-icons'
import classNames from "classnames";
import {useParams,useHistory} from "react-router-dom";
import ClientTopMenu from "../client-components/client-top-menu";
import {toast} from "react-toastify";
import TimerClock from "../client-components/timer-clock";
import ClientWorkshopUploader from "../client-components/client-workshop-uploader";
import {getPracticeName, getStudentLang, getWorkshopType, textLimit} from "../client-components/client-tools";
import Config from "../config";
import {StyleSheet,css} from "aphrodite";
import {CSSTransition, TransitionGroup} from "react-transition-group";

//http://localhost:3000/exam/workshop/125180/3474


const Workshop = ({student,scheduleInfo, serverTime, onSubmitted}) => {
    const [questions, setQuestions] = useState();
    const [filter, setFilter] = useState('1');
    const [currentUserWorkshop, setCurrentUserWorkshop] = useState(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [office,setOffice] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState({
        submit: false,
    });
    const {StdRegistID, SchdDetailID} = useParams();
    const history = useHistory();


    useEffect(() => {
        window.document.title='EMS Workshop Examination';
        init();
    }, []);

    async function init(){
        let office = await generateMSOffice(StdRegistID);
        setOffice(office);
        getWorkshopQuestion(StdRegistID, SchdDetailID).then(data => {
            if(data.submitted){
                if(onSubmitted)onSubmitted();
                return;
            }else{
                setQuestions(data);
            }
        })
        await reloadWorkshopFile();
    }

    async function reloadWorkshopFile() {
        let result = await getWorkshopUser(StdRegistID, SchdDetailID);
        setCurrentUserWorkshop(result);
    }

    async function confirmSubmit() {
        await reloadWorkshopFile();
        setShowConfirmSubmit(true);
    }

    function getUserAnswer() {
        let workshop = currentUserWorkshop['practice_answer'].find(v => v.PracticeID == filter);
        return workshop
    }

    function setBtnState(name, state) {
        setButtonDisabled(prevState => ({
            ...prevState,
            [name]: state
        }))
    }

    async function _submitAndExit() {
        setBtnState('submit', true);
        let result = await submitAndExit(StdRegistID);
        if(result.success){
            if(onSubmitted)onSubmitted();
            toast.success('Your examination has been submitted.')
            setShowConfirmSubmit(false);
            history.push('/exam');
        }else{
            setBtnState('submit', false);
        }
    }

    function onTimeout(){
        toast.error('Time is up.')
        _submitAndExit();
    }

    function starterFile(){
        let file = office.find(o=>o.PracticeID==filter);
        if(file){
            let icon;
            let size='10x';
            if(file.downloaded=='1')size='3x';
            if(file.PracticeID=="1"){
                icon=<FontAwesomeIcon color="#007bff" size={size} icon={faFileWord}/>;
            }else if(file.PracticeID=="2"){
                icon=<FontAwesomeIcon color="#28a745" size={size} icon={faFileExcel}/>;
            }else{
                icon=<FontAwesomeIcon color="#ffc107" size={size} icon={faFilePowerpoint}/>;
            }
            let lang=getStudentLang(student);
            return <div>
                {file.downloaded=='1'?
                    <h2>{lang=='th'?
                        'ไฟล์กระดาษคำตอบ'
                        :
                        'Answer sheet file'
                    }</h2>
                    :
                    <h2>{lang=='th'?
                        'ขั้นตอนแรก ดาวน์โหลดไฟล์กระดาษคำตอบ ด้านล่างนี้'
                        :
                        'First, Download an answer sheet file'
                    }</h2>
                }
                <a download href={downloadStarterFileLink(file.id)}
                   className="text-black-50 mt-4" style={{display:'inline-block',width:'200px'}}
                   onClick={async e=>{
                       let result = await updateStateMSOffice(StdRegistID,file.id);
                       if(!result.error){
                           toast.success('Use downloaded file to start exam.',{autoClose:10000});
                           setOffice(prevState => {
                               let f= prevState.find(f=>f.id==file.id);
                               f.downloaded='1';
                               return [...prevState];
                           });
                       }else{
                           toast.error(result.error);
                       }
                   }}
                >
                    <div>{icon}</div>
                    {lang=='th'?
                        <div className="mt-2"><span className="btn btn-dark"> คลิกเพื่อดาวน์โหลด </span></div>
                        :
                        <div className="mt-2"><span className="btn btn-dark"> Click To Download </span></div>
                    }
                </a>
                <div className="mt-4">
                    {lang=='th'?
                        <Alert variant='warning'>ใช้ไฟล์กระดาษคำตอบนี้ในการทำข้อสอบตามโจทย์คำสั่ง และ ต้องส่งไฟล์โดยการอัปโหลดผ่านระบบ EMS เท่านั้น</Alert>
                        :
                        <Alert variant='warning'>Use this answer sheet file to complete the exam according to the instructions and the file must be uploaded via EMS only.</Alert>
                    }
                </div>
            </div>
        }else{
            return <div>ERROR</div>
        }
    }
    let currentOffice=office.find(o=>o.PracticeID==filter);
    return <>
        {(scheduleInfo && questions && currentUserWorkshop)
            ?
            <div className="container-wrapper" style={{paddingLeft: '120px'}}>
                <div className="exam-sidebar">
                    <TimerClock serverTime={serverTime}
                                expire={`${scheduleInfo.ExamDate} ${scheduleInfo.ExamTimeEnd}`}
                                onTimeout={onTimeout}
                    />
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
                    <ClientTopMenu type="workshop" scheduleInfo={scheduleInfo} student={student}
                                   confirmSubmit={confirmSubmit}/>
                    <div className="exam-content">
                        <Row className="mb-4">
                            <Col>
                                <div className="text-center">
                                    {starterFile()}
                                </div>
                            </Col>
                        </Row>
                        <TransitionGroup>
                            {currentOffice && currentOffice.downloaded == '1' &&
                            <CSSTransition timeout={300} classNames="myFade">
                                <div>
                                    <ClientWorkshopUploader
                                        PracticeID={filter}
                                        userAnswer={getUserAnswer()}
                                        StdRegistID={StdRegistID}
                                        onUploadSuccess={async (uploaded, e) => {
                                            await reloadWorkshopFile();
                                        }}
                                        onLinkUpdated={async result => {
                                            // let title = getWorkshopType(result.PracticeID, true);
                                            // toast.success(`${title} o365 Link Updated.`)
                                            //  await reloadWorkshopFile();
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
                                                                    <div
                                                                        style={{color: practice.color}}>{practice.icon} {practice.name} Questions
                                                                    </div>
                                                                </Card.Header>
                                                                <Card.Body style={{overflowX: 'auto'}}>
                                                                    <div
                                                                        dangerouslySetInnerHTML={{__html: question.question}}></div>
                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            })
                                        }
                                    </div>
                                </div>
                            </CSSTransition>
                            }
                        </TransitionGroup>
                    </div>
                </Container>
                <Modal className='exam-confirm-modal' size='lg' show={showConfirmSubmit}
                       onHide={e => setShowConfirmSubmit(false)}>
                    <Modal.Header closeButton>
                        <span>Confirm to submit</span>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-2'>
                            <strong>Uploaded {currentUserWorkshop.practice_answer.length} files:</strong></div>
                        <div className="mb-4">Please check your files before submit.</div>
                        <Card>
                            <Card.Body className="bg-light">
                                {
                                    currentUserWorkshop.practice_answer.map(answer => {
                                        let practice = getPracticeName(answer.PracticeID);
                                        return (
                                            <div key={'practice_'+answer.PracticeID}>
                                                {/*{answer.url ?*/}
                                                {/*    <div className="text-success"><FontAwesomeIcon icon={faCheckCircle}*/}
                                                {/*                                                   className="mr-2"/> File*/}
                                                {/*        ok</div>*/}
                                                {/*    :*/}
                                                {/*    <div className="text-danger"><FontAwesomeIcon icon={faTimes}*/}
                                                {/*                                                  className="mr-2"/> No*/}
                                                {/*        Office 365 link -> No score</div>*/}
                                                {/*}*/}
                                                <Alert key={'wk_' + answer.PracticeID} variant={practice.class}>
                                                    <strong className='mr-2'>{practice.icon} {practice.name}</strong>
                                                    <a href='#' className={'text-' + practice.class} onClick={e => {
                                                        e.preventDefault();
                                                        download(answer.RowID)
                                                    }}>{answer.FileName}</a>
                                                    {/*<div><span*/}
                                                    {/*    className="mr-2 font-weight-bold">o360 Link:</span><span>{answer.url ?*/}
                                                    {/*    <a href={answer.url}*/}
                                                    {/*       target='_blank'>{textLimit(answer.url)}</a> : '- No Link -'}</span>*/}
                                                    {/*</div>*/}
                                                </Alert>
                                            </div>
                                        )
                                    })
                                }
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={buttonDisabled['submit']} variant="primary" onClick={e => _submitAndExit()}>
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
const styles=StyleSheet.create({
    o365:{
        textAlign:'center',
        ':nth-child(1n) img':{
        }
    }
});
export default Workshop;
