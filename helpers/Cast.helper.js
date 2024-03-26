export class Cast{
    dataImport;
    constructor(dataImport){
        this.dataImport = dataImport;
    }

    bool(){
        if(typeof this.dataImport == 'string' && this.dataImport == 'false'){
            return false
        }else{
            return true
        }
    }

    int(){
        return parseInt(this.dataImport);
    }

    decimal(){
        return parseFloat(this.dataImport);
    }

    array(){
        if(typeof this.dataImport == 'object'){
            return {
                keys : Object.keys(this.dataImport),
                values: Object.values(this.dataImport)
            };
        }
        if(typeof this.dataImport == 'string'){
            return this.dataImport.split('');
        }    
    }
}