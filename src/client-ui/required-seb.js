import {Card, Col, Container, Image, Row} from "react-bootstrap";
import Config from "../config";
import {useEffect, useState} from "react";
import LangSwitcher from "../client-components/lang-switcher";

const RequiredSEB = ({configFile})=>{
    const [lang,setLang] = useState("TH");
    useEffect(()=>{
        document.body.style.backgroundColor = "rgb(76, 76, 78)";
    },[])
    return <Container>
        <Card className="mt-4">
            <Card.Header>
                {lang=='TH'?
                    <>ขั้นตอนการสอบ EMS จำเป็นต้องใช้โปรแกรม "Safe Exam Browser" เพื่อเริ่มสอบ โดยมีขั้นตอนดังต่อไปนี้</>
                    :
                    <>KKU EMS Examination is required "Safe Exam Browser" to start, and take a 7 step.</>
                }
                <LangSwitcher lang={lang} className="ml-2" onLangSwitch={lang=>setLang(lang)}/>
            </Card.Header>
            <Card.Body>
                {lang=='TH'?
                    <>
                        <h1 className="mb-4">
                            ผู้สอบจำเป็นต้องดาวน์โหลดโปรแกรม <Image src={`${Config.basePath}/images/seb_icon.png`} fluid/> Safe Exam Browser
                        </h1>
                        <div className="mb-2">ขั้นตอนที่ 1. <a className="btn btn-primary btn-lg" target="_blank" href="https://safeexambrowser.org/download_en.html">ดาวน์โหลดโปรแกรม "Safe Exam Browser" (คลิก)</a>
                            <span className="ml-2">(Windows, MacOS, IOS, <span style={{color:'red'}}>Android ไม่รองรับ</span>)</span>
                        </div>
                        <div className="mb-2">ขั้นตอนที่ 2.
                            <div><strong>ติดตั้งโปรแกรม Safe Exam Browser ลงในอุปกรณ์</strong></div>
                            <Image src={`${Config.basePath}/images/seb_install.png`} fluid/>
                        </div>
                        <div className="mb-2">ขั้นตอนที่ 3. <a className="btn btn-info btn-lg" download target="_blank" href={`${Config.basePath}/${configFile}`}>ดาวน์โหลดไฟล์ "{configFile}" (คลิก)</a></div>
                        <div className="mb-2">
                            ขั้นตอนที่ 4. <strong>หลังจากดาวน์โหลดไฟล์มาแล้วให้ผู้สอบเปิดไฟล์ "{configFile}" เพื่อเริ่มทำข้อสอบ</strong>
                        </div>
                        <div className="mb-2">
                            ขั้นตอนที่ 5. <strong>ระบบจะเปิดโปรแกรม Safe Exam Browser ขึ้นมาโดยอัตโนมัติ และ เริ่มทำการสอบได้</strong>
                        </div>
                        <div className="mb-2">
                            ขั้นตอนที่ 6. <strong>กรณีไม่สามารถเริ่มโปรแกรมได้ ให้ลองติดตั้งโปรแกรม Safe Exam Browser ใน <a target="_blank" href="https://safeexambrowser.org/download_en.html">เวอร์ชั่น 2.4.x</a> </strong>
                        </div>
                        <div className="mb-2" style={{color:'red'}}>
                            ขั้นตอนที่ 7. <strong>หากลองทุกวิธีการแล้วยังไม่สามารถเข้าโปรแกรม Safe Exam Browser
                            ให้ลองหาอุปกรณ์ใหม่ หรือ แจ้งความจำนงขอใช้เครื่องคอมพิวเตอร์ที่ ศูนย์นวัตกรรมการเรียนการสอนในการสอบที่
                            <a href="https://kku.world/6p7ss" target='_blank' className="ml-1" style={{color:"green"}}>แบบฟอร์มขอใช้เครื่องของศูนย์ในการสอบ (คลิก)</a> แจ้งชื่อ-นามสกุล รหัสนักศึกษา และ รอบที่ต้องการข้อใช้เครื่องในการสอบ
                        </strong>
                        </div>
                    </>
                    :
                    <>
                        <h1 className="mb-4">
                            Examiner must install <Image src={`${Config.basePath}/images/seb_icon.png`} fluid/> Safe Exam Browser first.
                        </h1>
                        <div className="mb-2">Step 1. <a className="btn btn-primary btn-lg" target="_blank" href="https://safeexambrowser.org/download_en.html">Download "Safe Exam Browser" (Click)</a>
                            <span className="ml-2">(Windows, MacOS, IOS, <span style={{color:'red'}}>Android not support.</span>)</span>
                        </div>
                        <div className="mb-2">Step 2.
                            <div><strong>Install Safe Exam Browser into your device.</strong></div>
                            <Image src={`${Config.basePath}/images/seb_install.png`} fluid/>
                        </div>
                        <div className="mb-2">Step 3. <a className="btn btn-info btn-lg" download target="_blank" href={`${Config.basePath}/${configFile}`}>Download file "{configFile}" (Click)</a></div>
                        <div className="mb-2">
                            Step 4. <strong>Open file "{configFile}" for start exam.</strong>
                        </div>
                        <div className="mb-2">
                            Step 5. <strong>Exam will be startup.</strong>
                        </div>
                        <div className="mb-2">
                            Step 6. <strong>In case of unable to start the program Try to install the Safe Exam Browser with <a target="_blank" href="https://safeexambrowser.org/download_en.html">Lower version</a> and try again.</strong>
                        </div>
                        <div className="mb-2" style={{color:'red'}}>
                            Step 7. <strong>If you have tried all methods and still cannot access the Safe Exam Browser program, try finding a new device or requesting to use the computer at Learning and Teaching Innovation Center
                            <a href="https://kku.world/6p7ss" target='_blank' className="ml-1" style={{color:"green"}}>Request form (Click)</a> Inform the first name and surname, student's code, and schedule time that you want to use the computer for the exam.
                        </strong>
                        </div>
                    </>
                }
            </Card.Body>
            <Card.Footer>
                <div className="text-right">@LTIC.KKU.AC.TH</div>
            </Card.Footer>
        </Card>
    </Container>
}
export default RequiredSEB;