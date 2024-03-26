export class Sex{
    sex;
    constructor(sex){
        this.sex = sex;
    }
    verify(){
        return /[HMO]/.test(this.sex)
    }
}