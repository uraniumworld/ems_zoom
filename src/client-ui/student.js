import {Redirect, Route, Switch} from "react-router-dom";
import Exam from "./exam";
import ClientHome from "./client-home";
import LoginClient from "./login-client";
import {useContext, useEffect, useState} from "react";
import StateContext from "../mobx/global-context";
import {checkLogin} from "../client-components/client-services";
import {Alert, Badge, Card, Col} from "react-bootstrap";
import {observer} from "mobx-react";

let timer;
const Student = ()=>{
    const state = useContext(StateContext);
    const [safeExamBrowser,setSafeExamBrowser] = useState();

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
                setSafeExamBrowser(true);
                return;
            }
            setSafeExamBrowser(false);
            if (user) {
                state.setStudent(user);
            } else {
                state.setStudent(null);
            }
        })
    }
    if(safeExamBrowser){
        return <div>
            <Card className="mt-4">
                <Card.Header>Ems examination.</Card.Header>
                <Card.Body>
                    <h1 className="mb-4">Please download Safe exam browser</h1>
                    <div className="mb-2">Step 1. <a className="btn btn-primary btn-lg" target="_blank" href="https://safeexambrowser.org/download_en.html">Download Here</a></div>
                    <div className="mb-2">Step 2. <a className="btn btn-info btn-lg" target="_blank" href="https://safeexambrowser.org/download_en.html">Download "startExam.seb"</a></div>
                    <div className="mb-2">
                        Step 3. <strong>Double click downloaded file named "startExam.seb"</strong>
                    </div>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </div>
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
