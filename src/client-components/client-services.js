import axios from "axios";



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


function request(method,params={}){
    return new Promise(resolve => {
        axios.post('/examination_resful_api.php?method='+method,params)
            .then(res=>{
                resolve(res.data);
            }).catch(e=>{
            document.location.href='/login'
            // resolve(null)
        });
    })
}
