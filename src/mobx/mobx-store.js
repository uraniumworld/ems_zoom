import {makeAutoObservable} from "mobx";

class MobxStore {
    currentUser = void 0;
    currentStudent = void 0;

    auth = void 0;
    forceSEB = void 0;

    scheduleMenu=[];

    studentPicture={};

    constructor() {
        makeAutoObservable(this);
    }

    setStudentPicture(Username,student_image_data){
        this.studentPicture={
            ...this.studentPicture,
            [Username]:student_image_data
        }
    }

    setForceSEB(seb){
        this.forceSEB=seb;
    }

    setAuth(auth){
        this.auth=auth;
    }

    setUser(user) {
        this.currentUser = user;
    }

    setStudent(student){
        this.currentStudent=student;
    }

    studentApprove(code) {
        let student = this.findStudent(code);
        if (student) {
            student.approved = true;
        }
    }

    studentReject(code) {
        let student = this.findStudent(code);
        if (student) {
            student.approved = false;
        }
    }
    findStudent(code) {
        let student = void 0;
        Object.keys(this.students).map(group => {
            if (!student) student = this.students[group].find(std => std.code == code);
        })
        return student;
    }
}



export default MobxStore;
