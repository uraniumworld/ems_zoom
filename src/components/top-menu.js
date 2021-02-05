import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {useLocation,NavLink,useParams,withRouter,useHistory} from 'react-router-dom';
import {Badge, Button, Nav, Navbar} from "react-bootstrap";
import {userLogout} from "./services";
import Config from "../config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";


const TopMenu=(props)=>{
    const state = useContext(StateContext);
    const history = useHistory();
    const params = useParams();
    async function logout(){
        await userLogout();
        state.setUser(null);
        history.push(Config.adminPath('/login'));
    }
    return <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Ems Check-in</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <NavLink className="nav-link" to={Config.adminPath()} exact>Schedule</NavLink>
                {
                    state.scheduleMenu.map(mn=>
                       <NavLink key={mn.title} className="nav-link" to={Config.adminPath(mn.to)} exact><FontAwesomeIcon className="mr-2" icon={faArrowRight}/>{mn.title}</NavLink>
                    )
                }
            </Nav>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/" exact>
                        Username: <strong className="mr-2">{state.currentUser.username}</strong><Button variant="danger" onClick={e=>{logout()}}>Logout</Button>
                    </NavLink>
                </li>
            </ul>
        </Navbar.Collapse>
    </Navbar>
}
export default observer(TopMenu);
