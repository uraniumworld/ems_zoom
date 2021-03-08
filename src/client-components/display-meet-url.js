import {Badge, Col, Image} from "react-bootstrap";
import React, {useContext} from "react";
import StateContext from "../mobx/global-context";

const DisplayMeetURL= ()=>{
    const state = useContext(StateContext);
    return <>
        {state.currentMeetURL && state.currentMeetQRCODE &&
        <Col>
            <div className="text-center"><Badge>Your Google Meet URL</Badge></div>
            <div className="text-center"><Image src={state.currentMeetQRCODE} width="100"/></div>
            <div className="text-center"><Badge variant="info">{state.currentMeetURL}</Badge></div>
            <hr/>
        </Col>
        }
    </>
}
export default DisplayMeetURL;