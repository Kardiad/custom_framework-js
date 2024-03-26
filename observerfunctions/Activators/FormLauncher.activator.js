import { Ajax } from "../../services/Ajax.services.js"

export class FormLauncher{
    form
    htmlobject
    constructor(form, htmlobject){
        this.form = form
        this.htmlobject = htmlobject.dataset
        this.behaviour = htmlobject.dataset.formbehaviour
    }
    
    fire(observer, oconfig, components){
        if(this._validate()){
            const ajax = new Ajax(
                this.htmlobject.url,
                this.htmlobject.method,
                JSON.stringify(this.form.data),
                {cosa:null}
            ).fetchResult((res)=>{
                console.log(res)
                if(res.status == 200 && this.behaviour!='{{BEHAVIOUR}}'){
                    this._addTo({
                        name: 'EXP.322.322',
                        title: 'Explora el contenido del expediente EXP.322.322',
                        id: 3
                    }, observer, oconfig, components)
                }
            });
        }
    }

    _findComponent(components, id){
        return components[id].component;
    }

    _addTo(object, observer, oconfig, components){
        const idComponent = this.behaviour.split('-')[1];
        const action = this.behaviour.split('-')[0];
        const component = this._findComponent(components, idComponent);
        if(action == 'add'){
            component.reload(object, observer, oconfig, action);
        }
    }

    _validate(){
        const sendTest = Object.values(this.form.sendable)
        return !sendTest.some((e)=>e==false);
    }
}