export class Dni {
  dni;
  chars = [
    "T",
    "R",
    "W",
    "A",
    "G",
    "M",
    "Y",
    "F",
    "P",
    "D",
    "X",
    "B",
    "N",
    "J",
    "Z",
    "S",
    "Q",
    "V",
    "H",
    "L",
    "C",
    "K",
    "E",
  ];
  constructor(dni) {
    this.dni = dni;
  }

  verify() {
    let json = {};
    if (
      this._dniValidatorStructure(this.dni) &&
      this._calcCharacterInDni(this.dni)
    ) {
      return true;
    }
    if (
      this._nieValidatorStructure(this.dni) &&
      this._calcCharacterInNie(this.dni)
    ) {
      return true;
    }
    if (
      this._passportValidatorStructure(this.dni) &&
      this._clacCharacterInPassport(this.dni)
    ) {
      return true;
    }
    return false;
  }

  _dniValidatorStructure(item) {
    //Buscar prueba de validación de dni y devolver error en caso de error
    return new RegExp("^[0-9]{8}[A-Z]{1}$").test(item);
  }

  _nieValidatorStructure(item) {
    return new RegExp("^[A-Z]{1}[0-9]{7}[A-Z]{1}$").test(item);
  }

  _passportValidatorStructure(item) {
    return new RegExp("[A-Z]{3}[0-9]{6}[A-Z]{1}").test(item);
  }

  _calcCharacterInDni(item) {
    let candidateL = item[item.length - 1];
    let candidate = item.substring(0, item.length - 1);
    return candidateL == this.chars[parseInt(candidate) % 23];
  }

  _calcCharacterInNie(item) {
    let candidateL = item[item.length - 1];
    let startL = item[0];
    let candidate = item.substring(1, item.length - 1);
    console.log({
      candidateL,
      startL,
      candidate,
      l: this.chars[parseInt(candidate) % 23],
    });
    if (startL == "X") {
      return candidateL == this.chars[parseInt(candidate) % 23];
    }
    if (startL == "Y") {
      candidate = parseInt(candidate) + 10000000;
      return candidateL == this.chars[candidate % 23];
    }
    if (startL == "Z") {
      candidate = parseInt(candidate) + 20000000;
      return candidateL == this.chars[candidate % 23];
    }
  }

  _clacCharacterInPassport(item) {
    return true;
  }
}
