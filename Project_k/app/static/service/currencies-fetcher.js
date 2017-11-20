const CRYPTO_URL = 'https://coinmarketcap.com'
const data_path = '/data'

class CurrenciesFetcher {

  constructor(refreshPeriod) {
    this.currencies = []

    let dataFetching = () => {
      fetch(flask_server_url + data_path)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.currencies = data;
        });
    }

    dataFetching();
    this.intervalId = setInterval(dataFetching, refreshPeriod);
  }

  getCurrencies() {
    return this.currencies;
  }

  resetScraping() {
    clearInterval(this.intervalId);
  }

}
