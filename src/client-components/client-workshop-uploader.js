import {Badge, Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import classNames from "classnames";
import {download, updateO365URL, uploadWorkshopFile} from "./client-services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTimes, faTimesCircle, faUndo} from "@fortawesome/free-solid-svg-icons";
import React, {createRef, useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {getStudentLang, getWorkshopType} from "./client-tools";
import student from "../client-ui/student";

const ClientWorkshopUploader = ({
                                    student,
                                    userAnswer,
                                    PracticeID,
                                    StdRegistID,
                                    onLinkUpdated,
                                    onUploadSuccess
                                }) => {

    const [newUpload, setNewUpload] = useState(false);
    const [o365URL,setO365URL] = useState('');
    const lastO365Updated = useRef({});

    useEffect(()=>{
        if(userAnswer){
            lastO365Updated.current[PracticeID]=userAnswer.url;
            setO365URL(userAnswer.url);
        }else{
            lastO365Updated.current[PracticeID]='';
            setO365URL('');
        }
        setNewUpload(false);
    },[PracticeID]);

    async function uploadFile(e) {
        let file = e.target.files[0];
        if (!file) return;
        if(file.size>20*1048576){
            toast.error(`Max upload size is 20 MB`);
            return;
        }
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
                if(uploaded.error=='Invalid document file'){
                    let lang = getStudentLang(student);
                    if(lang=='th'){
                        toast.error('ไฟล์กระดาษคำตอบไม่ถูกต้อง ผู้สอบต้องใช้ไฟล์กระดาษคำตอบของตนเองเท่านั้น (ระบบได้ส่งข้อความไปยังผู้คุมสอบแล้ว)',{autoClose:15000});
                    }else{
                        toast.error('The answer sheet file is invalid. You must use your own answer sheet file only. (This notify has been sent to the examiner.)',{autoClose:15000});
                    }
                }else{
                    toast.error(uploaded.error);
                }
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
        switch (PracticeID){
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
            setO365URL(lastO365Updated.current[PracticeID]);
            let name=getWorkshopType(PracticeID,true);
            toast.error(`No "${name}" of KKU Office 365 URL.`);
            return;
        }
        if(lastO365Updated.current[PracticeID]!=o365URL){
            let result = await updateO365URL(StdRegistID,PracticeID,o365URL);
            if(!result.error){
                onLinkUpdated({
                    ...result,
                    PracticeID,
                    StdRegistID,
                    o365URL
                });
                lastO365Updated.current[PracticeID]=o365URL;
            }
        }
    }

    function onO365Blur(e){
       _updateO365URL();
    }

    if(!PracticeID)return <div>Loading...</div>
    return <Card className={classNames(' mb-4', {
        'bg-primary text-light': PracticeID == '1',
        'bg-success text-light': PracticeID == '2',
        'bg-warning text-dark': PracticeID == '3',
        'bg-danger text-light': PracticeID == '4',
    })}>
        <Card.Header>Your workshop documents {getWorkshopType(PracticeID)}</Card.Header>
        <Card.Body>
            {
                (() => {
                    if (userAnswer) {
                        return <div>
                            <div variant="primary" className="font-weight-bold mr-2">1. Upload file. ({'max size 20 MB'})</div>
                            {newUpload ?
                                <>
                                    <span className="mr-2">[ Please upload a new file ]</span>
                                    <Button variant="light" className="mb-2"
                                            onClick={e => removeUpload(false)}><FontAwesomeIcon icon={faUndo}/> Undo</Button>
                                </>
                                :
                                <>
                                    <Button variant='light' className="mb-2" onClick={e => download(userAnswer.RowID)}>
                                        <FontAwesomeIcon style={{fontSize: '20px'}} className='mr-1'
                                                         icon={faCheckCircle}/>
                                        <span>{userAnswer.FileName}</span>
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
            {userAnswer &&
            <>
                {/*<div className="font-weight-bold">2. Share KKU Office 365 public link</div>*/}
                {/*<InputGroup>*/}
                {/*    <InputGroup.Prepend>*/}
                {/*        <InputGroup.Text>{getWorkshopType(PracticeID)}<span className="ml-2">o365 link</span></InputGroup.Text>*/}
                {/*    </InputGroup.Prepend>*/}
                {/*    <FormControl disabled={!!!userAnswer} value={o365URL||''} type="text" onBlur={e=>onO365Blur(e)} onChange={e=>setO365URL(e.target.value)} onKeyUp={e=>{*/}
                {/*        if(e.keyCode==13)_updateO365URL();*/}
                {/*    }}*/}
                {/*                 placeholder="Start with -> https://kkumail-my.sharepoint.com"*/}
                {/*    ></FormControl>*/}
                {/*</InputGroup>*/}
            </>
            }
        </Card.Body>
        {(!userAnswer || newUpload) &&
        <Card.Footer className="bg-dark text-light">
            <strong className="mr-4">Upload document for score:</strong>
            <input type='file' onChange={e => uploadFile(e)}/>
        </Card.Footer>
        }
    </Card>
}
export default ClientWorkshopUploader
