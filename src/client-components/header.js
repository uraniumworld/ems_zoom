import { StyleSheet, css } from 'aphrodite';
import {Button, Col, Image, Row} from "react-bootstrap";
import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {studentLogout} from "./client-services";
import {ssoExit} from "./client-tools";
const Header = ()=>{
    const state = useContext(StateContext);
    return <div className={css(styles.main)}>
        <Row>
           <Col className="col-12 col-lg-auto text-center">
               <Image className="mt-2 ml-md-2" fluid src="https://ems.kku.ac.th/public/assets/img/logo.png"/>
           </Col>
           <Col className="text-center text-lg-left">
               <h1 className={css(styles.text1)}>EMS Examination</h1>
           </Col>
            <Col className="col-12 col-lg-auto text-center text-lg-right">
                <div className={'mb-2 mb-lg-0 '+css(styles.logout)}>
                    <small className="mr-2">
                        {state.currentStudent.studentID} / {state.currentStudent.fname} {state.currentStudent.lname}
                    </small>
                    <Button variant="danger" onClick={e=>{
                         studentLogout().then(()=>{
                             if(state.auth && state.auth.authType=='sso'){
                                ssoExit(state.forceSEB);
                             }else{
                                 state.setStudent(null);
                             }
                         })
                    }}>Logout</Button>
                </div>
            </Col>
        </Row>
    </div>
}
const styles = StyleSheet.create({
    main:{
        minHeight:'100px',
        background:'#ff9b4e',
    },
    text1:{
      marginTop:'20px',
      letterSpacing:'15px'
    },
    logout:{
        marginTop: '30px',
        marginRight: '20px',
    }
})
export default observer(Header);
