import {Alert, Button, Card, Col, Container, Image, Modal, Row} from "react-bootstrap";
import {StyleSheet, css} from "aphrodite";
import Config from "../config";
import {useEffect, useState} from "react";
import {getContent} from "../components/services";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import classNames from "classnames";
import MetaTags from 'react-meta-tags';
import {useHistory} from 'react-router-dom';
import LangSwitcher from "../client-components/lang-switcher";
import {getPlatform} from "../client-components/client-tools";

const {basePath} = Config;

const Public = () => {
    const [contentType, setContentType] = useState('announce');
    const [frontPage, setFrontPage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [lang,setLang] = useState("TH");
    const history = useHistory();

    useEffect(()=>{
        new Promise(async resolve => {
            setFrontPage(null);
            setTimeout(async ()=>{
                let content = await getContent(contentType);
                setFrontPage(content)
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
                    <div className="text-center mt-4">
                        <TransitionGroup>
                            {frontPage && frontPage.contents.map((c,i)=>
                                <CSSTransition key={'css_'+i} timeout={300} classNames="myFade">
                                    <Card className="mb-4">
                                        <Card.Header className="text-white" style={{background:'#3399cc'}}>
                                            <div className="text-left">
                                                <h3>{c.title}</h3>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="text-left" style={{fontSize:'1.2rem'}} dangerouslySetInnerHTML={{__html:c.html}}></div>
                                        </Card.Body>
                                    </Card>
                                </CSSTransition>
                            )}
                        </TransitionGroup>

                    </div>
                </Col>
            </Row>
        </div>
    }

    return <div className={css(styles.bg)}>
        <MetaTags>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </MetaTags>
        <Container style={{height: '100%'}}>
            <div className={css(styles.header)}>
                <Image src={`${basePath}/images/HeaderENG.jpg`} fluid/>
                <a href={`${Config.basePath}/prepare-device`} className={'btn btn-info btn-md-lg animGlow '+css(styles.btnPrepare)}>
                    <div className="d-none d-md-inline-block">ตรวจสอบอุปกรณ์ในการสอบ</div>
                    <div>Prepare your device</div>
                    <div className="d-none d-md-inline-block">[CLICK HERE]</div>
                </a>
            </div>
            <div className={css(styles.content)}>
                <div>
                    <Row>
                        <Col md={6} className="p-3 p-sm-2 text-center">
                            <a href='https://kku.world/exam'>
                                <Image className={css(styles.imgBtn)} src={`${basePath}/images/button1.png`} fluid/>
                            </a>
                        </Col>
                        <Col md={6} className="p-3 p-sm-2 text-center">
                            <a href='https://tawk.to/chat/5e7984ca69e9320caabc4f2d/default' target='_blank'>
                                <Image className={css(styles.imgBtn)} src={`${basePath}/images/button2.png`} fluid/>
                            </a>
                        </Col>
                    </Row>
                </div>
                <div className="mt-5" style={{position: 'relative'}}>
                    <Row>
                        <Col className="p-3 p-sm-2 text-center">
                            <Image className="d-none d-md-inline" src={`${basePath}/images/online-exam-01.jpg`} fluid/>
                            <a href="#" target='_blank' onClick={e=>{
                                e.preventDefault();
                                setShowModal(true);
                            }}>
                                <Image src={`${basePath}/images/button3.png`} fluid className={'animGlow '+css(styles.imgBtn,styles.startExam)}/>
                            </a>
                        </Col>
                    </Row>
                    {getPlatform()=='mac' &&
                    <Row className="mt-5 mt-md-0">
                        <Col>
                            <div className="text-center">
                                <a className="btn btn-info mt-4 animGlow" target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSfSqVGwNBudKp0KGd_dFdTLQH4FPZBXmcUt1zskyitT1f6aHw/viewform">
                                    macOS Share Office 365 Link (Click)
                                </a>
                            </div>
                        </Col>
                    </Row>
                    }
                </div>
                <div className="mt-5">
                    <Row>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'announce')}>
                                <Image src={`${basePath}/images/announcement.png`} fluid className={css(styles.imgBtn2,contentType=="announce" && styles.active)}/>
                            </a>
                            {getWebContent('announce')}
                        </Col>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'calendar')}>
                                <Image src={`${basePath}/images/calendar.png`} fluid className={css(styles.imgBtn2,contentType=="calendar" && styles.active)}/>
                            </a>
                            {getWebContent('calendar')}
                        </Col>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'manual')}>
                                <Image src={`${basePath}/images/manual.png`} fluid className={css(styles.imgBtn2,contentType=="manual" && styles.active)}/>
                            </a>
                            {getWebContent('manual')}
                        </Col>
                    </Row>
                </div>
                {getWebContent()}
            </div>
        </Container>
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {lang==='TH'?
                        <span>กรุณายืนยันการติดตั้งโปรแกรมบนอุปกรณ์ของคุณ</span>
                        :
                        <span>Please confirm software in your device.</span>
                    }
                    <LangSwitcher lang={lang} className='small ml-2' onLangSwitch={lang=>setLang(lang)}/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {lang==='TH'?
                <span>ผู้สอบได้ติดตั้งโปรแกรม Safe exam browser แล้วหรือยัง?</span>
                    :
                <span>Have you installed Safe exam browser into this device?</span>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e=>{
                    handleClose(true);
                    history.push(`/start`);
                }}>
                    {lang==='TH'?
                        <span>ไม่, ฉันยังไม่เคยติดตั้งโปรแกรมดังกล่าว ขอขั้นตอนการติดตั้ง</span>
                        :
                        <span>No, I never install Safe exam browser before.</span>
                    }
                </Button>
                <Button variant="success" onClick={e=>{
                    handleClose(true);
                    document.location.href=`sebs://ems.kku.ac.th/dev/startEMS.seb?rnd=${Math.random()}`;
                }}>
                    {lang==='TH'?
                        <span>ใช่ ฉันติดตั้งโปรแกรม Safe exam browser เรียบร้อยแล้ว</span>
                        :
                        <span>Yes, I had already installed Safe exam browser in my device.</span>
                    }
                </Button>
            </Modal.Footer>
        </Modal>
        <div className={css(styles.footer)}>
            <Container>
                <div className="text-center mt-4">© ems.kku.ac.th 2021. All rights reserved.</div>
            </Container>
        </div>
    </div>
}
const styles = StyleSheet.create({
    btnPrepare:{
        padding: '15px',
        position: 'absolute',
        left:'50%',
        bottom:'20%',
        transform: 'translate(-50%,50%)',
    },
    bg: {
        background: '#4c4c4e',
        minHeight: '100vh',
        height: 'auto',
    },
    imgBtn:{
        ':hover':{
            filter:'brightness(1.2)',
            transition:'all 200ms',
        }
    },
    imgBtn2:{
        ':hover':{
            filter:'brightness(.8)',
            transition:'all 200ms',
        }
    },
    footer:{
        height:'100px',
        color:'white',
    },
    header: {
        position:'relative',
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
