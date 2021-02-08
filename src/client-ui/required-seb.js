import {Card, Container, Image} from "react-bootstrap";
import Config from "../config";

const RequiredSEB = ()=>{
    return <Container>
        <Card className="mt-4">
            <Card.Header>KKU EMS Examination is required "Safe Exam Browser" to start, and take a 4 step.</Card.Header>
            <Card.Body>
                <h1 className="mb-4">Please download <Image src={`${Config.basePath}/images/seb_icon.png`} fluid/> Safe Exam Browser first.</h1>
                <div className="mb-2">Step 1. <a className="btn btn-primary btn-lg" target="_blank" href="https://safeexambrowser.org/download_en.html">Download "Safe Exam Browser"</a></div>
                <div className="mb-2">Step 2.
                    <div><strong>Install Safe Exam Browser</strong></div>
                    <Image src={`${Config.basePath}/images/seb_install.png`} fluid/>
                </div>
                <div className="mb-2">Step 3. <a className="btn btn-info btn-lg" download target="_blank" href={`${Config.basePath}/startEMS.seb`}>Download "startEMS.seb"</a></div>
                <div className="mb-2">
                    Step 4. <strong>Double click downloaded file named "startEMS.seb"</strong>
                </div>
            </Card.Body>
            <Card.Footer>
                <div className="text-right">@LTIC.KKU.AC.TH</div>
            </Card.Footer>
        </Card>
    </Container>
}
export default RequiredSEB;