import { Datatable } from "./components/datatable.component.js";
import { Form } from "./components/form.component.js";
import { Modal } from "./components/modal.component.js";
import { Tab } from "./components/tab.component.js";


/**
 * Esta clase va a ser una clase generica para todas las que estén dentro de components.
 */
export class Componentizable{
    _type;
    _options;
    _class;
    constructor(type, options, target, observer, oconfig){
        this._type = type;
        this._options = options;
        this.setClass(target, observer, oconfig);
    }

    //setea las clases con los parámetros opcionales
    async setClass(target, observer, oconfig){
        //cambiar la lógica a ver como puedo llamar a ficheros o clases de manera automatizada
        switch(this._type){
            case 'form':
                this._class = new Form(this._options, target, observer, oconfig);
            break;
            case 'modal':
                this._class = new Modal(this._options, target, observer, oconfig);
            break;
            case 'tab':
                this._class = new Tab(this._options, target, observer, oconfig);
            break;
            case 'table':
                this._class = new Datatable(this._options, target, observer, oconfig);
                break;
        }
        
    }

    get(){
        return this._class;
    }
}