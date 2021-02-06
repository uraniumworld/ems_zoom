import {Redirect, Route, Switch} from "react-router-dom";
import Exam from "./exam";
import ClientHome from "./client-home";
import LoginClient from "./login-client";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {checkLogin} from "../client-components/client-services";
import {Alert, Badge, Card, Col} from "react-bootstrap";
import {observer} from "mobx-react";
import RequiredSEB from "../client-ui/required-seb";

let timer;
const Student = ()=>{
    const state = useContext(StateContext);
    const [blockBySafeExamBrowser,setBlockBySafeExamBrowser] = useState();

    useEffect(() => {
        init();
        return ()=>{
            clearInterval(timer);
        }
    }, []);

    async function init(){
        checker();
        timer=setInterval(() => {
            checker()
        }, 5 * 60000)
    }

    function checker() {
        checkLogin().then(user => {
            if(user.requiredSafeExamBrowser){
                setBlockBySafeExamBrowser(true);
                return;
            }
            setBlockBySafeExamBrowser(false);
            if (user) {
                state.setStudent(user);
            } else {
                state.setStudent(null);
            }
        })
    }
    if(blockBySafeExamBrowser){
        return <RequiredSEB/>
    }
    if (typeof state.currentStudent == 'undefined') return <Alert variant='info'>Loading...</Alert>
    return <>
        {state.currentStudent
            ?
            <Switch>
                <Route path="/" exact component={ClientHome}/>
                <Route path="/exam" exact exact component={Exam}/>
                <Route path="/exam/:type/:StdRegistID" component={Exam}/>
                <Redirect to="/exam"/>
            </Switch>
            :
            <Switch>
                <Route path="/" exact component={ClientHome}/>
                <Route path="*" component={LoginClient}/>
            </Switch>
        }
    </>
}
export default observer(Student);
