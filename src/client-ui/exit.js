import {useContext} from "react";
import StateContext from "../mobx/global-context";

const Exam = ()=>{
    const state = useContext(StateContext);
    return <div>
        EXIT
    </div>
}
export default Exam;
