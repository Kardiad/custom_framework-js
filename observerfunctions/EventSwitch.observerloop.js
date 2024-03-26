import { FormLauncher } from "./Activators/FormLauncher.activator.js";
import { LoadEvent } from "./LoadEvent.observerloop.js";
import { ValidatorEvent } from "./ValidatorEvent.observerloop.js";
import { ModalLauncher } from "./Activators/ModalLauncher.activator.js";
import { TabLauncher } from "./Activators/TabLauncher.activator.js";
import { DelButtonLauncher } from "./Activators/DelButtonLauncher.activator.js";

export class EventSwitch {
  mutation;

  constructor(mutation) {
    this.mutation = mutation;
  }

  strategy() {
    if (this.mutation.oldValue == null && this.mutation.type == "childList") {
      return new LoadEvent(this.mutation);
    }
    if (this.mutation.type == "attributes" && this.mutation.attributeName == "data-show") {
      return new ModalLauncher(this.mutation.target);
    }
    if(this.mutation.type == "attributes" && this.mutation.attributeName == "data-activate-button"){
      return new DelButtonLauncher(this.mutation.target);
    }
    if(this.mutation.type== "attributes" && this.mutation.attributeName == 'data-clicker-tab-active'){
      return new TabLauncher(this.mutation.target)
    }
    if (this.mutation.type == "attributes" &&
      this.mutation.attributeName != "value" &&
      this.mutation.attributeName != "data-formstatus" &&
      this.mutation.attributeName != "data-datafire" &&
      this.mutation.attributeName != "class" &&
      this.mutation.attributeName != "data-object" &&
      (this.mutation.target.dataset.valid == false ||
        this.mutation.target.dataset.valid == undefined)) {
      return new ValidatorEvent(this.mutation);
    }
    if (this.mutation.type == "attributes" && this.mutation.attributeName == "data-datafire") {
      const trigger = JSON.parse(atob(this.mutation.target.dataset.formstatus));
      return new FormLauncher(trigger, this.mutation.target);
    }    
  }
}
