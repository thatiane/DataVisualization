const url_name = 'https://www.cryptonator.com/api/currencies';
const url_data = 'https://api.cryptonator.com/api/full/';

const CRYPTO_URL = 'https://coinmarketcap.com'

class CurrencyFetcher {

  constructor() {

  }

  getCurrencies() {

    let request = fetch(CRYPTO_URL, {method: 'get'});
    request.then(function (data) {
      console.log(data);
    });

  }
}

d3.json(url_name, function(error_name, data_name) {
  console.log('js loaded test')
})
