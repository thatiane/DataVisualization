const flask_server_url = 'http://0.0.0.0:5000';
const refreshPeriod = 300000;

dataFetcher = new DataFetcher(refreshPeriod);
promise = dataFetcher.getData();

promise.then((data) => {
    //Receive data
    currencies = parseCurrencies(data[0]);
    volumes = parseVolumes(data[1]);

    const customize = new InteractiveGraph(currencies, volumes);
});
