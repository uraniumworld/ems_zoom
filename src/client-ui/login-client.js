import React, {useContext, useState} from 'react';
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {observer} from "mobx-react";
import globalState from "../mobx/global-context";
import {useHistory} from 'react-router-dom';
import {studentLogin} from "../client-components/client-services";
import {toast} from "react-toastify";

const LoginClient = ()=>{
    const mobx=useContext(globalState);
    const [formUsername,setFormUsername]=useState('603290342-0');
    const [formPassword,setFormPassword]=useState('**123456');
    let history = useHistory();
    async function login(e){
        e.preventDefault();
        let user =await studentLogin(formUsername,formPassword);
        if(user && !user.error){
            mobx.setUser(user);
            history.push('/exam');
        }else{
            toast.error(user.error)
        }
    }
    return <Row className="justify-content-md-center">
        <Col xs={12} md={6} className="">
            <Card className="login-panel mt-5">
                <Card.Header>
                    <Card.Title>Student Login</Card.Title>
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
export default observer(LoginClient);