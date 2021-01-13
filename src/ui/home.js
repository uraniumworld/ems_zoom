import Schedule from "../components/schedule";
import {Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";

const currentDate=new Date();
const currentMonth=currentDate.getMonth();
const currentYear=currentDate.getFullYear();
const Home = ()=>{
    const [selectedMonth,setSelectedMonth]=useState(currentMonth+1);
    const [selectedYear,setSelectedYear]=useState(currentYear);


    return <div>
        <Row>
            <Col md={6}>
                <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Control as="select" value={selectedMonth} onChange={e=>{
                        setSelectedMonth(e.target.value)
                    }}>
                        {
                            [...new Array(31)].map((v,i)=>{
                                let value = i+1;
                                return <option key={value} value={value}>{value}</option>
                            })
                        }
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Control as="select" value={selectedYear} onChange={e=>{
                        setSelectedYear(e.target.value)
                    }}>
                        {
                            [...new Array(5)].map((v,i)=>{
                                let value = currentYear-i;
                                return <option key={value} value={value}>{value}</option>
                            })
                        }
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>
        <Schedule month={selectedMonth} year={selectedYear}/>
    </div>
}
export default Home;
