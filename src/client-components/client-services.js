import axios from "axios";



export function getWorkshopQuestion(StdRegistID){
    return  request('workshop-question',{StdRegistID});
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
