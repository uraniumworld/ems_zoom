import './App.css';
import {Route, Switch} from 'react-router-dom';
import Login from "./ui/login";
import StateContext from "./mobx/global-context";
import MobxStore from "./mobx/mobx-store";
import {observer} from "mobx-react";
import Home from "./ui/home";
import FullLayout from "./layouts/full-layout";

const mobxStore = new MobxStore();

function App() {
    return (
        <StateContext.Provider value={mobxStore}>
            {mobxStore.currentUser
                ?
                <FullLayout>
                    <Switch>
                        <Route path="/" exact component={Home}/>
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
