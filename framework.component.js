import { Componentizable } from "./componetizable.component.js";
import { EventSwitch } from "./observerfunctions/EventSwitch.observerloop.js";
/**
 * @Class App
 * Este va a ser un framework de javascript que me voy a cascar a mano. En él va a haber una serie de claves a tener en cuenta.
 * Cuestiones básicas del fw:
 *  1º Patrón de diseño Observador que revise todos los elementos dados de alta en mi sistema
 *  2º Tratamiento de eventos por js
 *  3º Forma propia de gestionar ajax
 *  4º Abierto a componetización
 */
export class App {
  _components;
  _functions;
  _files;
  _ajax;
  _events;
  _observer;
  _triggers;
  _config;
  _pathLibrary;
  _files;
  _options;
  constructor(object) {
    this._triggers = object.triggers;
    this._components = object.components;
    this._config = object.config;
    this._pathLibrary = object.pathLibrary;
    this._files = object.files;
    this._options = object.options;
    this._components = {};
    this._observer = new MutationObserver(this._mutations);
  }

  run(){
    //Tenemos que crear comportamientos para que el observer pueda detectar cambios en el objeto, esto afecta a botones, principalmente
    //Aquí daremos de alta a todos los componentes obtenidos en el constructor
    for (let i of Object.keys(this._triggers)) {
      let cont = 0;
      for (let trigger of this._triggers[i]) {
        trigger.dataset.dataId = i + (cont + 1);
        this._componetizable(trigger, i, cont);
        cont++;
      }
    }
  }
  async _componetizable(trigger, i, cont) {
    //esto el objeto componente, para meter en la lista de elementos admitidos dentro de nuestro framework, trabajado por un observer
    //añadir el componente según el tipo y guardar en this._components
    this._options[i +(cont + 1)].id = i +(cont + 1);
    const component = new Componentizable(i, this._options[i + (cont + 1)], trigger, this._observer, this._config);
    const comp = component.get()
    const object = {
      htmlElement: trigger,
      type: i,
      id: i + (cont + 1),
      component: comp,
    };
    this._components[i + (cont + 1)] = object;
    this._observer.observe(trigger, this._config);
  }

  /*_clicable(trigger) {
    return trigger.tagName.toLowerCase() === "button" || trigger.tagName.toLowerCase() === "button" || trigger.getAttribute("type") === "button";
  }*/
  
  /*
  Antiguo autoloader, actualmente funciona sólo con los imports, hechos desde la app
  _autoloader() {
    const url = window.location.origin + this._pathLibrary;
    this._files.forEach((element) => {
      fetch(url + "/" + element)
        .then((r) => r.text())
        .then((content) => {
          const script = document.createElement("script");
          script.src = url + "/" + element;
          script.type = "module";
        });
    });
  }*/

  _mutations = (mutations, observer) => {
    //Aquí irá la subscripción de los diversos componentes, detectados del html
    //Econtrar en _components el html trigger adecuado, o ajustado al que ha sufrido una mutación
    for(let mutation of mutations){
      //Events from event loop, and you need break the code to avoid an infinite event loop
      const event = (new EventSwitch(mutation)).strategy();
      if(event!=undefined){
        event.fire(observer, this._config, this._components);
      }
    }
  }
}
