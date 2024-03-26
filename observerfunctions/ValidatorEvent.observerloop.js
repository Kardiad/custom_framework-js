import { Sanitizer } from "./Sanitizer.oserverloop.js";
import { Dni } from "./Validators/Dni.validator.js";
import { Ids } from "./Validators/Ids.validator.js";
import { Name } from "./Validators/Name.validator.js";
import { Sex } from "./Validators/Sex.validator.js";
import { Surname } from "./Validators/Surname.validator.js";

export class ValidatorEvent {
  mutation;
  validator;
  htmlItem

  constructor(mutation) {
    this.mutation = mutation;
    this.htmlItem = this.mutation.target;
    this.validator = this.mutation.target.dataset.get;
  }

  fire() {
    //Dispara evento cuando carga cosas ideal para animaciones y pollas
    //U otras cosas.
    const sanitize = new Sanitizer(this.mutation.target.value);
    const sanitizedValue = sanitize.sanitize();
    if (this.validator == "dni") {
      const validator = new Dni(sanitizedValue);
      //Estrategia, añadir límite de caracteres de un dni, y además
      if(validator.verify()){
        this._set(sanitizedValue);
      }
      return;
    }
    if(this.validator == 'nombre'){
      const validator = new Name(sanitizedValue);
      if(validator.verify()){
        this._set(sanitizedValue);
      }
      return;
    }
    if(this.validator == 'apellidos'){
      const validator = new Surname(sanitizedValue)
      if(validator.verify()){
        this._set(sanitizedValue);
      }
      return;
    }
    if(this.validator == 'sexo'){
      const validator = new Sex(sanitizedValue)
      if(validator.verify()){
        this._set(sanitizedValue);
      }
      return;
    }
    if(this.validator == 'cod_ent' || this.validator == 'n_soc' || this.validator == 'sub_ent'){
      const validator = new Ids(sanitizedValue)
      if(validator.verify()){
        this._set(sanitizedValue);
      }
      return;
    }
  }

  _set(sanitize){
    console.log(sanitize)
    this.htmlItem.setAttribute('data-valid', true);
    this.htmlItem.setAttribute('value', sanitize)
    this.htmlItem.classList.add('border-success');
    this.htmlItem.classList.remove('border-danger');
    this._giveSameObjectToAll(this.htmlItem.dataset.form)
  }

  _giveSameObjectToAll(id){
    const formElements = document.querySelectorAll(`[data-form=${id}]`)
    const triggerElement = document.querySelector(`[data-fire=${id}]`);
    const sender = JSON.parse(atob(triggerElement.dataset.formstatus));
    for(let item of formElements){
      let field = item.name;
      if(item.dataset.valid!=undefined && item.dataset.valid=='true' || item.disabled==true){
        sender.sendable[field] = true
      }else{
        sender.sendable[field] = false
      }
    }
    triggerElement.dataset.formstatus = btoa(JSON.stringify(sender));
  }

  
}
