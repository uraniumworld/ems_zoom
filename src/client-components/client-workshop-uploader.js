import {Badge, Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import classNames from "classnames";
import {download, updateO365URL, uploadWorkshopFile} from "./client-services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTimes, faTimesCircle, faUndo} from "@fortawesome/free-solid-svg-icons";
import React, {createRef, useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {getWorkshopType} from "./client-tools";

const ClientWorkshopUploader = ({
                                    workshop,
                                    StdRegistID,
                                    onLinkUpdated,
                                    onUploadSuccess
                                }) => {

    const [newUpload, setNewUpload] = useState(false);
    const [o365URL,setO365URL] = useState('');
    const lastO365Updated = useRef({});

    useEffect(()=>{
        lastO365Updated.current[workshop.PracticeID]=workshop.url;
        setO365URL(workshop.url);
        setNewUpload(false);
    },[workshop]);

    async function uploadFile(e) {
        let file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('StdRegistID', StdRegistID);
        formData.append('PracticeID', workshop.PracticeID);
        let uploaded = await uploadWorkshopFile(formData);
        if (uploaded) {
            if (!uploaded.error) {
                toast.success('Upload completed.');
                onUploadSuccess(uploaded);
                setNewUpload(false);
            } else {
                toast.error(uploaded.error);
            }
            e.target.value = null;
        } else {
            toast.error(`Error while uploading the file named ${file.name}.`);
        }
    }

    function removeUpload(val) {
        setNewUpload(val);
    }

    async function _updateO365URL(){
        let type;
        switch (workshop.PracticeID){
            case '1':
                type='w';
                break;
            case '2':
                type='x'
                break;
            case '3':
                type='p'
                break;
            case '4':
                type='a'
                break;
        }
        let regExp=new RegExp(`^https:\/\/kkumail\-my\.sharepoint\.com\/:${type}:\/`,'i')
        if(typeof o365URL== 'string' && !o365URL.match(regExp)
        && o365URL!=''){
            setO365URL(lastO365Updated.current[workshop.PracticeID]);
            let name=getWorkshopType(workshop.PracticeID,true);
            toast.error(`No "${name}" of KKU Office 365 URL.`);
            return;
        }
        if(lastO365Updated.current[workshop.PracticeID]!=o365URL){
            let result = await updateO365URL(StdRegistID,workshop.PracticeID,o365URL);
            if(!result.error){
                onLinkUpdated(result);
                lastO365Updated.current[workshop.PracticeID]=o365URL;
            }
        }
    }

    function onO365Blur(e){
       _updateO365URL();
    }

    if(!workshop)return <div>Loading...</div>
    return <Card className={classNames(' mb-4', {
        'bg-primary text-light': workshop.PracticeID == '1',
        'bg-success text-light': workshop.PracticeID == '2',
        'bg-warning text-dark': workshop.PracticeID == '3',
        'bg-danger text-light': workshop.PracticeID == '4',
    })}>
        <Card.Header>Your workshop documents {getWorkshopType(workshop.PracticeID)}</Card.Header>
        <Card.Body>
            {
                (() => {
                    if (workshop) {
                        return <div>
                            <div variant="primary" className="font-weight-bold mr-2">1. Upload file.</div>
                            {newUpload ?
                                <>
                                    <span className="mr-2">[ Please upload a new file ]</span>
                                    <Button variant="light" className="mb-2"
                                            onClick={e => removeUpload(false)}><FontAwesomeIcon icon={faUndo}/> Undo</Button>
                                </>
                                :
                                <>
                                    <Button variant='light' className="mb-2" onClick={e => download(workshop.RowID)}>
                                        <FontAwesomeIcon style={{fontSize: '20px'}} className='mr-1'
                                                         icon={faCheckCircle}/>
                                        <span>{workshop.FileName}</span>
                                    </Button>
                                    <Button variant="danger" className="mb-2 ml-2"
                                            onClick={e => removeUpload(true)}><FontAwesomeIcon icon={faTimes}/> Remove</Button>
                                </>
                            }

                        </div>
                    } else {
                        return <div className="mb-2">
                            <div>After you finish please upload your file and share o365 url here.</div>
                            <Badge variant='danger'>- No attached file -</Badge>
                        </div>
                    }
                })()
            }
            <div className="font-weight-bold">2. Shared Office 365 link</div>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>{getWorkshopType(workshop.PracticeID)}<span className="ml-2">o365 link</span></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={o365URL||''} type="text" onBlur={e=>onO365Blur(e)} onChange={e=>setO365URL(e.target.value)} onKeyUp={e=>{
                    if(e.keyCode==13)_updateO365URL();
                }}></FormControl>
            </InputGroup>
        </Card.Body>
        {(!workshop || newUpload) &&
        <Card.Footer className="bg-dark text-light">
            <strong className="mr-4">Upload document for score:</strong>
            <input type='file' onChange={e => uploadFile(e)}/>
        </Card.Footer>
        }
    </Card>
}
export default ClientWorkshopUploader
