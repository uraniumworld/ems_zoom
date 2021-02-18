import {useEffect, useState} from "react";
import RequiredSEB from "./required-seb";
import {checkSafeExamBrowser} from "../client-components/client-services";
import {Alert, Button, Card, Container} from "react-bootstrap";

const PrepareDevice=()=>{
    const [blockBySafeExamBrowser,setBlockBySafeExamBrowser] = useState();
    useEffect(()=>{
        init();
    },[]);
    async function init(){
        let SEB = await checkSafeExamBrowser();
        if(!SEB)return;
        if(SEB.requiredSafeExamBrowser){
            setBlockBySafeExamBrowser(true);
        }else{
            setBlockBySafeExamBrowser(false);
        }
    }
    if(typeof blockBySafeExamBrowser == 'undefined')return <Alert variant='info'>Loading...</Alert>
    if(blockBySafeExamBrowser){
        return <RequiredSEB configFile="prepareDevice.seb"/>
    }
    return <Container>
        <Card>
            <Card.Header className="bg-success text-white">
                <Card.Text>Prepare your device.</Card.Text>
            </Card.Header>
            <Card.Body>
                <div className="text-center">
                    <Alert variant="success">Congratulations, Your device is ready to start EMS Examination.</Alert>
                    <a href="https://exit" className="btn btn-success btn-lg">Exit, Back to EMS</a>
                </div>
            </Card.Body>
        </Card>
    </Container>
}
export default PrepareDevice;