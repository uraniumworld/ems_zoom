import React, {useContext, useState} from 'react';
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {observer} from "mobx-react";
import globalState from "../mobx/global-context";
import {useHistory} from 'react-router-dom';
import {studentLogin} from "../client-components/client-services";
import {toast} from "react-toastify";

const LoginClient = ()=>{
    const state=useContext(globalState);
    const [formUsername,setFormUsername]=useState('');
    const [formPassword,setFormPassword]=useState('');
    let history = useHistory();
    async function login(e){
        e.preventDefault();
        let student =await studentLogin(formUsername,formPassword);
        if(student && !student.error){
            state.setStudent(student);
            history.push('/exam');
        }else{
            toast.error(student.error)
        }
    }
    return <Row className="justify-content-md-center">
        <Col xs={12} md={6} className="">
            <Card className="login-panel mt-5">
                <Card.Header>
                    <Card.Title>Student Login</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={e=>login(e)}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={formUsername} onChange={e=>setFormUsername(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={formPassword} onChange={e=>setFormPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Button className="mr-2" variant="primary" type="submit">Submit</Button>
                            <a href="https://exit" className="btn btn-danger">Exit</a>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
}
export default observer(LoginClient);
