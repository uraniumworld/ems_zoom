import {useEffect, useRef, useState} from "react";
import moment from "moment";
import {StyleSheet,css} from 'aphrodite';
import {Alert, Badge, Card} from "react-bootstrap";
const TimerClock = ({serverTime=0,expire,onTimeout})=>{
    const [duration,setDuration] = useState();
    const timeDiff = useRef(0);
    const timer = useRef();
    useEffect(()=>{
        updateUI();
        // timer.current=setTimeout(()=>{
        //     updateUI();
        // },1000);
        return ()=>{
            clearInterval(timer.current);
        }
    },[]);

    useEffect(()=>{
        let clientTime=moment().unix();
        timeDiff.current=serverTime-clientTime;
        clearInterval(timer.current);
        updateUI();
    },[serverTime])

    useEffect(()=>{
        clearInterval(timer.current);
        updateUI();
    },[expire]);

    function updateUI(){
        if(serverTime==0)return;
        let _clientTime = moment().add(timeDiff.current,'seconds');
        let _expireTime = moment(expire);
        let timeUpDuration = _expireTime.diff(_clientTime);
        if(timeUpDuration>0){
            let d = moment.utc(timeUpDuration).format("HH:mm:ss")
            setDuration(d);
        }else{
            setDuration(<Alert variant='danger'>Time is up!</Alert>);
            if(typeof onTimeout == 'function') {
                onTimeout();
                clearInterval(timer.current);
            }
        }
        timer.current=setTimeout(()=>{
            updateUI();
        },1000);
    }
    return <div className={css(styles.container)}>
        <div>Expire in</div>
        <div>{duration} Hours</div>
    </div>
}
const styles=StyleSheet.create({
    container:{
        padding:'10px',
        textAlign:'center'
    }
});
export default TimerClock;
