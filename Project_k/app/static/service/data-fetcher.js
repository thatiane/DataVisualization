const data_path = '/data'

/**
* Data fetcher for the app
**/
class DataFetcher {

  /**
  * Construct a new DataFetcher object
  * @param {Number} period at which the data fetching happens
  **/
  constructor(refreshPeriod) {
    this.currencies = []

    this.dataPromise = null;

    let fetchVolumes = () => {
      this.dataPromise = fetch(flask_server_url + data_path)
    }

    fetchVolumes();
    this.intervalId = setInterval(fetchVolumes, refreshPeriod);
  }

  /**
  * Get the data previously fetched
  * @return a promise on the data
  **/
  getData() {
    return this.dataPromise.then((response) => {
      return response.json();
    });
  }

  /**
  * Stop fetching the data from the server
  **/
  resetScraping() {
    clearInterval(this.intervalId);
  }

}
