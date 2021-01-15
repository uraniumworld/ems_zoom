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

const mobxStore = new MobxStore();

function App() {
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
