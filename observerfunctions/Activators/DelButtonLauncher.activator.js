export class DelButtonLauncher{

    target;

    constructor(mutation){
        this.target = mutation
    }

    fire(observer, oconfig, components){
        const idComponent = this.target.dataset.del.split('-')[0];
        const idTab = this.target.dataset.del.split('-')[1];
        const component = components[idComponent];
        //calzar el ajax aquí para cuando esté revisar bien luego la base de datos
        component.component.reload({id:idTab}, observer, oconfig, 'delete');
    }

}