import {Badge, Button, Nav, Navbar} from "react-bootstrap";
import React, {useContext} from "react";
import {confirmBox} from "../components/services";
import {studentLogout} from "./client-services";
import StateContext from "../mobx/global-context";
import {observer} from "mobx-react";
import {StyleSheet,css} from "aphrodite";

const ClientTopMenu = ({scheduleInfo,type,student,confirmSubmit})=>{
    const state = useContext(StateContext);
    function logout(){
        confirmBox('Logout','Do you want to logout?',async (e)=>{
            await studentLogout();
            state.setStudent(null);
        })
    }
    return <div className={'exam-top-menu '+css(type=='workshop'?styles.workshop:styles.theory)}>
        <Navbar bg="light" expand="md">
            <Navbar.Brand>EMS - {type=='theory'?'Theory':'Workshop'}</Navbar.Brand>
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
                                <span className="mr-2">{student.studentID}</span>
                                <span className="mr-2">|</span>
                                <span>{student.fname} {student.lname}</span>
                            </Badge>
                            <Button variant="danger" onClick={e=>logout(e)}>Logout</Button>
                        </div>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </div>
}
const styles=StyleSheet.create({
    theory:{
        left:'300px',
        width: 'calc(100% - 300px) !important'
    },
    workshop:{
        left:'100px',
        width: 'calc(100% - 100px) !important'
    }
});
export default observer(ClientTopMenu)
