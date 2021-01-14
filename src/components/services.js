import axios from "axios";
import moment from "moment";

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
                    schd.ExamDate=schd.ExamDate.split(' ')[0];
                    schd.ExamTimeStart=schd.ExamTimeStart.split(' ')[1];
                    schd.ExamTimeEnd=schd.ExamTimeEnd.split(' ')[1];
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
    axios.post('/check_in_resful_api.php?method=students',{SchdID,SchdDetailID})
        .then(res=>{

        });
}
