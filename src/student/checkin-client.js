const axios = require('axios');
const qs = require('qs');
const $ = require( "jquery" );
let last_update=0;
let last_update_url=0;
let root;
let exam;
window.onload=function(){
    root=$('#check-in');
    watch();
    setInterval(()=>{
        watch();
    },5000);
}
function watch(){
    request('client',{SchdID:129,SchdDetailID:3474}).then(data=>{
        if(last_update!=data.last_update || last_update_url!=data.last_update_url){
            console.log(data);
            root.html('');
            if(data.check_in_status=="1"){
                root.html('CHECK-IN OK');
                exam=$('#exam');
                if(exam.length==0)document.location.reload();
            }else{
                if(data.meet_url){
                    let url=data.meet_url.match(/^http/)?data.meet_url:`https://${data.meet_url}`;
                    let btn=$(`<a class="btn btn-primary btn-sm ml-2" href="${url}" target="_blank">Click Here</a>`);
                    root.append($('<span>Please <span class="badge badge-info">check-in</span> before start</span>'));
                    root.append(btn);
                }else{
                    let btn=$(`<a class="btn btn-primary btn-sm ml-2 disabled">Waiting meet...</a>`);
                    root.append($('<span>Please <span class="badge badge-info">check-in</span> before start</span>'));
                    root.append(btn);
                }
                exam=$('#exam');
                exam.remove();
            }
            last_update=data.last_update;
            last_update_url=data.last_update_url;
        }

    })
}
function request(method,params){
    return new Promise(resolve => {
        let paramsSend={
            method,
            ...params
        };
        let queryString=qs.stringify(paramsSend);
        axios.get('https://ems.kku.ac.th/ems_tools/check_in_resful_api.php?'+queryString).then(res=>{
            resolve(res.data);
        }).catch(e=>{
            resolve(null);
        });
    })
}
