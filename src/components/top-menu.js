import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {useLocation,NavLink,useParams,withRouter,useHistory} from 'react-router-dom';
import {Badge, Button} from "react-bootstrap";
import {userLogout} from "./services";
import Config from "../config";


const TopMenu=(props)=>{
    const state = useContext(StateContext);
    const history = useHistory();
    const params = useParams();
    async function logout(){
        await userLogout();
        state.setUser(null);
        history.push(Config.adminPath('/login'));
    }
    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Ems Check-in</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to={Config.adminPath()} exact>Schedule</NavLink>
                </li>
                {
                    state.scheduleMenu.map(mn=>
                        <li key={mn.title} className="nav-item">
                            <NavLink className="nav-link" to={Config.adminPath(mn.to)} exact>-> {mn.title}</NavLink>
                        </li>
                    )
                }
            </ul>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/" exact>
                        Username: <strong className="mr-2">{state.currentUser.username}</strong><Button variant="danger" onClick={e=>{logout()}}>Logout</Button>
                    </NavLink>
                </li>
            </ul>
        </div>
    </nav>
}
export default observer(TopMenu);
