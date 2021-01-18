import {Redirect, Route, Switch} from "react-router-dom";
import Exam from "./exam";
import ClientHome from "./client-home";
import LoginClient from "./login-client";
import {useContext, useEffect} from "react";
import StateContext from "../mobx/global-context";
import {checkLogin} from "../client-components/client-services";
import {Alert} from "react-bootstrap";
import {observer} from "mobx-react";

let timer;
const Student = ()=>{
    const state = useContext(StateContext);
    useEffect(() => {
        checker();
        timer=setInterval(() => {
            checker()
        }, 5 * 60000)
        return ()=>{
            clearInterval(timer);
        }
    }, []);
    function checker() {
        checkLogin().then(user => {
            if (user) {
                state.setStudent(user);
            } else {
                state.setStudent(null);
            }
        })
    }
    if (typeof state.currentStudent == 'undefined') return <Alert variant='info'>Loading...</Alert>
    return <>
        {state.currentStudent
            ?
            <Switch>
                <Route path="/" exact component={ClientHome}/>
                <Route path="/exam" exact exact component={Exam}/>
                <Route path="/exam/:type/:StdRegistID/:SchdDetailID" component={Exam}/>
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