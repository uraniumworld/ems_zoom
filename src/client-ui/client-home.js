import ClientLayout from "../layouts/client-layout";
import {Button, Card, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSignInAlt, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {StyleSheet,css} from "aphrodite";
import {useHistory} from 'react-router-dom';
import Config from "../config";

const ClientHome = ()=>{
    const history = useHistory();
    return <ClientLayout>
        <Card>
            <Card.Header>KKU EMS Examinations</Card.Header>
            <Card.Body>
                <Row className={css(styles.btnRow)}>
                    <Col md={6}>
                        <a href={`${Config.basePath}/exam`} target="_blank" className="btn btn-primary btn-lg" style={{width:'100%'}}>
                            <FontAwesomeIcon icon={faSignInAlt} size='4x'/>
                            <div>START EXAM</div>
                        </a>
                    </Col>
                    <Col md={6}>
                        <a href="https://exit" className="btn btn-danger btn-lg" style={{width:'100%'}}>
                        <FontAwesomeIcon icon={faSignOutAlt} size='4x'/>
                            <div>QUIT</div>
                        </a>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </ClientLayout>
}
const styles=StyleSheet.create({
    btnRow:{
        ':nth-child(1n) button':{
            margin:'5px'
        }
    }
});
export default ClientHome;
