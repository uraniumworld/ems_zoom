import {makeAutoObservable} from "mobx";

class MobxStore {
    currentUser = void 0;

    scheduleMenu=[];

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user) {
        this.currentUser = user;
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
