export class Surname{
    surname;
    constructor(surname){
        this.surname = surname
    }
    verify(){
        return /[A-Z]{1}\w+[^0-9]/.test(this.surname)
    }
}