const data_path = '/data'

class DataFetcher {

  constructor(refreshPeriod) {
    this.currencies = []

    this.dataPromise = null;

    let fetchVolumes = () => {
      this.dataPromise = fetch(flask_server_url + data_path)
    }

    fetchVolumes();
    this.intervalId = setInterval(fetchVolumes, refreshPeriod);
  }

  getData() {
    return this.dataPromise.then((response) => {
      return response.json();
    });
  }

  resetScraping() {
    clearInterval(this.intervalId);
  }

}
