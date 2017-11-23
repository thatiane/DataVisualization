const flask_server_url = 'http://0.0.0.0:5000';
const refreshPeriod = 300000;

dataFetcher = new DataFetcher(refreshPeriod);

promise = dataFetcher.getData();

promise.then((data) => {
  currencies = data[0];
  volumes = data[1];

  console.log('Currencies: ' + currencies);
  console.log('Volumes: ' + volumes);
});
