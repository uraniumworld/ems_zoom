import './App.css';
import {Route, Switch} from 'react-router-dom';
import Login from "./ui/login";
import StateContext from "./mobx/global-context";
import MobxStore from "./mobx/mobx-store";
import {observer} from "mobx-react";
import Home from "./ui/home";
import FullLayout from "./layouts/full-layout";
import ViewSchedule from "./ui/view-schedule";
import ViewStudent from "./ui/view-student";
import Email from "./ui/email";

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
                        <Route path="/schedule/:SchdID(\d+)/:SchdDetailID(\d+)" exact component={ViewSchedule}/>
                        <Route path="/schedule/:SchdID(\d+)/:SchdDetailID(\d+)/:group" component={ViewStudent}/>
                    </Switch>
                </FullLayout>
                :
                <Switch>
                    <Route path="*" component={Login}/>
                </Switch>
            }
        </StateContext.Provider>
    );
}

export default observer(App);
