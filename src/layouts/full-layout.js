import React from 'react';
import {Col, Container, Navbar, Row} from "react-bootstrap";
import TopMenu from "../components/top-menu";

const FullLayout = ({children})=>{
    return <div>
        <TopMenu/>
        <Container>
            <Row>
                <Col>{children}</Col>
            </Row>
        </Container>
    </div>
}
export default FullLayout;