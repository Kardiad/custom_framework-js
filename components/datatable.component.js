import { Component } from "./main.component.js";

export class Datatable extends Component{

    target;
    options;
    thbase = `
    <tr>
        <th class="align-middle">{{THTITLE}}</th>
    </tr>
    `;
    tbody = `
    <tr>
        {{TDSINBODY}}
    </tr>
    `;
    tds = `
    <td class="align-middle">{{TDCONTENT}}</td>
    `;

    constructor(options, target, observer, oconfig) {
        super();
        this.target = target;
        this.options = options;
    }

    //Crear el metodo init, para situar las cosas más sencillas como clases, y cosas que no tengan
    //La necesidad de carga
    //2º Añadir cosas que tenga necesidad de carga
    //3º Añadir posibilidad de paginado para la mimsa datatable
    //4º 
    
}