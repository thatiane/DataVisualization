const CRYPTO_URL = 'https://coinmarketcap.com'

class CurrencyFetcher {

  constructor() {

  }

  getCurrencies() {
    let request = new XMLHttpRequest();

    request.onLoadend = function(event) {
      console.log(event);
    }
    request.open('GET', CRYPTO_URL, true)

  }
}
