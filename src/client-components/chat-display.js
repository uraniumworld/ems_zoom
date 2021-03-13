import {useEffect, useRef, useState} from "react";
import {getChatMessage} from "../components/services";
import {Alert, Col, ListGroup, Nav, Row} from "react-bootstrap";
import {css,StyleSheet} from 'aphrodite';
import {toast} from "react-toastify";
import moment from "moment";
import {getServerTime} from "./client-services";
const ChatDisplay = ({SchdID,SchdDetailID,group_name,visible=true})=>{
    const [message,setMessage] = useState();
    const timer = useRef();
    const lastUpdated = useRef(0);

    useEffect(()=>{
        getChat();
        timer.current=setInterval(async ()=>{
             await getChat();
        },5000);
        return ()=>{
            clearInterval(timer.current);
        }
    },[])
    
    useEffect(()=>{
        let lastID = localStorage.getItem('lastMessage');
        if(lastUpdated.current!=0 && Array.isArray(message) && message.length>0){
            getServerTime('moment').then(serverTime=>{
                let pastSec=serverTime.unix()-message[0].created;
                if(message[0] && message[0].id!=lastID && pastSec<600){
                    let msg=message[0].message;
                    let timeText=moment.unix(message[0].created).format('HH:mm:ss')
                    toast.warn(<div>{timeText} - {msg}</div>,{
                        autoClose:false,
                        onClose:()=>{
                            localStorage.setItem('lastMessage',message[0].id);
                        }
                    });
                }
            });
        }
    },[lastUpdated.current])

    async function getChat(){
        let chats = await getChatMessage(SchdID,SchdDetailID,group_name);
        if(Array.isArray(chats) && chats.length>0){
            setMessage(chats);
            lastUpdated.current=chats[chats.length-1].created;
        }else{
            setMessage([]);
        }
    }

    if(!visible)return <></>
    if(!Array.isArray(message))return <Alert variant='info'>Loading...</Alert>
    return <div>
        <ListGroup variant="info" className={css(styles.chat)}>
            {message.map(v=>
                <ListGroup.Item key={v.id}>
                    <Row>
                        <Col><p style={{wordBreak:'break-word'}}>{v.message}</p></Col>
                        <Col xs='auto'><small>{moment.unix(v.created).format('HH:mm:ss')}</small></Col>
                    </Row>
                </ListGroup.Item>
            )}
        </ListGroup>
    </div>
}
const styles = StyleSheet.create({
   chat:{
       color:'black',
       textAlign:'left'
   }
});
export default ChatDisplay;