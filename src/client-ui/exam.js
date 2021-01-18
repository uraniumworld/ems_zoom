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

const Exam=()=>{
    const {type,StdRegistID, SchdDetailID} = useParams();
    const state = useContext(StateContext);
    const history = useHistory();
    const [examSchedule,setExamSchedule] = useState();

    useEffect(()=>{
        getExamSchedules().then(data=>{
            setExamSchedule(data);
        });
    },[]);
    function onApproved(){

    }
    function onDenied(){

    }
    if(!type){
        return <ExamScheduleDay schedules={examSchedule}/>
    }
    return <CheckInProcess
        StdRegistID={StdRegistID}
        onApproved={onApproved}
        onDenied={onDenied}
    >
        {type=='workshop' &&
            <Workshop/>
        }
    </CheckInProcess>
}
export default observer(Exam);
