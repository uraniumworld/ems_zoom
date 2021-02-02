import TimerClock from "../client-components/timer-clock";
import React, {useEffect} from "react";
import {getTheoryQuestions} from "../client-components/client-services";

const Theory = ({scheduleInfo, serverTime})=>{

    useEffect(()=>{
        getTheoryQuestions(scheduleInfo.StdRegistID);
    },[]);

    function onTimeout(){

    }
    return <div>
        <div className="container-wrapper" style={{paddingLeft: '120px'}}>
            <div className="exam-sidebar">
                <TimerClock serverTime={serverTime}
                            expire={`${scheduleInfo.ExamDate} ${scheduleInfo.ExamTimeEnd}`}
                            onTimeout={onTimeout}
                />
            </div>
        </div>
    </div>
}
export default Theory;
