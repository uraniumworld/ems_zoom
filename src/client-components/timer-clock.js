import {useEffect, useRef, useState} from "react";
import moment from "moment";
import {StyleSheet,css} from 'aphrodite';
import {Alert, Badge} from "react-bootstrap";
let timer;
const TimerClock = ({serverDiff=0,expire})=>{
    const [duration,setDuration] = useState();
    useEffect(()=>{
        updateUI();
        timer=setInterval(()=>{
            updateUI();
        },1000);
        return ()=>{
            clearInterval(timer);
        }
    },[]);
    function updateUI(){
        let expireTime = moment(expire);
        let diff = expireTime.diff()+serverDiff;
        if(diff>0){
            let d = moment.utc(diff).format("HH:mm:ss")
            setDuration(d);
        }else{
            setDuration(<Alert variant='danger'>Time is up!</Alert>);
        }
    }
    return <div className={css(styles.container)}>
        <div>Expire in</div>
        <div>{duration}</div>
    </div>
}
const styles=StyleSheet.create({
    container:{
        padding:'10px',
        textAlign:'center'
    }
});
export default TimerClock;