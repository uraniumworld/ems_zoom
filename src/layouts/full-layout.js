import React from 'react';
import {Col, Container, Navbar, Row} from "react-bootstrap";
import TopMenu from "../components/top-menu";
import Footer from "../components/footer";
import {useParams,withRouter} from "react-router-dom";

const FullLayout = (props)=>{
    const params = useParams();
    console.log('top layout===',props);
    return <>
        <div className="container-wrapper">
            <TopMenu/>
            <Container>
                <Row>
                    <Col>{props.children}</Col>
                </Row>
            </Container>
        </div>
        <Footer/>
    </>
}
export default withRouter(FullLayout);
