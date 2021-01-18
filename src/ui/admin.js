import FullLayout from "../layouts/full-layout";
import {Route, Switch} from "react-router-dom";
import Home from "./home";
import ViewGroup from "./view-group";
import ViewStudent from "./view-student";
import Login from "./login";
import {observer} from "mobx-react";
import {useContext, useEffect} from "react";
import StateContext from "../mobx/global-context";
import Config from "../config";
import {Alert} from "react-bootstrap";
import {checkLogin} from "../components/services";

let timer;
const Admin = ()=>{
    const state = useContext(StateContext);
    let {adminPath} = Config;
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
                state.setUser(user);
            } else {
                state.setUser(null);
            }
        })
    }
    if (typeof state.currentUser == 'undefined') return <Alert variant='info'>Loading...</Alert>
    return <>
        {state.currentUser
            ?
            <FullLayout>
                <Switch>
                    <Route path={adminPath()} exact component={Home}/>
                    <Route path={adminPath('/schedule/:SchdID(\\d+)/:SchdDetailID(\\d+)')} exact
                           component={ViewGroup}/>
                    <Route path={adminPath('/schedule/:SchdID(\\d+)/:SchdDetailID(\\d+)/:group')}
                           component={ViewStudent}/>
                </Switch>
            </FullLayout>
            :
            <Switch>
                <Route path="*" component={Login}/>
            </Switch>
        }
    </>
}
export default observer(Admin);