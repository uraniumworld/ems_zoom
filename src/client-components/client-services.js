import axios from "axios";
import {tranformScheduleDate} from "../components/services";




export async function getExamSchedules(Username){
    let schedules=await request('exam-schedule',{Username});
    return schedules && schedules.map(schd=>tranformScheduleDate(schd));
}

export function getWorkshopQuestion(StdRegistID,SchdDetailID){
    return  request('workshop-question',{StdRegistID,SchdDetailID});
}

export function getWorkshopUser(StdRegistID,SchdDetailID){
    return  request('workshop-user',{StdRegistID,SchdDetailID});
}

export function checkClient(StdRegistID){
    return  request('client',{StdRegistID});
}

export function uploadWorkshopFile(formData){
    return  request('workshop-upload',formData);
}

export function download(RowID){
    window.open('https://ems.kku.ac.th/ems_tools/examination_resful_api.php?method=download&id='+RowID)
}

export function checkLogin(user,pass){
    return request('check-login');
}

export function studentLogin(user,pass){
    return request('login',{user,pass});
}

export function studentLogout(){
    return request('logout');
}

export function getMyPicture(){
    return  request('get-my-picture');
}

export async function getScheduleInfo(StdRegistID){
    let result = await request('get-schedule-info',{StdRegistID});
    tranformScheduleDate(result);
    return result;
}


function request(method,params={},scriptName='examination_resful_api.php'){
    return new Promise(resolve => {
        axios.post(`/${scriptName}?method=`+method,params)
            .then(res=>{
                resolve(res.data);
            }).catch(e=>{
            document.location.href='/login'
            // resolve(null)
        });
    })
}
