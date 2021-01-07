import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useContext, useEffect} from "react";
import StateContext from "../mobx/global-context";
import {Button, Table} from "react-bootstrap";

const ViewStudent = () => {
    const mobx = useContext(StateContext);
    const {id, group} = useParams();

    function approve(std){
        mobx.studentApprove(std.code);
    }
    function reject(std){
        mobx.studentReject(std.code);
    }
    return <div>
        {
            mobx.students[group]
                ? <>
                    ViewStudent {group}
                    <Table>
                        <thead>
                        <tr>
                            <td>#</td>
                            <td>Code</td>
                            <td>Fullname</td>
                            <td>Email</td>
                            <td>Check In</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            mobx.students[group].map((std,i) =>
                                <tr key={std.code} className={std.approved?'bg-success text-white':''}>
                                    <td>{i+1}</td>
                                    <td>{std.code} {std.approved && <small>(approved)</small>}</td>
                                    <td>{std.fullname}</td>
                                    <td>{std.email}</td>
                                    <td>
                                        {std.approved
                                            ?<Button variant="danger" onClick={reject.bind(this,std)}>Reject</Button>
                                            :<Button variant="success" onClick={approve.bind(this,std)}>Approve</Button>
                                        }
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                </>
                : <div>No group existed.</div>
        }
    </div>
}
export default observer(ViewStudent);