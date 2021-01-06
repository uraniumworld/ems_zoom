import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useContext} from "react";
import StateContext from "../mobx/global-context";
import {Button, Table} from "react-bootstrap";

const ViewStudent = () => {
    const {students} = useContext(StateContext);
    const {id, group} = useParams();
    return <div>
        {
            students[group]
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
                        {
                            students[group].map((std,i) =>
                                <tr className={std.approved?'bg-success text-white':''}>
                                    <td>{i+1}</td>
                                    <td>{std.code}</td>
                                    <td>{std.fullname}</td>
                                    <td>{std.email}</td>
                                    <td>
                                        {std.approved
                                            ?<Button variant="danger">Reject</Button>
                                            :<Button variant="success">Approve</Button>
                                        }
                                    </td>
                                </tr>
                            )
                        }
                    </Table>
                </>
                : <div>No group existed.</div>
        }
    </div>
}
export default observer(ViewStudent);