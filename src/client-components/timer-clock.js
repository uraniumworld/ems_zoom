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
        timer.current=setInterval(()=>{
            updateUI();
        },1000);
        return ()=>{
            clearInterval(timer.current);
        }
    },[]);

    useEffect(()=>{
        let clientTime=moment().unix();
        timeDiff.current=serverTime-clientTime;
    },[serverTime])

    useEffect(()=>{
        clearInterval(timer.current);
        timer.current=setInterval(()=>{
            updateUI();
        },1000);
    },[expire,timeDiff.current]);

    function updateUI(){
        let expireTime = moment(expire);
        let timeUpDuration = (moment().unix()+timeDiff.current)-expireTime.unix();
        // let diff = expireTime.diff()+timeDiff.current;
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
