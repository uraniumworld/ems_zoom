import {Alert, Badge, Button, Card, Col, Container, Image, Modal, Row} from "react-bootstrap";
import {StyleSheet, css} from "aphrodite";
import Config from "../config";
import {useEffect, useState} from "react";
import {getContent, getSEB} from "../components/services";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import classNames from "classnames";
import MetaTags from 'react-meta-tags';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import LangSwitcher from "../client-components/lang-switcher";
import {getPlatform} from "../client-components/client-tools";

const {basePath} = Config;

const Public = () => {
    const [contentType, setContentType] = useState('announce');
    const [frontPage, setFrontPage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [lang, setLang] = useState("TH");
    const [useSEB, setUseSEB] = useState();
    const history = useHistory();
    const [showMacModal, setShowMacModal] = useState(false);
    let query = new URLSearchParams(useLocation().search);

    useEffect(() => {
        new Promise(async resolve => {
            setFrontPage(null);
            setTimeout(async () => {
                let content = await getContent(contentType);
                setFrontPage(content)
                resolve();
            }, 300);
        })
        let start=query.get('start');
        if(start=='1'){
            if(useSEB){
                handleShow();
            }else{
                document.location.href=`${basePath}/exam`
            }
        }
        getSEB().then(v=>{
            setUseSEB(v.requiredSafeExamBrowser);
        });
    }, [contentType]);


    async function changeContent(type, e) {
        e.preventDefault();
        setContentType(type);
    }

    function getWebContent(type) {
        if (type && type != contentType) return null;
        return <div className={classNames({
            'd-none d-md-block': !type,
            'd-block d-md-none': type,
        })} style={{minHeight: '300px'}}>
            <Row>
                <Col>
                    <div className="text-center mt-4">
                        <TransitionGroup>
                            {frontPage && frontPage.contents.map((c, i) =>
                                <CSSTransition key={'css_' + i} timeout={300} classNames="myFade">
                                    <Card className="mb-4">
                                        <Card.Header className="text-white" style={{background: '#3399cc'}}>
                                            <div className="text-left">
                                                <h3>{c.title}</h3>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="text-left" style={{fontSize: '1.2rem'}}
                                                 dangerouslySetInnerHTML={{__html: c.html}}></div>
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
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </MetaTags>
        <Container style={{height: '100%'}}>
            <div className={css(styles.header)}>
                <Image src={`${basePath}/images/HeaderENG.jpg`} fluid/>
                {/*<a href={`${Config.basePath}/prepare-device`}*/}
                {/*   className={'btn btn-info btn-md-lg animGlow ' + css(styles.btnPrepare)}>*/}
                {/*    <div className="d-none d-md-inline-block">ตรวจสอบอุปกรณ์ในการสอบ</div>*/}
                {/*    <div>Prepare your device</div>*/}
                {/*    <div className="d-none d-md-inline-block">[CLICK HERE]</div>*/}
                {/*</a>*/}
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
                <Row>
                    <Col>
                        <h3 className="text-center">Online Exam Supported OS</h3>
                        <div className="text-center">
                            <Badge variant="danger">Theory</Badge> - OS: <Image
                            src={`${Config.basePath}/images/windows.png`} width="30"/>
                            Support Windows 7 / 8.1 / 10 / 11 | Android | <Image src={`${Config.basePath}/images/mac.png`}
                                                                  width="25"/> | <Image
                            src={`${Config.basePath}/images/ios.png`} width="50"/>
                        </div>
                        <div className="text-center">
                            <Badge variant="primary">Workshop</Badge> - <Image width="60px"
                                                                               src={`${Config.basePath}/images/office.png`}/> MS
                            Office 2010+ or 365 | OS: <Image src={`${Config.basePath}/images/windows.png`} width="30"/>Support
                            Windows 7 / 8.1 / 10 / 11 | <Image src={`${Config.basePath}/images/mac.png`} width="25"/> Mac
                        </div>
                        <hr/>
                        <>
                            <div className="mt-2" style={{color:'#2463a7'}}>
                                <h3 className="text-center">ประกาศ (05/2022)</h3>
                                <div className="text-center">
                                    ขณะนี้ทางระบบได้ปิดการใช้งาน Program <strong>Safe exam browser</strong> เป็นการชั่วคราว ดังนั้นนักศึกษาไม่ต้องติดตั้ง Safe exam browser ก่อนการสอบ
                                    นักศึกษาสามารถใช้ <strong>Google chrome</strong>, Firefox, MS Edge, Safari ในการสอบได้เลย
                                </div>
                                <hr/>
                                <div className="mt-3" style={{display:'flex',justifyContent:'center'}}>
                                    <div>
                                        <div className="text-center font-weight-bold">เตรียมพร้อมอุปกรณ์ก่อนสอบ</div>
                                        <ul>
                                            <li>ตรวจสอบเวลาเครื่องว่าตรงกับเวลาบัจจุบันหรือไม่</li>
                                            <li>เตรียมอุปกรณ์สำหรับชาร์จ Smart phone ที่ใช้เข้า Google meet ให้พร้อม</li>
                                            <li>ในกรณีผู้สอบหลุดออกจาก Google meet ในขณะสอบ..ระบบจะยุติการสอบชั่วคราวโดยอัตโนมัติ
                                                ดังนั้นให้ตรวจสอบสัญญาณอินเตอร์เน็ตก่อนสอบด้วยครับ</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/*<div>*/}
                            {/*    <a href="#" onClick={e => {*/}
                            {/*        e.preventDefault();*/}
                            {/*        setShowMacModal(true);*/}
                            {/*    }}>*/}
                            {/*        <Image className="mt-4" src={Config.basePath + '/images/please-read.png'} fluid/>*/}
                            {/*    </a>*/}
                            {/*</div>*/}
                            <Modal centered show={showMacModal} onHide={e => setShowMacModal(false)}>
                                <Modal.Header>
                                    <Modal.Title>
                                        <Row>
                                            <Col>
                                                {lang === 'TH' ?
                                                    <span>การสอบภาคฏิบัติ</span>
                                                    :
                                                    <span>Workshop Exam</span>
                                                }
                                            </Col>
                                            <Col xs='auto'>
                                                <LangSwitcher lang={lang} className='small ml-2'
                                                              onLangSwitch={lang => setLang(lang)}/>
                                            </Col>
                                        </Row>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {lang === 'TH' ?
                                        <div>
                                            <div>เนื่องจากการสอบภาคปฏบัติรองรับคอมพิวเตอร์ที่ใช้<span style={{color:'red'}}>ระบบปฏิบัติการ Windows</span> เท่านั้น</div>
                                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ดังนั้นหากนักศึกษาไม่มีอุปกรณ์ในการสอบออนไลน์ สามารถยื่นคำร้องเพื่อขอเข้ามาสอบ ณ ชั้น 6 อาคารสารสนเทศได้ โดยส่งคำร้องมาทางอีเมลล์ <span style={{color:'green'}}>chatkam@kku.ac.th</span></div>
                                            {/*<a target='_blank' href="https://kku.world/6p7ss">แบบฟอร์มยื่นคำร้องขอใช้เครื่องในการสอบ</a>*/}
                                        </div>
                                        :
                                        <div>
                                            <div>Because the practice exam is only supported by <span style={{color:'red'}}>OS Windows</span> computers.</div>
                                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Therefore, if student do not have any device to exam, you can submit a request to use the computer of the Learning and Teaching Innovation Center at floor 6 ICT building for the exam. By email <span style={{color:'green'}}>chatkam@kku.ac.th</span></div>
                                            {/*<a target='_blank' href="https://kku.world/6p7ss">Request Form</a>*/}
                                        </div>
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    {lang === 'TH' ?
                                        <Button onClick={e=>setShowMacModal(false)}>ปิด</Button>
                                        :
                                        <Button onClick={e=>setShowMacModal(false)}>Close</Button>
                                    }
                                </Modal.Footer>
                            </Modal>
                        </>
                    </Col>
                </Row>
                <div className="mt-5" style={{position: 'relative'}}>
                    <Row>
                        <Col className="p-3 p-sm-2 text-center">
                            <Image className="d-none d-md-inline" src={`${basePath}/images/online-exam-01.jpg`} fluid/>
                            <a href="#" target='_blank' onClick={e => {
                                e.preventDefault();
                                if(useSEB){
                                    setShowModal(true);
                                }else{
                                    document.location.href=`${basePath}/exam`
                                }
                            }}>
                                <Image src={`${basePath}/images/button3.png`} fluid
                                       className={'animGlow ' + css(styles.imgBtn, styles.startExam)}/>
                            </a>
                        </Col>
                    </Row>
                    {/*{getPlatform()=='mac' &&*/}
                    {/*<Row className="mt-5 mt-md-0">*/}
                    {/*    <Col>*/}
                    {/*        <div className="text-center">*/}
                    {/*            <a className="btn btn-info mt-4 animGlow" target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSfSqVGwNBudKp0KGd_dFdTLQH4FPZBXmcUt1zskyitT1f6aHw/viewform">*/}
                    {/*                macOS Share Office 365 Link (Click)*/}
                    {/*            </a>*/}
                    {/*        </div>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                    {/*}*/}
                </div>
                <div className="mt-5">
                    <Row>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'announce')}>
                                <Image src={`${basePath}/images/announcement.png`} fluid
                                       className={css(styles.imgBtn2, contentType == "announce" && styles.active)}/>
                            </a>
                            {getWebContent('announce')}
                        </Col>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'calendar')}>
                                <Image src={`${basePath}/images/calendar.png`} fluid
                                       className={css(styles.imgBtn2, contentType == "calendar" && styles.active)}/>
                            </a>
                            {getWebContent('calendar')}
                        </Col>
                        <Col md={4} className="p-3 p-sm-2 text-center">
                            <a href="#" onClick={changeContent.bind(this, 'manual')}>
                                <Image src={`${basePath}/images/manual.png`} fluid
                                       className={css(styles.imgBtn2, contentType == "manual" && styles.active)}/>
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
                    {lang === 'TH' ?
                        <span>กรุณายืนยันการติดตั้งโปรแกรมบนอุปกรณ์ของคุณ</span>
                        :
                        <span>Please confirm software in your device.</span>
                    }
                    <LangSwitcher lang={lang} className='small ml-2'
                                  onLangSwitch={lang => setLang(lang)}/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {lang === 'TH' ?
                    <span>ผู้สอบได้ติดตั้งโปรแกรม Safe exam browser แล้วหรือยัง?</span>
                    :
                    <span>Have you installed Safe exam browser into this device?</span>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => {
                    handleClose(true);
                    history.push(`/start`);
                }}>
                    {lang === 'TH' ?
                        <span>ไม่, ฉันยังไม่เคยติดตั้งโปรแกรมดังกล่าว ขอขั้นตอนการติดตั้ง</span>
                        :
                        <span>No, I never install Safe exam browser before.</span>
                    }
                </Button>
                <Button variant="success" onClick={e => {
                    handleClose(true);
                    document.location.href = `sebs://ems.kku.ac.th/${Config.basePath}/startEMS.seb?rnd=${Math.random()}`;
                }}>
                    {lang === 'TH' ?
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
    btnPrepare: {
        padding: '15px',
        position: 'absolute',
        left: '50%',
        bottom: '20%',
        transform: 'translate(-50%,50%)',
    },
    bg: {
        background: '#4c4c4e',
        minHeight: '100vh',
        height: 'auto',
    },
    imgBtn: {
        ':hover': {
            filter: 'brightness(1.2)',
            transition: 'all 200ms',
        }
    },
    imgBtn2: {
        ':hover': {
            filter: 'brightness(.8)',
            transition: 'all 200ms',
        }
    },
    footer: {
        height: '100px',
        color: 'white',
    },
    header: {
        position: 'relative',
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
    active: {
        border: '10px solid #8cffa5',
        borderRadius: '10px',
        transition: 'all 200ms'
    }
});
export default Public;
