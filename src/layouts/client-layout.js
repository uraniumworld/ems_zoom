import {Container} from "react-bootstrap";

const ClientLayout = ({children})=>{
    return <div>
        <Container>
            {children}
        </Container>
    </div>
}
export default ClientLayout;
