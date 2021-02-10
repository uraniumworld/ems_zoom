import {Redirect, Route, Switch,useLocation} from "react-router-dom";
import Exam from "./exam";
import ClientHome from "./client-home";
import LoginClient from "./login-client";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {checkLogin, checkSafeExamBrowser, getAuthType} from "../client-components/client-services";
import {Alert, Badge, Card, Col} from "react-bootstrap";
import {observer} from "mobx-react";
import RequiredSEB from "../client-ui/required-seb";
import Public from "./public";
import MetaTags from "react-meta-tags";

let timer;
const Student = ()=>{
    const state = useContext(StateContext);
    const [blockBySafeExamBrowser,setBlockBySafeExamBrowser] = useState(false);
    let location = useLocation();

    useEffect(() => {
        init();
        return ()=>{
            clearInterval(timer);
        }
    }, []);

    async function init(){
        let SEB = await checkSafeExamBrowser();
        if(!SEB)return;
        if(SEB.sebError){
            setBlockBySafeExamBrowser(true);
            if(SEB.InvalidExamKey){
                setTimeout(()=>{
                    alert('Invalid SEB config hash.');
                    document.location.href='https://exit'
                },2000);
            }
            return;
        }
        state.setForceSEB(SEB);
        let auth = await getAuthType();
        state.setAuth(auth);
        await checker();
        timer=setInterval(() => {
            checker()
        }, 5 * 60000)
    }

    async function checker() {
        let user = await checkLogin();
        if (user) {
            state.setStudent(user);
        } else {
            state.setStudent(null);
        }
    }
    if(blockBySafeExamBrowser){
        return <RequiredSEB/>
    }
    if (typeof state.currentStudent == 'undefined' || !state.forceSEB || !state.auth) return <Alert variant='info'>Loading...</Alert>
    return <>
        <MetaTags>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </MetaTags>
        {state.currentStudent
            ?
            <Switch>
                <Route path="/start" exact component={ClientHome}/>
                <Route path="/exam" exact exact component={Exam}/>
                <Route path="/exam/:type/:StdRegistID" component={Exam}/>
                <Redirect to="/exam"/>
            </Switch>
            :
            <Switch>
                <Route path="/start" exact component={ClientHome}/>
                <Route path="*" component={LoginClient}/>
            </Switch>
        }
    </>
}
export default observer(Student);
