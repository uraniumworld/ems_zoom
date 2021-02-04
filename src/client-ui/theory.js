import TimerClock from "../client-components/timer-clock";
import React, {useEffect, useState} from "react";
import {
    getTheoryQuestions,
    getTheoryUser,
    getWorkshopUser,
    submitAndExit,
    theoryAnswer
} from "../client-components/client-services";
import ClientTopMenu from "../client-components/client-top-menu";
import {Alert, Badge, Button, Col, Container, Modal, Row, Table} from "react-bootstrap";
import TheoryQuestion from "../client-components/theory-question";
import {css, StyleSheet} from "aphrodite";
import classNames from "classnames";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom';
import striptags from "striptags";

const Theory = ({student,scheduleInfo, serverTime, onSubmitted}) => {
    const [currentUserTheory, setCurrentUserTheory] = useState({});
    const [questions, setQuestions] = useState([]);
    const [doneQuestion, setDoneQuestion] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [disabled,setDisabled] = useState({});
    const [showConfirmSubmit,setShowConfirmSubmit] = useState(false);
    const history = useHistory();

    useEffect(() => {
        init();
    }, []);

    // useEffect(()=>{
    //     loadAnsweredQuestions();
    // },[doneQuestion]);

    async function init() {
        await loadAnsweredQuestions();
        let questions = await getTheoryQuestions(scheduleInfo.StdRegistID);
        setQuestions(questions);
    }

    async function loadAnsweredQuestions(){
        let theoryUser = await getTheoryUser(scheduleInfo.StdRegistID,scheduleInfo.SchdDetailID);
        if(!theoryUser.error){
            theoryUser.map(ans=>{
                setDoneQuestion(prevState => {
                    return {
                        ...prevState,
                        [ans.TheoryID]:{
                            RowID:ans.RowID,
                            TheoryChoiceID:ans.IsAnswer,
                        }
                    }
                })
            });
        }else{
            if(onSubmitted)onSubmitted();
        }
    }

    async function _submitAndExit() {
        let result = await submitAndExit(scheduleInfo.StdRegistID);
        if(result.success){
            if(onSubmitted)onSubmitted();
            toast.success('Your examination has been submitted.')
            setShowConfirmSubmit(false);
        }
    }

    function onTimeout() {

    }

    async function reloadTheoryTaken() {
        // let result = await getWorkshopUser(StdRegistID, SchdDetailID);
        // setCurrentUserWorkshop(result);
    }

    function confirmSubmit() {
        setShowConfirmSubmit(true);
    }

    function _setDoneQuestion(TheoryID, RowID, TheoryChoiceID) {
        setDoneQuestion(prevState => {
            return {
                ...prevState,
                [TheoryID]: {
                    RowID,
                    TheoryChoiceID
                }
            }
        })
    }

    function _setDisabled(key,value){
        setDisabled(prevState => ({
            ...prevState,
            [key]:value
        }))
    }

    function getChoiceText(question,TheoryChoiceID){
        return question.choices.find(v=>v.TheoryChoiceID==TheoryChoiceID);
    }

    return <div>
        <div className={'container-wrapper ' + css(styles.containerWrapper)}>
            <div className={css(styles.theorySidebar)}>
                <TimerClock serverTime={serverTime}
                            expire={`${scheduleInfo.ExamDate} ${scheduleInfo.ExamTimeEnd}`}
                            onTimeout={onTimeout}
                />
                <div className="text-center mt-4 mb-2">Questions Progress</div>
                <Row>
                    {questions.map((q, i) => <Col key={'state_' + q.TheoryID} className="col-2 col-md-3">
                        <div
                            style={{cursor: 'pointer'}}
                            className={css(
                                styles.stateBlock,
                                doneQuestion[q.TheoryID] ? styles.stateBlockY : styles.stateBlockN,
                                i == currentQuestionIndex ? styles.blockSelected : null
                            )}
                            onClick={e => {
                                setCurrentQuestionIndex(i)
                            }}
                        >
                            {i + 1}
                        </div>
                    </Col>)}
                </Row>
            </div>
            <Container className={css(styles.theoryContainer)}>
                <ClientTopMenu type="theory" scheduleInfo={scheduleInfo} student={student}
                               confirmSubmit={confirmSubmit}/>
                <div className="exam-content">
                    {questions[currentQuestionIndex] &&
                        <TheoryQuestion
                            index={currentQuestionIndex}
                            question={questions[currentQuestionIndex]}
                            doneQuestion={doneQuestion}
                            totalQuestion={questions.length}
                            disabled={!!disabled[currentQuestionIndex]}
                            onPrev={() => {
                                setCurrentQuestionIndex(prevState => prevState - 1)
                            }}
                            onNext={() => {
                                setCurrentQuestionIndex(prevState => prevState + 1)
                            }}
                            onSelected={async q => {
                                _setDisabled(currentQuestionIndex,true);
                                let result = await theoryAnswer(scheduleInfo.StdRegistID,(doneQuestion[q.TheoryID] && doneQuestion[q.TheoryID].RowID)||0,q.TheoryID,q.TheoryChoiceID);
                                if(!result.error && result.RowID){
                                    _setDoneQuestion(q.TheoryID, result.RowID, q.TheoryChoiceID);
                                }
                                _setDisabled(currentQuestionIndex,false);
                            }}
                            onCancel={async q => {
                                _setDisabled(currentQuestionIndex,true);
                                let result = await theoryAnswer(scheduleInfo.StdRegistID,(doneQuestion[q.TheoryID] && doneQuestion[q.TheoryID].RowID)||0,q.TheoryID,0);
                                if(!result.error && result.RowID===0){
                                    setDoneQuestion(prevState => {
                                        return {...prevState,[q.TheoryID]:null}
                                    });
                                }
                                _setDisabled(currentQuestionIndex,false);
                            }}
                        />
                    }
                </div>
            </Container>
        </div>
        <Modal className='exam-confirm-modal' size='lg' show={showConfirmSubmit}
               onHide={e => setShowConfirmSubmit(false)}>
            <Modal.Header closeButton>
                <span>Confirm to submit</span>
            </Modal.Header>
            <Modal.Body>
                <h3>Please review your answered.</h3>
                <Row>
                    <Col>
                        <Table>
                            <thead>
                            <tr>
                                <th>Question</th>
                                <th>Your answered</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questions.map((q,i)=>{
                                let choiceText=<Badge variant="danger">- No answer -</Badge>;
                                if(doneQuestion[q.TheoryID]){
                                    let TheoryChoiceID=doneQuestion[q.TheoryID].TheoryChoiceID;
                                    let choice=q.choices.find(v=>v.TheoryChoiceID==TheoryChoiceID)
                                    if(choice){
                                        choiceText=<Badge style={{fontSize:'90%'}} variant="success">({TheoryChoiceID}) {choice.text}</Badge>;
                                    }
                                }
                                return <tr>
                                    <td width="80%">Q{i+1}. {striptags(q.question)}</td>
                                    <td>{choiceText}</td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <div>
                    <Button onClick={e=>_submitAndExit()}>Confirm, Submit And Exit</Button>
                </div>
            </Modal.Footer>
        </Modal>
    </div>
}
const styles = StyleSheet.create({
    theorySidebar: {
        background: '#1d2124',
        color: 'white',
        paddingLeft: '10px',
        paddingRight: '10px',
        '@media(min-width:800px)': {
            width: '300px',
            position: 'fixed',
            left: '0px',
            top: '0px',
            height: '100%',
        }
    },
    containerWrapper: {
        '@media(min-width:800px)': {
            paddingLeft: '300px',
        }
    },
    theoryContainer: {
        // marginTop: '60px',
    },
    stateBlock: {
        textAlign: 'center',
        borderRadius: '5px',
        marginBottom: '8px',
    },
    stateBlockN: {
        backgroundColor: 'grey',
    },
    stateBlockY: {
        backgroundColor: 'green',
    },
    blockSelected: {
        borderInline: '5px solid #ffc107'
    }
})
export default Theory;
