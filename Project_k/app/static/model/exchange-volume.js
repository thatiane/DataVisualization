class ExchangeVolume {

  constructor(coin1, coin2, value, date) {
    this.coin1 = coin1;
    this.coin2 = coin2;
    this.value = value;
    this.date = date;
  }

  getCoins() {
    return [this.coin1, this.coin2];
  }

  getValue() {
    return this.value;
  }

  getDate() {
    return this.date;
  }

}
