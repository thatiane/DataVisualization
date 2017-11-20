const flask_server_url = 'http://0.0.0.0:5000';
const url_name = 'https://www.cryptonator.com/api/currencies';
const refreshPeriod = 300000;

d3.json(url_name, function(error_name, data_name) {
  currenciesFetcher = new CurrenciesFetcher(refreshPeriod);

})
