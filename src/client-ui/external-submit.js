import {Alert, Button, Card, Col, Container, Form, Nav, Navbar, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {
    checkLogin,
    getAuthType,
    getWorkshopUser,
    noSEBCheckLogin,
    noSEBGetAuthType
} from "../client-components/client-services";
import StateContext from "../mobx/global-context";
import student from "./student";
import ClientTopMenu from "../client-components/client-top-menu";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileExcel, faFilePowerpoint, faFileWord} from "@fortawesome/free-solid-svg-icons";
import ClientWorkshopUploader from "../client-components/client-workshop-uploader";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react";

const ExternalSubmit = ()=>{

    const state = useContext(StateContext);
    const [currentUserWorkshop,setCurrentUserWorkshop] = useState();
    const {StdRegistID, SchdDetailID} = useParams();

    useEffect(()=>{
        init();
    },[]);

    useEffect(()=>{

    },[state.currentStudent])

    async function init(){
        let login = await noSEBCheckLogin();
        state.setStudent(login);
        if(!login){
            let auth = await noSEBGetAuthType();
            state.setAuth(auth);
            if(auth){
                document.location.href=auth.ssoURL;
            }
        }
    }

    function MS(typeName){
        return <Card className="mb-2">
            {typeName=='word' &&
                <FontAwesomeIcon color="#007bff" icon={faFileWord} size="4x" className="ml-3 mt-2"/>
            }
            {typeName=='excel' &&
            <FontAwesomeIcon color="#28a745" icon={faFileExcel} size="4x" className="ml-3 mt-2"/>
            }
            {typeName=='powerpoint' &&
            <FontAwesomeIcon color="#ffc107" icon={faFilePowerpoint} size="4x" className="ml-3 mt-2"/>
            }
            <Card.Body>
                <Form.Group>
                    <Form.Label>MS {typeName}</Form.Label>
                    <Form.Control type='file' name={typeName}/>
                </Form.Group>
            </Card.Body>
        </Card>
    }

    async function reloadWorkshopFile() {
        let result = await getWorkshopUser(StdRegistID, SchdDetailID);
        setCurrentUserWorkshop(result);
    }

    let student = state.currentStudent;

    return <div>
        {student?
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">
                        KKU EMS Workshop External Submit
                    </Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link>{student.studentID} | {student.fname} {student.lname}</Nav.Link>
                        <Button variant="danger">Logout</Button>
                    </Nav>
                </Navbar>
                <Container>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>External Workshop Submit</Card.Header>
                                <Card.Body>
                                    <Form>
                                        {/*{MS('word')}*/}
                                        {/*{MS('excel')}*/}
                                        {/*{MS('powerpoint')}*/}
                                        <ClientWorkshopUploader student={student} PracticeID={1} />
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
export default observer(ExternalSubmit);
