import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {checkLogin, getAuthType, noSEBCheckLogin, noSEBGetAuthType} from "../client-components/client-services";
import StateContext from "../mobx/global-context";
import student from "./student";

const ExternalSubmit = ()=>{

    const state = useContext(StateContext);

    useEffect(()=>{
        init();
    },[]);

    async function init(){
        let auth = await noSEBGetAuthType();
        state.setAuth(auth);
        if(auth){
            let user = await noSEBCheckLogin();
            if (user) {
                state.setStudent(user);
            } else {
                state.setStudent(null);
                document.location.href=auth.ssoURL;
            }
        }
    }

    function MS(typeName){
        return <Card className="mb-2">
            <Card.Body>
                <Form.Group>
                    <Form.Label>MS {typeName}</Form.Label>
                    <Form.Control type='file' name={typeName}/>
                </Form.Group>
            </Card.Body>
        </Card>
    }

    return <div>
        {student?
            <>
                <Container>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>External Workshop Submit</Card.Header>
                                <Card.Body>
                                    <Form>
                                        {MS('word')}
                                        {MS('excel')}
                                        {MS('powerpoint')}
                                    </Form>
                                </Card.Body>
                                <Card.Footer>
                                    <Button className="ml-auto">Submit And Exit</Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
            :
            <Alert variant='info'>Redirecting... to KKU SSO</Alert>
        }
    </div>
}
export default ExternalSubmit;