import Schedule from "../components/schedule";
import {Form} from "react-bootstrap";
import {useState} from "react";

const currentDate=new Date();
const currentYear=currentDate.getFullYear();
const Home = ()=>{
    const [selectedDate,setSelectedDate]=useState(currentYear);
    return <div>
        <Form.Group>
            <Form.Label>เลือกรอบสอบ ประจำปี</Form.Label>
            <Form.Control as="select" value={selectedDate} onChange={e=>{
                setSelectedDate(e.target.value)
            }}>
                {
                    [...new Array(5)].map((v,i)=>{
                        let value = currentYear-i;
                        return <option key={value} value={value}>{value}</option>
                    })
                }
            </Form.Control>
        </Form.Group>
        <Schedule year={selectedDate}/>
    </div>
}
export default Home;