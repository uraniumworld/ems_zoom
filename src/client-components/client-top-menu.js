import {Badge, Button, Nav, Navbar} from "react-bootstrap";
import React, {useContext} from "react";
import {confirmBox} from "../components/services";
import {studentLogout} from "./client-services";
import StateContext from "../mobx/global-context";
import {observer} from "mobx-react";

const ClientTopMenu = ({scheduleInfo,type,student,confirmSubmit})=>{
    const state = useContext(StateContext);
    function logout(){
        confirmBox('Logout','Do you want to logout?',async (e)=>{
            await studentLogout();
            state.setStudent(null);
        })
    }
    return <div className="exam-top-menu">
        <Navbar bg="light" expand="md">
            <Navbar.Brand>EMS - Workshop</Navbar.Brand>
            <Navbar.Text>{scheduleInfo.ExamDate} {scheduleInfo.ExamTimeStart}-{scheduleInfo.ExamTimeEnd}</Navbar.Text>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <Nav.Link href="#home">
                        <Button variant='primary' onClick={e => confirmSubmit()}>Submit and
                            exit</Button>
                    </Nav.Link>
                </Nav>
                <Nav className="ml-auto">

                    <Nav.Link>
                        <div>
                            <Badge className="mr-2">
                                <span className="mr-2">{student.student.StudentID}</span>
                                <span className="mr-2">|</span>
                                <span>{student.student.FirstName_Th} {student.student.LastName_Th}</span>
                            </Badge>
                            <Button variant="danger" onClick={e=>logout(e)}>Logout</Button>
                        </div>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </div>
}
export default observer(ClientTopMenu)
