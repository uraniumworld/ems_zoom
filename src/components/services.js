import axios from "axios";

export function getSchedules(month,year){
    return  new Promise(resolve => {
        axios.post('/check_in_resful_api.php?method=schedule',{m:parseInt(month),y:parseInt(year)})
            .then(res=>{
                let schedules=res.data.results.map(schd=>{
                    schd.ExamDate=schd.ExamDate.split(' ')[0];
                    schd.ExamTimeStart=schd.ExamTimeStart.split(' ')[1];
                    schd.ExamTimeEnd=schd.ExamTimeEnd.split(' ')[1];
                    return schd;
                });
                console.log(schedules);
                resolve(schedules);
            })
    })
}
