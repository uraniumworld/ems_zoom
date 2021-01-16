import axios from "axios";
import moment from "moment";
import {confirmAlert} from "react-confirm-alert";

export function getSchedules(month,year){
    return  new Promise(resolve => {
        axios.post('/check_in_resful_api.php?method=schedule',{m:parseInt(month),y:parseInt(year)})
            .then(res=>{
               let resultWithGroup={};
               res.data.results.sort((a,b)=>{
                  let aDate = moment(a.ExamDate);
                  let bDate = moment(b.ExamDate);
                   if(aDate==bDate)return 0;
                   if(aDate>bDate)return 1;
                   return -1;
               });
               res.data.results.map(schd=>{
                    schd = tranformScheduleDate(schd);
                    if(!resultWithGroup[schd.ExamDate])resultWithGroup[schd.ExamDate]=[];
                    resultWithGroup[schd.ExamDate].push(schd);
                });
                Object.keys(resultWithGroup).map(key=>{
                    resultWithGroup[key].sort((a,b)=>{
                        let aDate = parseInt(a.ExamTimeStart);
                        let bDate = parseInt(b.ExamTimeEnd);
                        if(aDate==bDate)return 0;
                        if(aDate>bDate)return 1;
                        return -1;
                    })
                })
                console.log(resultWithGroup);
                resolve(resultWithGroup);
            })
    })
}

export function getEmailByScheduleDetail(SchdID,SchdDetailID){
    return new Promise(resolve => {
        axios.post('/check_in_resful_api.php?method=students',{SchdID,SchdDetailID})
            .then(res=>{
                let {data} = res;
                resolve(data);
            }).catch(e=>{
                resolve(null)
        });
    })
}

export function getScheduleInfo(SchdID,SchdDetailID){
    return new Promise(async resolve => {
        let schedule = await request('schedule-info',{SchdID,SchdDetailID});
        schedule = tranformScheduleDate(schedule);
        resolve(schedule);
    });
}

export function getCheckInStudents(SchdID,SchdDetailID,group){
    return request('get-check-in-students',{SchdID,SchdDetailID,group})
}

export function changeCheckInState(StdRegistID,state){
    return request('change-state',{StdRegistID,state})
}

export function getMeetURL(SchdID, SchdDetailID,group){
    return request('get-meet-url',{SchdID,SchdDetailID,group})
}

export function setMeetURL(SchdID, SchdDetailID,group,url){
    return request('set-meet-url',{SchdID,SchdDetailID,group,url})
}

export function removeMeetURL(SchdID, SchdDetailID,group){
    return request('remove-meet-url',{SchdID,SchdDetailID,group})
}

export function pairUserData(pairData=[]){
    return request('pair-user',{pairData})
}

export function checkLogin(){
    return request('check-login')
}

export function userLogout(){
    return request('logout')
}

export function userLogin(username,password){
    return request('login',{username,password})
}

export function confirmBox(title,detail,fn){
    confirmAlert({
        title:title,
        message:detail?detail:'Do you want to do?',
        buttons:[
            {
                label: 'Yes',
                onClick: () => fn()
            },
            {
                label: 'No',
            }
        ]
    });
}

function tranformScheduleDate(schedule){
    schedule.ExamDate=schedule.ExamDate.split(' ')[0];
    schedule.ExamTimeStart=schedule.ExamTimeStart.split(' ')[1];
    schedule.ExamTimeEnd=schedule.ExamTimeEnd.split(' ')[1];
    return schedule;
}

function request(method,params={}){
    return new Promise(resolve => {
        axios.post('/check_in_resful_api.php?method='+method,params)
            .then(res=>{
                resolve(res.data);
            }).catch(e=>{
                document.location.href='/login'
            // resolve(null)
        });
    })
}
