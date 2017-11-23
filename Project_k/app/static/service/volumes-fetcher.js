const CRYPTO_URL = 'https://coinmarketcap.com'
const data_path = '/data'

class VolumesFetcher {

  constructor(refreshPeriod) {
    this.currencies = []

    this.dataPromise = null;

    let dataFetching = () => {
      this.dataPromise = fetch(flask_server_url + data_path)
    }

    dataFetching();
    this.intervalId = setInterval(dataFetching, refreshPeriod);
  }

  getVolumes() {
    return this.dataPromise.then((response) => {
      return response.json();
    });
  }

  resetScraping() {
    clearInterval(this.intervalId);
  }

}
