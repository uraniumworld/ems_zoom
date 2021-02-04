import TimerClock from "../client-components/timer-clock";
import React, {useEffect, useState} from "react";
import {getTheoryQuestions, getTheoryUser, getWorkshopUser, theoryAnswer} from "../client-components/client-services";
import ClientTopMenu from "../client-components/client-top-menu";
import {Badge, Col, Container, Row} from "react-bootstrap";
import TheoryQuestion from "../client-components/theory-question";
import {css, StyleSheet} from "aphrodite";
import classNames from "classnames";

const Theory = ({student,scheduleInfo, serverTime}) => {
    const [currentUserTheory, setCurrentUserTheory] = useState({});
    const [questions, setQuestions] = useState([]);
    const [doneQuestion, setDoneQuestion] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [disabled,setDisabled] = useState({});

    useEffect(() => {
        init();
    }, []);

    async function init() {
        let questions = await getTheoryQuestions(scheduleInfo.StdRegistID);
        setQuestions(questions);
        let theoryUser = await getTheoryUser(scheduleInfo.StdRegistID,scheduleInfo.SchdDetailID);
        console.log(theoryUser);
    }

    function onTimeout() {

    }

    async function reloadTheoryTaken() {
        // let result = await getWorkshopUser(StdRegistID, SchdDetailID);
        // setCurrentUserWorkshop(result);
    }

    function confirmSubmit() {

    }

    function _setDoneQuestion(TheoryID, TheoryChoiceID) {
        setDoneQuestion(prevState => {
            return {
                ...prevState,
                [TheoryID]: TheoryChoiceID
            }
        })
    }

    function _setDisabled(key,value){
        setDisabled(prevState => ({
            ...prevState,
            [key]:value
        }))
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
                                await theoryAnswer(scheduleInfo.StdRegistID,0,q.TheoryID,q.TheoryChoiceID);
                                _setDoneQuestion(q.TheoryID, q.TheoryChoiceID);
                                _setDisabled(currentQuestionIndex,false);
                            }}
                            onCancel={q => {
                                _setDoneQuestion(q.TheoryID, false);
                            }}
                        />
                    }
                </div>
            </Container>
        </div>
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
