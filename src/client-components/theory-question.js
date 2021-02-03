import {Alert, Button, Card, Col, FormControl, FormGroup, ListGroup, Row} from "react-bootstrap";
import Config from "../config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {StyleSheet, css} from "aphrodite";

const TheoryQuestion = ({index, question, totalQuestion, doneQuestion, onSelected, onCancel, onNext, onPrev}) => {

    function getImage() {
        let img = question.question.replace(/\.\.\/\.\./ig, Config.baseUrl);
        return `<span>${index + 1}.</span> ${img}`;
    }

    if (!question) return <Alert>Loading...</Alert>;
    return <Row>
        <Col>
            <Card className="mb-4 bg-dark text-white">
                <Card.Header><span className={css(styles.questionText)}
                                   dangerouslySetInnerHTML={{__html: getImage(question.question)}}></span></Card.Header>
                <Card.Body>
                    <ListGroup>
                        {question.choices.map(c =>
                            <ListGroup.Item key={'c_' + c.TheoryChoiceID}>
                                <div className={css(styles.HighlightChoice)}>
                                    <Row>
                                        <Col className="col-auto">
                                            <div className="text-center mt-2 ml-2">
                                                <input type="radio"
                                                       className={css(styles.choiceRadio)}
                                                       id={`${question.TheoryID}_${c.TheoryChoiceID}`}
                                                       name={question.TheoryID}
                                                       checked={doneQuestion[question.TheoryID] == c.TheoryChoiceID}
                                                       onChange={e => {
                                                           onSelected({
                                                               TheoryID: question.TheoryID,
                                                               TheoryChoiceID: c.TheoryChoiceID,
                                                           })
                                                       }}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <a className={css(styles.aChoice)} onClick={e=>{
                                                e.preventDefault()
                                                onSelected({
                                                    TheoryID: question.TheoryID,
                                                    TheoryChoiceID: c.TheoryChoiceID,
                                                })
                                            }}>
                                                <label
                                                    style={{cursor: 'pointer'}}
                                                    htmlFor={`${question.TheoryID}_${c.TheoryChoiceID}`}
                                                    className={css(styles.choiceText)}
                                                    dangerouslySetInnerHTML={{__html: c.text}}
                                                ></label>
                                            </a>
                                        </Col>
                                    </Row>
                                </div>
                            </ListGroup.Item>)}
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col>
                            {doneQuestion[question.TheoryID] &&
                            <div className="text-left">
                                <Button variant="danger" onClick={e => onCancel(question)}>Cancel</Button>
                            </div>
                            }
                        </Col>
                        <Col>
                            <div className="text-right">
                                {index + 1 > 1 &&
                                <Button variant="light" onClick={e => onPrev()} className="mr-2"><FontAwesomeIcon
                                    icon={faArrowLeft}/> Previous question</Button>
                                }
                                {index + 1 < totalQuestion &&
                                <Button variant="primary" onClick={e => onNext()}>Next question <FontAwesomeIcon
                                    icon={faArrowRight}/></Button>
                                }
                            </div>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>
    </Row>
}
const styles = StyleSheet.create({
    questionText: {
        fontSize: '1.8rem'
    },
    choiceRadio: {
        cursor: 'pointer',
        transform: 'scale(1.8)'
    },
    choiceText: {
        color: '#000000',
        fontSize: '1.5rem'
    },
    HighlightChoice: {
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '10px',
        transition: '.3s all',
        ':hover': {
            backgroundColor: '#a9f0f8',
        }
    },
    aChoice:{
        display: 'block',
    }
});
export default TheoryQuestion;