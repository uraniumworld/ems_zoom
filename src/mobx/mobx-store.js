import {makeAutoObservable} from "mobx";

class MobxStore {
    currentUser=void 0;
    constructor() {
        makeAutoObservable(this);
    }
    setUser(user){
        this.currentUser=user;
    }
}
export default MobxStore;