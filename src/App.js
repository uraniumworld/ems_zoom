import './App.css';
import {Route, Switch} from 'react-router-dom';
import Login from "./ui/login";
import StateContext from "./mobx/global-context";
import MobxStore from "./mobx/mobx-store";
import {observer} from "mobx-react";
import Home from "./ui/home";
import FullLayout from "./layouts/full-layout";
import ViewGroup from "./ui/view-group";
import ViewStudent from "./ui/view-student";
import Email from "./ui/email";
import {ToastContainer, toast, Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useEffect} from "react";
import {checkLogin} from "./components/services";
import {Alert} from "react-bootstrap"; // Import css

const mobxStore = new MobxStore();

function App() {
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
    return (
        <StateContext.Provider value={mobxStore}>
            {mobxStore.currentUser
                ?
                <FullLayout>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/email" component={Email}/>
                        <Route path="/schedule/:SchdID(\d+)/:SchdDetailID(\d+)" exact component={ViewGroup}/>
                        <Route path="/schedule/:SchdID(\d+)/:SchdDetailID(\d+)/:group" component={ViewStudent}/>
                    </Switch>
                </FullLayout>
                :
                <Switch>
                    <Route path="*" component={Login}/>
                </Switch>
            }
            <ToastContainer
                transition={Slide}
                limit={3}
                autoClose={2000}
            />
        </StateContext.Provider>
    );
}

export default observer(App);
