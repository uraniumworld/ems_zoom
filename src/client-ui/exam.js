import {useParams} from "react-router-dom";
import CheckInProcess from "../client-components/check-in-process";
import React, {useContext, useEffect, useState} from "react";
import Workshop from "./workshop";
import ExamScheduleDay from "../client-components/exam-schedule-day";
import {checkLogin, getExamSchedules} from "../client-components/client-services";
import {observer} from "mobx-react";
import StateContext from "../mobx/global-context";
import {toast} from "react-toastify";
import {useHistory} from 'react-router-dom';
import Theory from "./theory";

const Exam=()=>{
    const {type,StdRegistID, SchdDetailID} = useParams();
    const state = useContext(StateContext);
    const history = useHistory();
    const [examSchedule,setExamSchedule] = useState();
    const [examScheduleWithDateTime,setExamScheduleWithDateTime] = useState();

    useEffect(()=>{
      reload();
    },[]);
    function onApproved(){

    }
    function onDenied(){

    }
    if(!type){
        return <ExamScheduleDay
            reload={reload}
            student={state.currentStudent}
            schedulesDate={examSchedule}
            schedulesDateTime={examScheduleWithDateTime}
        />
    }

    async function reload(){
        let dataDateTime = await getExamSchedules();
        setExamScheduleWithDateTime(dataDateTime);
        let dataDateOnly = await getExamSchedules('date');
        setExamSchedule(dataDateOnly);
    }

    return <CheckInProcess
        state={state}
        StdRegistID={StdRegistID}
        onApproved={onApproved}
        onDenied={onDenied}
    >
        {(scheduelInfo,serverTime)=>{
            return <>
                {type=='workshop' &&
                <Workshop student={state.currentStudent} scheduleInfo={scheduelInfo} serverTime={serverTime} onSubmitted={e=>reload()}/>
                }
                {type=='theory' &&
                <Theory student={state.currentStudent} scheduleInfo={scheduelInfo} serverTime={serverTime} onSubmitted={e=>reload()}/>
                }
            </>
        }}

    </CheckInProcess>
}
export default observer(Exam);
