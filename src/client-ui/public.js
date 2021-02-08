import {Alert, Col, Container, Image, Row} from "react-bootstrap";
import {StyleSheet, css} from "aphrodite";
import Config from "../config";
import {useEffect, useState} from "react";
import {getContent} from "../components/services";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import classNames from "classnames";

const {basePath} = Config;

const Public = () => {
    const [contentType, setContentType] = useState('announce');
    const [content, setContent] = useState(null);

    useEffect(()=>{
        new Promise(async resolve => {
            setContent(null);
            setTimeout(async ()=>{
                let content = await getContent(contentType);
                setContent(content)
                resolve();
            },300);
        })
    },[contentType]);

    async function changeContent(type,e) {
        e.preventDefault();
        setContentType(type);
    }

    function getWebContent(type){
        if(type && type!=contentType)return null;
        return <div className={classNames({
            'd-none d-md-block':!type,
            'd-block d-md-none':type,
        })} style={{minHeight:'300px'}}>
            <Row>
                <Col>
                    <div className="text-center">
                        <TransitionGroup>
                            {content && content.text &&
                            <CSSTransition timeout={300} classNames="myFade">
                                <Alert variant="info">
                                    <p dangerouslySetInnerHTML={{__html:content.text}}></p>
                                </Alert>
                            </CSSTransition>
                            }
                        </TransitionGroup>

                    </div>
                </Col>
            </Row>
        </div>
    }

    return <div className={css(styles.bg)}>
        <Container style={{height: '100%'}}>
            <div className={css(styles.header)}>
                <Image src={`${basePath}/images/HeaderENG.jpg`} fluid/>
            </div>
            <div className={css(styles.content)}>
                <div>
                    <Row>
                        <Col md={6} className="p-3 p-sm-2 text-center">
                            <a href='https://kku.world/exam'>
                                <Image src={`${basePath}/images/button1.png`} fluid/>
                            </a>
                        </Col>
                        <Col md={6} className="p-3 p-sm-2 text-center">
                            <a href='https://tawk.to/chat/5e7984ca69e9320caabc4f2d/default' target='_blank'>
                                <Image src={`${basePath}/images/button2.png`} fluid/>
                            </a>
                        </Col>
                    </Row>
                </div>
                <div className="mt-5" style={{position: 'relative'}}>
                    <Row>
                        <Col className="p-3 p-sm-2 text-center">
                            <Image className="d-none d-md-inline" src={`${basePath}/images/online-exam-01.jpg`} fluid/>
                            <a href={`${basePath}/start`} target='_blank'>
                                <Image src={`${basePath}/images/button3.png`} fluid className={css(styles.startExam)}/>
                            </a>
                        </Col>
                    </Row>
                </div>
                <div className="mt-5">
                    <Row>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'announce')}>
                                <Image src={`${basePath}/images/announcement.png`} fluid className={css(contentType=="announce" && styles.active)}/>
                            </a>
                            {getWebContent('announce')}
                        </Col>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'calendar')}>
                                <Image src={`${basePath}/images/calendar.png`} fluid className={css(contentType=="calendar" && styles.active)}/>
                            </a>
                            {getWebContent('calendar')}
                        </Col>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'manual')}>
                                <Image src={`${basePath}/images/manual.png`} fluid className={css(contentType=="manual" && styles.active)}/>
                            </a>
                            {getWebContent('manual')}
                        </Col>
                    </Row>
                </div>
                {getWebContent()}
            </div>
        </Container>
    </div>
}
const styles = StyleSheet.create({
    bg: {
        background: '#4c4c4e',
        minHeight: '100vh',
        height: 'auto',
    },
    header: {
        // background: `url("${basePath}/images/HeaderENG.jpg")`,
        // height: '400px',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
    },
    content: {
        background: '#fff',
        minHeight: 'calc(100% - 400px)',
        height: "auto",
        padding: '20px',
        paddingTop: '50px',
    },
    startExam: {
        position: 'absolute',
        top: '70%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    },
    active:{
        border:'10px solid #8cffa5',
        borderRadius:'10px',
        transition:'all 200ms'
    }
});
export default Public;