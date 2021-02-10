import axios from "axios";
import {tranformScheduleDate} from "../components/services";




export async function getExamSchedules(condition){
    let schedules=await request('exam-schedule',{condition});
    return schedules && schedules.map(schd=>tranformScheduleDate(schd));
}

export function getWorkshopQuestion(StdRegistID,SchdDetailID){
    return  request('workshop-question',{StdRegistID,SchdDetailID});
}

export function getWorkshopUser(StdRegistID,SchdDetailID){
    return  request('workshop-user',{StdRegistID,SchdDetailID});
}

export function getTheoryUser(StdRegistID){
    return  request('theory-user',{StdRegistID});
}

export function theoryAnswer(StdRegistID,RowID,TheoryID,IsAnswer){
    return request('theory-answer',{StdRegistID,RowID,TheoryID,IsAnswer});
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

export function checkSafeExamBrowser(){
    return request('safe-exam-browser');
}

export function getAuthType(){
    return request('auth-type');
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
    if(result)tranformScheduleDate(result);
    return result;
}

export function updateO365URL(StdRegistID,PracticeID,url){
    return request('update-o365-url',{StdRegistID,PracticeID,url});
}

export function submitAndExit(StdRegistID){
    return request('submit-and-exit',{StdRegistID});
}

export function getTheoryQuestions(StdRegistID){
    return request('theory-question',{StdRegistID});
}

function request(method,params={},scriptName='examination_resful_api.php'){
    return new Promise(resolve => {
        axios.post(`/ems_tools/${scriptName}?method=`+method,params)
            .then(res=>{
                resolve(res.data);
            }).catch(e=>{
            // document.location.href='/login'
            resolve(null)
        });
    })
}
