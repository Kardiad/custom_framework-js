export class Name{
    name;
    constructor(name){
        this.name = name;
    }
    verify(){
        return /[A-Z]{1}\w+[^0-9]/.test(this.name);
    }
}