import {Badge, Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import classNames from "classnames";
import {download, uploadWorkshopFile} from "./client-services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTimes, faTimesCircle, faUndo} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";

const ClientWorkshopUploader = ({
                                    title,
                                    StdRegistID,
                                    PracticeID,
                                    o365URL,
                                    currentUserWorkshop,
                                    onLinkChanged,
                                    onLinkBlur,
                                    onUploadSuccess
                                }) => {

    const [newUpload, setNewUpload] = useState(false);

    useEffect(()=>{
        setNewUpload(false);
    },[PracticeID])

    async function uploadFile(e) {
        let file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('StdRegistID', StdRegistID);
        formData.append('PracticeID', PracticeID);
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

    function getCurrentQuestion() {
        return currentUserWorkshop['practice_answer'].find(v => v.PracticeID == PracticeID);
    }

    function removeUpload(val) {
        setNewUpload(val);
    }

    return <Card className={classNames(' mb-4', {
        'bg-primary text-light': PracticeID == '1',
        'bg-success text-light': PracticeID == '2',
        'bg-warning text-dark': PracticeID == '3',
        'bg-danger text-light': PracticeID == '4',
    })}>
        <Card.Header>Your workshop documents {title}</Card.Header>
        <Card.Body>
            {
                (() => {
                    let existed = getCurrentQuestion();
                    if (existed) {
                        return <div>
                            {newUpload ?
                                <>
                                    <span className="mr-2">[ Please upload a new file ]</span>
                                    <Button variant="light" className="mb-2"
                                            onClick={e => removeUpload(false)}><FontAwesomeIcon icon={faUndo}/> Undo</Button>
                                </>
                                :
                                <>
                                    <Button variant='light' className="mb-2" onClick={e => download(existed.RowID)}>
                                        <FontAwesomeIcon style={{fontSize: '20px'}} className='mr-1'
                                                         icon={faCheckCircle}/>
                                        <span>{existed.FileName}</span>
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
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>{title}<span className="ml-2">o365 link</span></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={(o365URL && o365URL[PracticeID]) || ''} type="text" onBlur={e=>onLinkBlur && onLinkBlur(e)} onChange={e=>onLinkChanged && onLinkChanged(e)}></FormControl>
            </InputGroup>
        </Card.Body>
        {(!getCurrentQuestion() || newUpload) &&
        <Card.Footer className="bg-dark text-light">
            <strong className="mr-4">Upload document for score:</strong>
            <input type='file' onChange={e => uploadFile(e)}/>
        </Card.Footer>
        }
    </Card>
}
export default ClientWorkshopUploader
