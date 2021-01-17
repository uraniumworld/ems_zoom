import {useParams} from "react-router-dom";
import CheckInProcess from "../client-components/check-in-process";
import React from "react";
import Workshop from "./workshop";

const Exam=()=>{
    const {type,StdRegistID, SchdDetailID} = useParams();
    function onApproved(){

    }
    function onDenied(){

    }
    return <CheckInProcess
        StdRegistID={StdRegistID}
        onApproved={onApproved}
        onDenied={onDenied}
    >
        {type=='workshop' &&
            <Workshop/>
        }
    </CheckInProcess>
}
export default Exam;
