export class Ids{
    id;
    constructor(id){
        this.id = id
    }
    verify(){
        return /^\d+$/.test(this.id)
    }
}