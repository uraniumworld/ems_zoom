import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDatabase, faFileExcel, faFilePowerpoint, faFileWord} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export function textLimit(text,num=50){
    if(typeof text != 'string')return null;
    if(text.length>num){
        return text.substr(0,50)+'...'
    }
    return text;
}

export function getWorkshopType(typeID,asText=false) {
    if(!asText){
        switch (typeID) {
            case '1':
                return <strong>Microsoft Word</strong>;
            case '2':
                return <strong>Microsoft Excel</strong>;
            case '3':
                return <strong>Microsoft Powerpoint</strong>;
            case '4':
                return <strong>Microsoft Access</strong>;
        }
    }else{
        switch (typeID) {
            case '1':
                return `Microsoft Word`;
            case '2':
                return `Microsoft Excel`;
            case '3':
                return `Microsoft Powerpoint`;
            case '4':
                return `Microsoft Access`;
        }
    }
}

export function getPracticeName(PracticeID, size) {
    switch (PracticeID) {
        case '1':
            return {
                name: 'Microsoft Word',
                icon: <FontAwesomeIcon style={{fontSize: size}} icon={faFileWord}/>,
                color: '#0062cc',
                class: 'primary',
            };
        case '2':
            return {
                name: 'Microsoft Excel',
                icon: <FontAwesomeIcon style={{fontSize: size}} icon={faFileExcel}/>,
                color: '#1e7e34',
                class: 'success',
            };
        case '3':
            return {
                name: 'Microsoft Powerpoint',
                icon: <FontAwesomeIcon style={{fontSize: size}} icon={faFilePowerpoint}/>,
                color: '#d39e00',
                class: 'warning',
            };
        case '4':
            return {
                name: 'Microsoft Access',
                icon: <FontAwesomeIcon style={{fontSize: size}} icon={faDatabase}/>,
                color: '#ea2971',
                class: 'danger',
            };
    }
}

export function ssoExit(forceSEB){
    if(forceSEB.forceSafeExamBrowser){
        document.location.href="https://exit";
    }else{
        document.location.href="http://ems.kku.ac.th/ems_tools/sso-data-checkin.php?action=logout";
    }
}

export function getPlatform(){
    let isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    let isWindows = /(Win)/i.test(navigator.platform);
    if(isApple)return 'mac';
    if(isWindows)return 'win';
    return 'android';
}
