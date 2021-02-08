import './App.css';
import {Route, Switch, useLocation,Redirect} from 'react-router-dom';
import Login from "./ui/login";
import StateContext from "./mobx/global-context";
import MobxStore from "./mobx/mobx-store";
import {observer} from "mobx-react";
import Home from "./ui/home";
import FullLayout from "./layouts/full-layout";
import ViewGroup from "./ui/view-group";
import ViewStudent from "./ui/view-student";
import {ToastContainer, toast, Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useEffect} from "react";
import {checkLogin} from "./components/services";
import {Alert} from "react-bootstrap"; // Import css
import Config from './config';
import Workshop from "./client-ui/workshop";
import ClientHome from "./client-ui/client-home";
import Theory from "./client-ui/theory";
import Exam from "./client-ui/exam";
import LoginClient from "./client-ui/login-client";
import Admin from "./ui/admin";
import Student from "./client-ui/student";
import Public from "./client-ui/public";

export const mobxStore = new MobxStore();

function App() {
    let location = useLocation();
    let {adminPath} = Config;
    return (
        <StateContext.Provider value={mobxStore}>
            <Switch>
                <Route path={adminPath()}>
                    <Admin/>
                </Route>
                <Route path="/">
                    <Switch>
                        <Route path="/" exact component={Public}/>
                        <Student/>
                    </Switch>
                </Route>
            </Switch>
            <ToastContainer
                transition={Slide}
                limit={3}
                autoClose={2000}
            />
        </StateContext.Provider>
    );
}

export default observer(App);
