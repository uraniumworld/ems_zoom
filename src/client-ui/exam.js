import {useParams} from "react-router-dom";
import CheckInProcess from "../client-components/check-in-process";
import React, {useContext, useEffect, useState} from "react";
import Workshop from "./workshop";
import ExamScheduleDay from "../client-components/exam-schedule-day";
import {checkClient, checkLogin, getExamSchedules} from "../client-components/client-services";
import {observer} from "mobx-react";
import StateContext from "../mobx/global-context";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom';
import Theory from "./theory";
import QRCode from "qrcode";
import moment from "moment";
import ChatDisplay from "../client-components/chat-display";
import {Alert} from "react-bootstrap";

const Exam=()=>{
    const {type,StdRegistID, SchdDetailID} = useParams();
    const state = useContext(StateContext);
    const history = useHistory();
    const [examSchedule,setExamSchedule] = useState();
    const [examScheduleWithDateTime,setExamScheduleWithDateTime] = useState();

    useEffect(()=>{
      reload();
    },[]);

    useEffect(()=>{
        if(StdRegistID){
            QRGenerate();
        }
    },[StdRegistID]);

    function onApproved(){

    }
    function onDenied(){

    }

    async function reload(){
        let dataDateTime = await getExamSchedules();
        setExamScheduleWithDateTime(dataDateTime);
        let dataDateOnly = await getExamSchedules('date');
        setExamSchedule(dataDateOnly);
        await QRGenerate();
    }

    async function QRGenerate(){
        if(!StdRegistID)return;
        const examData = await checkClient(StdRegistID);
        if(examData){
            state.setCurrentMeetURL(examData.meet_url);
            QRCode.toDataURL(examData.meet_url)
                .then(b64image => {
                    state.setCurrentMeetQRCODE(b64image);
                })
                .catch(err => {
                    state.setCurrentMeetQRCODE(null);
                })
        }
    }

    if(!type){
        return <ExamScheduleDay
            reload={reload}
            student={state.currentStudent}
            schedulesDate={examSchedule}
            schedulesDateTime={examScheduleWithDateTime}
        />
    }

    return <CheckInProcess
        state={state}
        StdRegistID={StdRegistID}
        onApproved={onApproved}
        onDenied={onDenied}
    >
        {(scheduelInfo,serverTime,meetUrl,meetQRCode)=>{
            function getExam(){
                if(type=='workshop' && scheduelInfo.ModuleType=='2'){
                    return <Workshop student={state.currentStudent} meetUrl={meetUrl} meetQRCode={meetQRCode} scheduleInfo={scheduelInfo} serverTime={serverTime} onSubmitted={e=>reload()}/>
                }else if(type=='theory' && scheduelInfo.ModuleType=='1'){
                    return <Theory student={state.currentStudent} meetUrl={meetUrl} meetQRCode={meetQRCode} scheduleInfo={scheduelInfo} serverTime={serverTime} onSubmitted={e=>reload()}/>
                }else{
                    return <Alert variant='danger'>Page not found.</Alert>
                }
            }
            return <>
                {getExam()}
            </>
        }}

    </CheckInProcess>
}
export default observer(Exam);
