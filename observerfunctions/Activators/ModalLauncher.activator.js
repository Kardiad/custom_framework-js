import { Cast } from "../../helpers/Cast.helper.js";

export class ModalLauncher{
    idModal;
    cssModalShow;
    cssModalHidden;
    cssBackdrop;
    htmlobject;
    show;
    backdrop;
    modal;

    constructor(htmlobject){
        this.htmlobject = htmlobject;
        this._setters();
    }

    _setters(){
        
        this.show = (new Cast(this.htmlobject.dataset.show)).bool();
        this.idModal = this.htmlobject.dataset.modalFire
        this.cssModalShow = atob(this.htmlobject.dataset.modalclassshow)
        this.cssBackdrop = atob(this.htmlobject.dataset.backdrop)
        this.cssModalHidden = atob(this.htmlobject.dataset.modalclasshidden)
        this.backdrop =  document.querySelector(`[data-modal-backdrop="${this.idModal}"]`)
        this.modal =  document.querySelector(`[data-modal-modal="${this.idModal}"]`)
    }

    _show(){
        //Comportamiento para cuando se dispare la modal, hay que mostrar la modal
        this.modal.setAttribute('style', this.cssModalShow)
        this.backdrop.setAttribute('style', this.cssBackdrop)
        this.backdrop.addEventListener('click',(e)=>{
            this.htmlobject.dataset.show = false;
        })
    }

    _hidden(){
        //Comportamiento para cuando se esconda la modal
        this.modal.setAttribute('style', this.cssModalHidden)
        this.backdrop.setAttribute('style', this.cssModalHidden)
    }

    fire(object, observer, oconfig, components){
        if(this.show == true){
           this._show();
        }else{
           this._hidden();
        }
        
    }
}