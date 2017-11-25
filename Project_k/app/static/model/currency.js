class Currency {

  constructor(name, code, price, volume) {
    this.name = name;
    this.code = code;
    this.price = price;
    this.volume = volume;
  }

  getName() {
    return this.name;
  }

  getCode() {
    return this.code;
  }

}
