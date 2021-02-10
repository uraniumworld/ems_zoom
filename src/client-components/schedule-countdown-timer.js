import moment from "moment";
import {Badge} from "react-bootstrap";
import {useRef} from "react";

const ScheduleCountdownTimer=({currentTime,schd,onTimeEnd})=>{
    const isEventTicked=useRef(false);
    function getJSTime(){
        let {ExamDate,ExamTimeStart}=schd;
        let buffer=`${ExamDate} ${ExamTimeStart}`;
        return moment(buffer);
    }

    function displayTimeDiff(){
        let diffUnit=getJSTime(schd).diff(currentTime);
        if(diffUnit<1){
            if(onTimeEnd && !isEventTicked.current){
                isEventTicked.current=true;
                onTimeEnd();
            }
            return <></>;
        }
        return <Badge variant='warning'>{moment.utc(diffUnit).format('HH:mm:ss')} Hours</Badge>;
    }
    return displayTimeDiff()
}
export default ScheduleCountdownTimer;