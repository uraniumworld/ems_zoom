import {useEffect, useState} from "react";
import {checkClient} from "./client-services";
import {Card, Col, Container, Row} from "react-bootstrap";

let last_update = 0;
let last_update_url = 0;

const CheckInProcess = ({StdRegistID, onApproved, onDenied, children}) => {

    const [approve, setApprove] = useState(void 0);
    const [meetUrl, setMeetUrl] = useState(null);

    useEffect(() => {
        // document.body.style.paddingLeft='0px';
        checker();
        setInterval(()=>checker(),5000);
    }, []);

    function checker() {
        checkClient(StdRegistID).then(data => {
            if (last_update != data.last_update || last_update_url != data.last_update_url) {
                if (data.check_in_status == "1") {
                    setApprove(true);
                    onApproved();
                } else {
                    if (data.meet_url) {
                        let url = data.meet_url.match(/^http/) ? data.meet_url : `https://${data.meet_url}`;
                        setMeetUrl(url);
                    }else{
                        setMeetUrl(null);
                    }
                    setApprove(false);
                    onDenied();
                }
                last_update = data.last_update;
                last_update_url = data.last_update_url;
            }
        });
    }

    if (typeof approve == 'undefined') return <div>Loading...</div>;
    if (!approve) {
        return <Container>
            <Row>
                <Col>
                    <Card className="mt-4 bg-dark text-white">
                        <Card.Header>EMS Check-In</Card.Header>
                        <Card.Body>
                            {
                                !meetUrl
                                    ?
                                    <>
                                        <span>Please <span className="badge badge-info">check-in</span> before start</span>
                                        <a className="btn btn-primary btn-sm ml-2 disabled">Waiting meet...</a>
                                    </>
                                    :
                                    <>
                                        <span>Please <span className="badge badge-info">check-in</span> before start</span>
                                        <a className="btn btn-primary btn-sm ml-2" target='_blank' href={meetUrl}>Click Here</a>
                                    </>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    }
    return children;
}
export default CheckInProcess;
