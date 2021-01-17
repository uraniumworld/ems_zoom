import './App.css';
import {Route, Switch, useLocation} from 'react-router-dom';
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

const mobxStore = new MobxStore();

function App() {
    let location = useLocation();
    useEffect(()=>{
        checker();
        setInterval(()=>{checker()},5*60000)
    },[]);
    function checker(){
        checkLogin().then(user=>{
            if(user){
                mobxStore.setUser(user);
            }else{
                mobxStore.setUser(null);
            }
        })
    }
    if(typeof mobxStore.currentUser == 'undefined')return <Alert variant='info'>Loading...</Alert>
    let {adminPath} = Config;
    return (
        <StateContext.Provider value={mobxStore}>
            <Switch>
                <Route path={adminPath()}>
                    {mobxStore.currentUser
                        ?
                        <FullLayout>
                            <Switch>
                                <Route path={adminPath()} exact component={Home}/>
                                <Route path={adminPath('/schedule/:SchdID(\\d+)/:SchdDetailID(\\d+)')} exact component={ViewGroup}/>
                                <Route path={adminPath('/schedule/:SchdID(\\d+)/:SchdDetailID(\\d+)/:group')} component={ViewStudent}/>
                            </Switch>
                        </FullLayout>
                        :
                        <Switch>
                            <Route path="*" component={Login}/>
                        </Switch>
                    }
                </Route>
                <Route path="/">
                    <Switch>
                        <Route path="/" exact component={ClientHome}/>
                        <Route path="/exam" exact exact component={Exam}/>
                        <Route path="/exam/:type/:StdRegistID/:SchdDetailID" component={Exam}/>
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
