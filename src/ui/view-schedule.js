import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {Link, useParams} from 'react-router-dom';
import {Button, Card, Col, Row} from "react-bootstrap";

const ViewSchedule = ()=>{
    const {students} = useContext(StateContext);
    const {id,group} = useParams();
    console.log('===', id, group);
    function getGroup(){
        let key = Object.keys(students)[group?group-1:0];
        console.log('===', key);
        return students[key]||[];
    }
    return <>
        <Row>
            {
                Object.keys(students).map(grp=><Col>
                    <Card>
                        <Card.Body>
                            {grp} <Link to={`/schedule/${id}/${grp}`} className="btn btn-primary">View</Link>
                        </Card.Body>
                    </Card>
                </Col>)
            }
        </Row>
    </>
}
export default observer(ViewSchedule);