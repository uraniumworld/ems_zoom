import {Badge, Col, Image} from "react-bootstrap";
import React, {useContext} from "react";
import StateContext from "../mobx/global-context";
import {observer} from "mobx-react";

const DisplayMeetURL= ()=>{
    const state = useContext(StateContext);
    return <>
        {state.currentMeetURL && state.currentMeetQRCODE &&
        <Col>
            <div className="text-right"><Badge>Your Google Meet URL</Badge></div>
            <div className="text-right"><Badge style={{textTransform:'upperCase'}}>{state.currentGroupName}</Badge> <Image src={state.currentMeetQRCODE} width="100"/></div>
            <div className="text-right"><Badge variant="info">{state.currentMeetURL}</Badge></div>
            <hr/>
        </Col>
        }
    </>
}
export default observer(DisplayMeetURL);
