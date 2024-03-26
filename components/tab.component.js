import { Componentizable } from "../componetizable.component.js";
import { Cast } from "../helpers/Cast.helper.js";
import { FileManagement } from "../services/FileManagement.service.js";
import { Component } from "./main.component.js";
export class Tab extends Component {
  id;
  options;
  data;
  targetClicker;
  targetContent;
  clickerData;
  contentData;
  components;
  colorTabActive = "bg-info";
  activeClass = "display:flex!important";
  hiddenClass = "display:none!important";
  tabList = {
    tabClicker: [],
    tabContents: [],
  };
  tabClickHtml = `<div class="d-flex" data-tab-clicker="{{ID}}">{{CLICKERCONTENT}}</div>`;
  singleClickTab = `
    <div class="border" type="button" style="cursor:pointer;" data-tab-shiden=${this.hiddenClass} data-tab-show="${this.activeClass}" title="{{TITLE}}" data-tab-click="{{TABID}}-{{ID}}" data-clicker-tab-active="false" data-clicker-tab-hidden="true">
        <p class="m-auto">{{NAME}}</p>
    </div>
    `;
  tabContentHtml = `<div 
    class="row d-flex justify-content-around align-items-center m-auto" data-tab-content="{{ID}}">
      {{TABCONTENT}}
    </div>`;
  singleContentTab = `
  <div class="d-flex flex-column mb-5 border" style="${this.hiddenClass}"
    data-tab-container ="{{TABID}}-{{ID}}"
  >
  {{HTMLCOMPONENTS}}
  </div>`;
  target;
  componentsList = [];

  constructor(options, target, observer, oconfig) {
    super();
    this.target = target;
    this.options = options;
    this._prepare(observer, oconfig);
  }

  /**
   * Pensar el tab:
   * 1º Todo tab tiene que tener una pestaña que permita mostrar el contenido de la pestaña
   * 2º Toda pestaña tiene que admitir tanto elementos estáticos de html básico como componentes
   * del framework sino no tiene sentido trabajar con esto siendo que la idea es la reutilización
   * absoluta del código.
   * 3º La distribución del contenido tiene que determinarse de alguna forma.
   * 4º Se tienen que añadir tabs siempre que se añada una de manera dinámica, es decir,
   * yo llamo a back y éste me devuelve el tab con todos los datos cumplimentados
   * 5º Generar el tab activo
   */

  _prepare(observer, oconfig) {
    this._deserialization();
    this._tabClick();
    this._tabContent();
    new Promise(this._componentsLoad).then(res=>{
      this._contentLoad(res);
      this._render();
      this._reserialization();
      this._addEvents(observer, oconfig);
    })
  }

  _deserialization() {
    this.id = this.options.id 
    if(this.options.clicker != null){
      this.clickerData = this.options.clicker;
      this.options.clicker = null;
    }
    this.contentData = this.options.contentData;
    this.components = this.options.content.components;
  }

  _reserialization() {
    this.targetClicker = document.querySelector(`[data-tab-clicker="${this.id}"]`);
    this.targetContent = document.querySelector(`[data-tab-content="${this.id}"]`);
    this.clickers = [...document.querySelectorAll(`[data-tab-click]`)];
  }

  _getHtmlComponent = async ()=>{
    const url = window.location.protocol+'//'+window.location.host+'/intranet-dev/js/components/htmlcomponent/';
    const files = this.options.content.componentsFiles;
    const managment = new FileManagement(url, files[0]);
    const temp = managment.openFile(async(response, res)=>{
       return await response;
    })
    return await temp;    
  }

  _tabClick() {
    let content = "";
    for (let i of Object.values(this.clickerData)) {
      content += this.singleClickTab
        .replace("{{TITLE}}", i.title)
        .replaceAll("{{TABID}}", this.id)
        .replaceAll("{{ID}}", i.id)
        .replace("{{NAME}}", i.name);
    }
    this.html = this.tabClickHtml
      .replace("{{ID}}", this.id)
      .replace("{{CLICKERCONTENT}}", content);
  }

  _tabContent() {
    this.html += this.tabContentHtml
      .replace("{{ID}}", this.id)
      .replace('{{TABCONTENT}}', this._tabLoad());
  }

  _tabLoad(){
    let tabs = '';
    for(let i of Object.values(this.clickerData)){
        tabs += this.singleContentTab
        .replace("{{TITLE}}", i.title)
        .replaceAll("{{TABID}}", this.id)
        .replaceAll("{{ID}}", i.id)
        .replaceAll("{{NAME}}", i.name)
    }
    return tabs;
  }

  _render() {
    this.target.innerHTML = this.html;
  }

  _contentLoad(template) {
    const temp = template.split('<!--END::CABECERA-->')
    for(let i of temp){
      for(let o of Object.keys(this.components)){
        const id = o.replace('_', '-');
        i = i.replace('{{SUBCOMPONENTID}}', id); 
      }
      this.html = this.html.replace('{{HTMLCOMPONENTS}}', i)
    }
  }

  _componentsLoad = async(res, rej) => {
    let template = await this._getHtmlComponent();
    let output = '';
    for(let i of Object.values(this.clickerData)){
      output+=template.replaceAll('{{NAME}}', i.name)
      .replaceAll('{{TABID}}', this.id)
      .replaceAll('{{ID}}', i.id)
      .replaceAll("{{TITLE}}", i.title)
    }
    res(output);
  }

  _componentsGenerator(observer, oconfig){
    //Aquí se generarán todos los componentes que tenga algo. Luego de esos componentes
    //Se deberían generar sus subcomponentes de modo que no hayan muchas más capas de js
    //Y todo esté dado de alta en el observer
    if(this.components!=null && this.components!= undefined && Object.values(this.components).length>0){
      for(let o of Object.keys(this.clickerData)){
        for(let i of Object.keys(this.components)){
          const type = i.split('_')[0];
          const id = i.replace('_', '-');
          const target = document.querySelector(`[data-${type}="${this.id}-${parseInt(o)+1}-${id}"]`);
          this.componentsList.push(new Componentizable(type, this.components[i], target, observer, oconfig))
        }
      }
    }
  }

  _addEvents(observer, oconfig) {
    for (let i of this.clickers) {
      i.addEventListener("click", (e) => {
        if (!new Cast(i.dataset.clickerTabActive).bool()) {
          i.dataset.clickerTabActive = true;
        } else {
          i.dataset.clickerTabActive = false;
        }
      });
      const delButton = document.querySelector(`[data-del="${this.id}-${i.dataset.tabClick.split('-')[1]}"]`)
      delButton.addEventListener('click', ()=>{
        delButton.dataset.delthis = this.id+'-'+i.dataset.tabClick.split('-')[1];
        delButton.dataset.activateButton = true;
      })
      observer.observe(i, oconfig);
      observer.observe(delButton, oconfig)
    }
    this._componentsGenerator(observer, oconfig);
  }

  reload(object, observer, oconfig, mode) {
    if(mode == 'add'){
      this.clickerData.push(object);
    }
    if(mode == 'edit'){

    }
    if(mode == 'delete'){
      const id = object.id;
      this.clickerData = this.clickerData.filter(e=>e.id != id);
    }
    this._prepare(observer, oconfig)
  }
}
