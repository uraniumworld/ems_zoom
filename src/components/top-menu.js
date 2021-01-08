import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {useLocation,NavLink,useParams,withRouter} from 'react-router-dom';

const TopMenu=(props)=>{
    const state = useContext(StateContext);
    // const location = useLocation();
    const params = useParams();
    console.log('top===',params);
    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Ems Check-in</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/" exact>Schedule</NavLink>
                </li>
                {
                    state.scheduleMenu.map(mn=>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={mn.to} exact>-> {mn.title}</NavLink>
                        </li>
                    )
                }
            </ul>
        </div>
        {/*<div className="collapse navbar-collapse" id="navbarNav">*/}
        {/*    {location && location.pathname.match(/\/schedule/) &&*/}
        {/*    <ul className="navbar-nav">*/}
        {/*        {*/}
        {/*            Object.keys(students).map(grp=>(*/}
        {/*                <li className="nav-item">*/}
        {/*                    <NavLink className="nav-link" to={`/schedule/${id}/group/${group}`}>{grp}</NavLink>*/}
        {/*                </li>*/}
        {/*            ))*/}
        {/*        }*/}
        {/*    </ul>*/}
        {/*    }*/}
        {/*</div>*/}
    </nav>
}
export default observer(TopMenu);