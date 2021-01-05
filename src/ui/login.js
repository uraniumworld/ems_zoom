import React, {useContext} from 'react';
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {observer} from "mobx-react";
import globalState from "../mobx/global-context";

const Login = ()=>{
    const mobx=useContext(globalState);
    function login(e){
        mobx.setUser('xmuz');
    }
    return <Row className="justify-content-md-center">
    <Col xs={12} md={6} className="">
        <Card className="login-panel mt-5">
            <Card.Header>
                <Card.Title>Login</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary" onClick={login}>Submit</Button>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    </Col>
    </Row>
}
export default observer(Login);