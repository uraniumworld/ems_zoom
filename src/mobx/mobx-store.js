import {makeAutoObservable} from "mobx";

class MobxStore {
    currentUser = 'xmuz';
    daySchedule = [
        {
            date: '01-01-2020',
            schedules: [
                {
                    id: 1,
                    schedule: 'ems-121212',
                    examDate: '12-12-12',
                    studentCount: 50,
                },
                {
                    id: 2,
                    schedule: 'ems-55555',
                    examDate: '12-12-12',
                    studentCount: 70,
                },
                {
                    id: 3,
                    schedule: 'ems-55556',
                    examDate: '12-12-12',
                    studentCount: 60,
                }
            ]
        },
        {
            date: '01-01-2021',
            schedules: [
                {
                    id: 1,
                    schedule: 'ems-121212',
                    examDate: '12-12-12',
                    studentCount: 50,
                },
                {
                    id: 2,
                    schedule: 'ems-55555',
                    examDate: '12-12-12',
                    studentCount: 70,
                },
                {
                    id: 3,
                    schedule: 'ems-55556',
                    examDate: '12-12-12',
                    studentCount: 60,
                }
            ]
        }
    ];
    students = {
        Group1: [
            {
                code: '602254535-2',
                email: 'ffff@kkumail.com',
                fullname: 'xxxx oooo',
                approved: true,
                logged: true,
            },
            {
                code: '602253343-2',
                email: 'ttttee@kkumail.com',
                fullname: 'ffgf ssss',
                approved: false,
            }
        ],
        Group2: [
            {
                code: '222222-2',
                email: '2222@kkumail.com',
                fullname: '2222 oooo',
                approved: false,
            },
            {
                code: '3333333-2',
                email: '3333@kkumail.com',
                fullname: '3333 ssss',
                approved: false,
            }
        ]
    };

    scheduleMenu=[];

    constructor() {
        makeAutoObservable(this);
    }

    getScheduleYear(year){
        let schedule=[
            {
                date: '01-01-2020',
                schedules: [
                    {
                        id: 1,
                        schedule: 'ems-121212',
                        examDate: '12-12-12',
                        studentCount: 50,
                    },
                    {
                        id: 2,
                        schedule: 'ems-55555',
                        examDate: '12-12-12',
                        studentCount: 70,
                    },
                    {
                        id: 3,
                        schedule: 'ems-55556',
                        examDate: '12-12-12',
                        studentCount: 60,
                    }
                ]
            },
            {
                date: '01-01-2021',
                schedules: [
                    {
                        id: 1,
                        schedule: 'ems-121212',
                        examDate: '12-12-12',
                        studentCount: 50,
                    },
                    {
                        id: 2,
                        schedule: 'ems-55555',
                        examDate: '12-12-12',
                        studentCount: 70,
                    },
                    {
                        id: 3,
                        schedule: 'ems-55556',
                        examDate: '12-12-12',
                        studentCount: 60,
                    }
                ]
            }
        ];
        return schedule;
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