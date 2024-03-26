//Aquí irá el componente
import { Componentizable } from "../componetizable.component.js";
import { Component } from "./main.component.js";
export class Modal extends Component {
  modalTrigger;
  config;
  id;
  components = [];
  showModal = `
    padding: 1rem;
    background-color:grey;
    position: absolute;
    width: 400px;
    top : 50%;
    left : 50%;
    display: d-flex;
    flex-direction:column;
    justfiy-content:center;
    z-index = 10000000000000000;`;
  backdrop = `
    position:absolute; 
    top:0;
    left:0;
    background-color:rgba(0,0,0,0.8);
    width:100vw; 
    height:300vh;
    z-index: calc(10000000000000000-1)`;
  hideModal = `display: none;`;
  modaltemplate = `
    <div data-modal-backdrop="{{ID}}" style="display: none;">
    </div>
    <div data-modal-modal="{{ID}}" style="display: none;">
        <div class="">{{MODALTITLE}}</div>
        <div data-modalbody="{{ID}}">{{MODALBODY}}</div>
        <div class="">{{MODALFOOTER}}</div>
    </div>`;
  modalDOM;
  modalButton = `<button class="{{CLASS}}" title="{{MODALTITLE}}" data-show="false" data-modal-fire="{{ID}}">
   {{BTITLE}}
</button>`;
  backdropDOM;
  modalMap = {};

  constructor(config, target, observer, oconfig) {
    super();
    this.modalTrigger = target;
    this.id = target.dataset.dataId;
    this.config = config;
    this._prepare(observer, oconfig);
  }

  _prepare(observer, oconfig) {
    this._modalParts(observer, oconfig);
    this.modalTrigger.innerHTML += this.html;
    this._events(observer, oconfig);
    /**
     * 1º Hay que darle funcionalidad al botón, check
     * 2º Hacer constructor del html de la modal y luego meter cosas al observer
     * 3º Hacer testing sobre estilos
     */
  }

  _modalParts() {
    this._head();
    this._footer();
    this._modalFire();
    this._body();
  }

  _modalFire() {
    this.html += this.modalButton
      .replaceAll("{{ID}}", this.id)
      .replaceAll("{{MODALTITLE}}", this.config.title)
      .replaceAll("{{CLASS}}", this.config.button.class)
      .replaceAll(" {{BTITLE}}", this.config.button.title);
  }

  _head() {
    this.html = this.modaltemplate
      .replace("{{MODALTITLE}}", this.config.title)
      .replaceAll("{{ID}}", this.id);
  }

  _body() {
    if (this.config.body.alert != "") {
      this.html = this.html.replace("{{MODALBODY}}", this.config.body.alert);
    }
  }

  _footer() {
    this.html = this.html.replace("{{MODALFOOTER}}", this.config.footer);
  }

  _events(observer, oconfig) {
    const button = document.querySelector(`[data-modal-fire="${this.id}"]`);
    button.dataset.modalclassshow = btoa(this.showModal);
    button.dataset.modalclasshidden = btoa(this.hideModal);
    button.dataset.backdrop = btoa(this.backdrop);
    button.addEventListener("click", (e) => {
      if (button.dataset.show == "false") {
        button.dataset.show = true;
      } else {
        button.dataset.show = false;
      }
    });
    if (this.config.body.components != "") {
      this.html = this.html.replace("{{MODALBODY}}", "");
      const body = document.querySelector(`[data-modalbody="${this.id}"]`);
      if(this.config.body.components != undefined && this.config.body.components != null){
        for (let it of Object.keys(this.config.body.components)) {
          this.config.body.components[it].id = this.id + it;
          new Componentizable(
            it,
            this.config.body.components[it],
            body,
            observer,
            oconfig
          );
        }
      }
    }
    observer.observe(button, oconfig);
  }
}
