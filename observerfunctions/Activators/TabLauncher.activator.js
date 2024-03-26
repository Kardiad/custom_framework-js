export class TabLauncher {

    trigger;
    tabs = {
        'clickers' : [],
        'contents' : []
    };
    tabcomp;

    constructor(trigger){
        this.trigger = trigger;
        this._getAllTabs();
    }

    _getAllTabs(){
        const id = this.trigger.dataset.tabClick.split('-')[0];
        this.tabs.clickers = [...document.querySelectorAll(`[data-tab-clicker="${id}"]`)[0].children]
        this.tabs.contents = [... document.querySelectorAll(`[data-tab-content="${id}"]`)[0].children]
        //Habría que añadir los tabsContents
    }

    _hiddenTabsNoSelected(){
        for(let i in this.tabs.clickers){
           if(this.tabs.clickers[i] != this.trigger){
            this.tabs.clickers[i].dataset.clickerTabHidden = true;
            this.tabs.contents[i].setAttribute('style', this.trigger.dataset.tabShiden)
           }else{
            this.tabs.clickers[i].dataset.clickerTabHidden = false;
            this.tabs.contents[i].setAttribute('style', this.trigger.dataset.tabShow)
           }
        }
    }

    _bgChange(){
        for(let i of this.tabs.clickers){
            i.classList.remove('bg-info');
        }
        this.trigger.classList.add('bg-info')
    }

    fire(object, observer, oconfig, components){
        this._hiddenTabsNoSelected();
        this._bgChange();
        //rescatar componente tab y luego hacer la acción de comportamiento
    }

}