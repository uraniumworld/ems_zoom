import React, {useContext, useState} from 'react';
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {observer} from "mobx-react";
import globalState from "../mobx/global-context";
import {userLogin} from "../components/services";
import {useHistory} from 'react-router-dom';
import Config from "../config";

const Login = ()=>{
    const mobx=useContext(globalState);
    const [formUsername,setFormUsername]=useState('');
    const [formPassword,setFormPassword]=useState('');
    let history = useHistory();
    async function login(e){
       let user =await userLogin(formUsername,formPassword);
       if(user){
           mobx.setUser(user);
           history.push(Config.adminPath());
       }
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
                        <Form.Control type="text" value={formUsername} onChange={e=>setFormUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={formPassword} onChange={e=>setFormPassword(e.target.value)}/>
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
