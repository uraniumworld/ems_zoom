import {useContext, useEffect, useRef, useState} from "react";
import {checkClient, getMyPicture, getScheduleInfo, studentLogout} from "./client-services";
import {Alert, Badge, Button, Card, Col, Container, Image, Row, Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import QRCode from 'qrcode';
import StateContext from "../mobx/global-context";
import {observer} from "mobx-react";

const CheckInProcess = ({state, StdRegistID, onApproved, onDenied, children}) => {

    const [approve, setApprove] = useState(void 0);
    const [meetUrl, setMeetUrl] = useState(null);
    const [meetQRCode, setMeetQRCode] = useState(null);
    const [myPicture, setMyPicture] = useState(void 0);
    const [scheduleInfo, setScheduleInfo] = useState(void 0);
    const [serverTime, setServerTime] = useState(0);
    const timer = useRef(null);
    const last_update = useRef(null);
    const last_update_url = useRef(null);
    const history = useHistory();

    useEffect(() => {
        new Promise(async resolve => {
            let schdInfo = await getScheduleInfo(StdRegistID);
            setScheduleInfo(schdInfo);
            console.log(schdInfo);
            await checker();
            timer.current = setInterval(() => checker(), 10000);
        })
        return () => {
            console.log('CLEAR');
            clearInterval(timer.current);
        }
    }, []);

    useEffect(() => {
        if (state.currentStudent) {
            getMyPicture().then(picture=>{
                if(picture){
                    setMyPicture(picture.student_image_data)
                }else{
                    setMyPicture(null);
                }
            })
        }
    }, [state.currentStudent])


    function getQRCodeToState(url) {
        if (!url) {
            setMeetQRCode(null);
            return;
        }
        QRCode.toDataURL(url)
            .then(b64image => {
                setMeetQRCode(b64image);
            })
            .catch(err => {
                setMeetQRCode(null);
            })
    }

    function checker() {
        checkClient(StdRegistID).then(data => {
            // console.log(data);
            if(!data){
                data={};
                data.serverTime=0;
                data.last_update=0;
            }
            setServerTime(data.serverTime);
            if (last_update.current != data.last_update || last_update_url.current != data.last_update_url) {
                if (data.check_in_status == "1") {
                    setApprove(true);
                    onApproved();
                } else {
                    if (data.meet_url) {
                        let url = data.meet_url.match(/^http/) ? data.meet_url : `https://${data.meet_url}`;
                        setMeetUrl(url);
                        getQRCodeToState(url);
                    } else {
                        setMeetUrl(null);
                        getQRCodeToState(null);
                    }
                    setApprove(false);
                    onDenied();
                }
                last_update.current = data.last_update;
                last_update_url.current = data.last_update_url;
            }
        });
    }

    async function logout() {
        await studentLogout();
        state.setStudent(null);
        history.push('/login');
    }

    if (typeof approve == 'undefined' || !scheduleInfo) return <Alert variant='info'>Loading...</Alert>;
    if (!approve) {
        return <Container>
            <Row>
                <Col>
                    <Card className="mt-4 bg-dark text-white">
                        <Card.Header>EMS Check-In: #{scheduleInfo.SchdCode} / {scheduleInfo.ExamDate} {scheduleInfo.ExamTimeStart} - {scheduleInfo.ExamTimeEnd}</Card.Header>
                        <Card.Body>
                            <div className="text-center">
                                <Row>
                                    <Col className="col-12 col-md-auto">
                                        {typeof myPicture == 'undefined'?
                                         <Alert variant="info">Loading...</Alert>
                                            :
                                            <>
                                                {myPicture ?
                                                    <div className="text-center"><Image width="150px" src={myPicture} fluid rounded></Image>
                                                    </div>
                                                    :
                                                    <div className="text-center"><Image width="150px" src='/images/user_avatar.svg'
                                                                                        fluid></Image></div>
                                                }
                                            </>
                                        }
                                    </Col>
                                    <Col className="col-12 col-md-6">
                                        <div style={{width:'400px'}}>
                                            <Table className="text-white">
                                                <tbody>
                                                <tr>
                                                    <td colSpan={2}>Student detail</td>
                                                </tr>
                                                <tr>
                                                    <th>Student ID:</th>
                                                    <td>{state.currentStudent.studentID}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fullname:</th>
                                                    <td>{state.currentStudent.fname} {state.currentStudent.lname}</td>
                                                </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                    <Col>
                                        {
                                            !meetQRCode
                                                ?
                                                <>
                                        <Alert variant='warning'>Please <span
                                            className="badge badge-info">Check-in</span> before start</Alert>
                                                    <a className="btn btn-primary btn-sm ml-2 disabled">Waiting meet...</a>
                                                </>
                                                :
                                                <div className="text-center">
                                        <Alert variant="warning" className="mb-2">Please <span
                                            className="badge badge-info">Check-in</span> before start exam.</Alert>
                                                    <div>
                                                        <Alert variant='info' className="mb-2">Use your mobile devices scan this
                                                            QR-CODE to start Google Meet</Alert>
                                                        <div className="mb-2"><Image src={meetQRCode} rounded></Image></div>
                                                        <div><Badge variant='success' className='mr-2'>Google Meet - Key:</Badge>
                                                            <span style={{fontSize:'20px'}}>
                                                                {(()=>{
                                                                    let u = meetUrl.split('/');
                                                                    return u[u.length-1];
                                                                })()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-right"><Button onClick={e => logout()} variant='danger'>Logout</Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    }
    return children(scheduleInfo,serverTime);
}
export default observer(CheckInProcess);
