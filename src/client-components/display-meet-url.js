import {Badge, Col, Image, Row} from "react-bootstrap";
import React, {useContext} from "react";
import StateContext from "../mobx/global-context";
import {observer} from "mobx-react";
import ChatDisplay from "./chat-display";

const DisplayMeetURL= ({SchdID, SchdDetailID})=>{
    const state = useContext(StateContext);
    return <>
        <ChatDisplay SchdID={SchdID} SchdDetailID={SchdDetailID} group_name={state.currentGroupName} visible={false}/>
        {state.currentMeetURL && state.currentMeetQRCODE &&
        <Row>
            <Col>
                <div className="text-right"><Badge>Your Google Meet URL</Badge></div>
                <div className="text-right"><Badge style={{textTransform:'upperCase'}}>{state.currentGroupName}</Badge> <Image src={state.currentMeetQRCODE} width="100"/></div>
                <div className="text-right"><Badge variant="info">{state.currentMeetURL}</Badge></div>
                <hr/>
            </Col>
        </Row>
        }
    </>
}
export default observer(DisplayMeetURL);
