import {observer} from "mobx-react";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {Link, useParams} from 'react-router-dom';
import {Badge, Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {getEmailByScheduleDetail, getScheduleInfo} from "../components/services";
import Config from "../config";

const ViewGroup = () => {
    const state = useContext(StateContext);
    const {SchdID, SchdDetailID} = useParams();
    const [schedule,setSchedule] = useState(null);
    const [studentsWithGroup,setStudentsWithGroup] = useState(null);
    const [showingGroup,setShowingGroup] = useState(null);

    useEffect(()=>{
        state.scheduleMenu=[
            {to:`/schedule/${SchdID}/${SchdDetailID}`,title:'Group'}
        ];
        getEmailByScheduleDetail(SchdID,SchdDetailID).then(res=>{
            setStudentsWithGroup(res);
        });
        getScheduleInfo(SchdID,SchdDetailID).then(res=>{
            setSchedule(res);
        })
    },[]);

    function getEmail(group) {
        if(!studentsWithGroup[group])return;
        let text='';
        studentsWithGroup[group].map(std=>{
            text+=`${std.RegKKU.KKUMAIL},`;
        })
        return text.substr(0,text.length-1);
    }
    if(!schedule || !studentsWithGroup)return <div>Loading...</div>
    return <>
        <h3>รอบสอบ {schedule.SchdCode} ซึ่งมีทั้งหมด {studentsWithGroup && Object.keys(studentsWithGroup).length} กลุ่ม</h3>
        <div dangerouslySetInnerHTML={{__html:schedule.DateRegist_Desc_Th}}></div>
        <div>ภาค {schedule.ModuleType==1?<Badge variant="danger">ทฤษฎี</Badge>:<Badge variant="info">ปฏิบัติ</Badge>} ประจำวันที่ {schedule.ExamDate} / {schedule.ExamTimeStart}-{schedule.ExamTimeEnd}</div>
        <Row>
            {
                studentsWithGroup && Object.keys(studentsWithGroup).map(grp =>
                    <Col key={grp} md={6}>
                        <Card className="mt-2">
                            <Card.Body>
                                <Badge className="text-uppercase">{grp}</Badge> ({studentsWithGroup[grp].length} คน) <Link to={Config.adminPath(`/schedule/${SchdID}/${SchdDetailID}/${grp}`)} className="btn btn-primary ml-2">View</Link>
                                <Button variant="secondary" className="ml-2" onClick={setShowingGroup.bind(this,grp)}>Email</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            }
        </Row>
        <Modal show={!!showingGroup} onHide={e=>setShowingGroup(null)}>
            <Modal.Header closeButton>
                <span className="text-uppercase">{showingGroup}</span> : Email
            </Modal.Header>
            <Modal.Body>
                <Form.Control rows={20} as="textarea" onChange={e=>{}} onClick={e=>e.target.select()} value={getEmail(showingGroup)}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e=>setShowingGroup(null)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}
export default observer(ViewGroup);
