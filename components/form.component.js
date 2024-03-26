import { Ajax } from '../services/Ajax.services.js';
import { Component } from './main.component.js'
export class Form extends Component{
    
    url;
    options;
    names;
    labels;
    values;
    title;
    events;
    idform;
    action;
    method;
    formtype;
    datatypeforms;
    dataForm;
    source;
    id;
    customHeaders;
    customBody;
    selectOptions;
    baseSender = {sendable:{}, data:{}}
    fireElement;
    opt = `
    <option value="{{VALUE}}">{{NAME}}</option>
    `;
    selectTemplate = `
    <div class="d-flex p-1">
    <p class="my-auto col-4">{{LABELS}}</p>
    <select class="my-auto text-start col-8" 
            data-valid = ""
            data-form="{{FORMID}}" 
            name="{{NAMES}}" 
            data-get="{{NAMES}}" 
            value="{{VALUES}}" 
            {{ATTRIBUTES}}>
        {{OPTIONS}}
    </select>
    </div>
    <hr class="my-1">
    `;
    baseField = `
    <div class="d-flex p-1">
        <p class="my-auto col-4">{{LABELS}}</p>
        <input type="{{TYPE}}" class="my-auto text-start col-8" 
            data-valid = ""
            data-form="{{FORMID}}" 
            name="{{NAMES}}" 
            data-get="{{NAMES}}" 
            value="{{VALUES}}" 
            {{ATTRIBUTES}}>
    </div>
    <hr class="my-1">
    `;
    baseTemplate = `
    <p class="text-center border bg-secondary">{{TITLE}}</p>
    `;
    launcher = `
    <div class="d-flex p-1">
        <button class="btn btn-warning col-6 m-auto" 
            data-formbehaviour="{{BEHAVIOUR}}"
            data-fire="{{IDFORM}}" 
            data-url="{{URLSEND}}" 
            data-method="{{METHOD}}" 
            data-typeform="{{DATATYPEFORMS}}" 
            >Enviar</button>
    </div>
    `;

    constructor(options, target, observer, observerConf){
        super();
        if(options){
            this.options = options;
            this.target = target;
            //luego por operatividad habría que guardar esto en variables, pero de momento el options es general
            this._deserialization();
            this._loadFunctions();
            new Promise(this._generateHtml)
            .then((res) => {
                    this.target.innerHTML = res;
                    this._init();
                    this._addEvents(observer, observerConf);
                })
                .catch((rej)=>console.warn(rej))
        }
    }

    _deserialization(){
        this.names = this.options.names
        this.labels = this.options.labels
        this.values = this.options.values
        this.title = this.options.title
        this.action = this.options.action
        this.method = this.options.method
        this.formtype = this.options.type
        this.source = this.options.resources
        this.customHeaders = this.options.customHeaders
        this.customBody = this.options.customBody
        this.selectOptions = this.options.selectFields
        this.formaction = this.options.formaction
        this.id = this.options.id
    }

    _loadFunctions(){
        //Aquí ira la lógica de programación con js
        const http_query = window.location.search.replace('?', '').split('&');
        let object_http_query = {};
        for(let i in http_query){
            const base = http_query[i].split('=');
            object_http_query[base[0]] = base[1];
        }
        this.url = object_http_query;
    }

    _init(){
        if(this.url.action === 'show'){
            this.baseField = this.baseField.replace('{{ATTRIBUTES}}', 'disabled = "true"')
                                            .replace('data-valid = ""', 'data-valid="true"');
        }else{
            this.baseField = this.baseField.replace('{{ATTRIBUTES}}', '{{POTENTIAL}}');
        }
        this.dataForm = [...document.querySelectorAll(`[data-form="${this.id}"]`)];
    }


    _addEvents(observer, observerConf){
        //coger todos los elementos con data-get para preparar el formulario en caso de que quiera que se cambien los datos al escribirlos
        //o al menos para que el observer tenga una forma de prevalidar los datos antes de mandarlos
        for(let getter of this.dataForm){
            if(getter.getAttribute('type')=='text' || getter.getAttribute('type')=='number'){
                getter.addEventListener('keyup', (e)=>{
                   this._setStatus(getter, e);
                })
            }
            if(getter.tagName == 'SELECT'){
                getter.addEventListener('change', (ev)=>{
                    this._setStatus(getter, ev)
                })
            }
            //AL DAR DE ALTA A ESTO, PUEDO VALIDAR LOS DIVERSOS PARÁMETROS SI SON BUENOS O NO
            //DE MANERA DINÁMICA, GENERANDO UN MÉTODO ÚNICO Y GENERAL PARA EL OBSERVER
            observer.observe(getter, observerConf)
        }
        //EN EL OBSERVER HABRÍA QUE AÑADIR SI EL CAMPO ES VÁLIDO O NO CON UN VALIDATOR
        this._init();
        this.fireElement.addEventListener('mouseup', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            //construcción json envío
            this.fireElement.dataset.datafire = this;
        })
    }

    _setStatus(getter, e){
        getter.setAttribute('value',e.target.value);
        getter.setAttribute('data-valid', '');
        this.baseSender.sendable[getter.getAttribute('name')] = false;
        getter.setAttribute('data-object', btoa(JSON.stringify(this)))
        getter.classList.remove('border-success');
        getter.classList.add('border-danger');
        this.baseSender.data[getter.getAttribute('name')] = e.target.value
        this.fireElement.dataset.formstatus = btoa(JSON.stringify(this.baseSender))
    }

    _init(){
        this.dataForm = [...document.querySelectorAll(`[data-form="${this.id}"]`)];
        for(let item of this.dataForm){
            this.baseSender.data[item.getAttribute('name')] = item.getAttribute('value');
        }
        this.fireElement = document.querySelector(`[data-fire="${this.id}"]`);
        this.fireElement.dataset.formstatus = btoa(JSON.stringify(this.baseSender));
    }

    _generateHtml = async (res, rej)=>{
        let templateHtml = [];
        //let fields = this.baseField.match(/\{\{\w+\}\}/g)
        this.baseField = this.baseField.replace('{{FORMID}}',this.id)
        for(let i in this.names){
            let replace = '';
            //en algún momento habrá que meter un cálculo de este if
            //REHACER EN TORNO AL TIPO DE INPUT QUE VIENE
            let template = await this._getCorrectTemplate(this.formtype[i], this.names[i]);
            if(this.names[i] == 'n_soc' || this.names[i] == 'Id'){
                replace = template.replace('{{POTENTIAL}}', 'disabled = "true"')
                    .replace('{{LABELS}}', this.labels[i])
                    .replaceAll('{{NAMES}}', this.names[i])
                    .replace('{{VALUES}}', this.values[i])
                    .replace('{{TYPE}}', this.formtype[i]);            
            }else{
                replace = template.replace('{{LABELS}}', this.labels[i])
                    .replaceAll('{{NAMES}}', this.names[i])
                    .replace('{{VALUES}}', this.values[i])
                    .replace('{{TYPE}}', this.formtype[i]);
            }            
            templateHtml.push(replace);
        }
        this.html = this.baseTemplate.replace('{{TITLE}}', this.options.title)
        this.html += templateHtml.join(' ')
        this.html +=  this._launcherMaker();
        res(this.html);
    }

    async _getCorrectTemplate(type, resource){
        if(type == 'text' || type == 'file'){
            return this.baseField;
        }
        if(type == 'select'){
            //obtener campos y luego devolver el select
            if(this.selectOptions[resource] == 'default'){
                let selectOptions = '';
                for(let item of this.source[resource]){
                    selectOptions += this.opt
                        .replace('{{VALUE}}', item.name)
                        .replace('{{NAME}}', item.textContent)
                }
               return this._setTemlateMode(selectOptions);
            }else{
                const ajax = new Ajax(
                    this.options.action+this.source[resource], 
                    this.options.method,
                    this.customHeaders[resource],
                    this.customBody[resource]);
                const temp = ajax.fetchResult((resp)=>{
                    if(resp.status == 200){
                        let selectOptions = '';
                        for(let options of resp.data){
                            selectOptions += this.opt
                                .replace('{{VALUE}}', options[this.selectOptions[resource].value])
                                .replace('{{NAME}}', options[this.selectOptions[resource].textContent])
                        }
                        return this._setTemlateMode(selectOptions)
                    }
                })
                return await temp;
            }
        }
        if(type == 'radiobutton'){
            //logica radiobutton
        }
        if(type == 'checkbox'){
            //logica checkbox
        }
        if(type == 'color'){
            //logica color
        }
        if(type == 'date'){
            //Logica date
        }
        throw 'Element not available, please set the logic to set this input type'
    }

    _setTemlateMode(selectOptions){
        if(this.url.action === 'show'){
            return this.selectTemplate
             .replace('{{OPTIONS}}', selectOptions)
             .replace('{{FORMID}}', this.id)
             .replaceAll('{{ATTRIBUTES}}', 'disabled = "true"');
        }else{
            return this.selectTemplate
             .replace('{{OPTIONS}}', selectOptions)
             .replace('{{FORMID}}', this.id)
        }
    }

    _launcherMaker(){
        if(this.options.behaviour != undefined && this.options.behaviour.mission != undefined && this.options.behaviour.to != undefined){
            return  this.launcher.replace('{{IDFORM}}', this.id)
            .replace('{{URLSEND}}', this.action+this.formaction)
            .replace('{{METHOD}}', this.method)
            .replace('{{DATATYPEFORMS}}', 'normal')
            .replace('{{BEHAVIOUR}}', this.options.behaviour.mission+'-'+this.options.behaviour.to)
        }
        return this.launcher.replace('{{IDFORM}}', this.id)
            .replace('{{URLSEND}}', this.action+this.formaction)
            .replace('{{METHOD}}', this.method)
            .replace('{{DATATYPEFORMS}}', 'normal')
    }

    getFireElement(){
        return this.fireElement;
    }

}