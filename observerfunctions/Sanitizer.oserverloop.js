export class Sanitizer {
  string;
  no_sql_regex = /(\`|\'|\"|\*)/;
  sql_reserved_keys = 'SELECT|select|from|FROM|join|JOIN|delete|DELETE|update|UPDATE';

  constructor(string) {
    this.string = string;
  }
  
  //Añadir formas de eliminar el slq injection y otras movidas
  sanitize() {
    if(this.string != undefined && this.string != ''){
      let string = this.string
        .replace(this.no_sql_regex, "")
      for(let i of this.sql_reserved_keys.split('|')){
        string = string.replace(i, '');
      }
      return string;
    }
  }

}
