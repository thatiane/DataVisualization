const flask_server_url = 'http://0.0.0.0:5000';
const refreshPeriod = 300000;

dataFetcher = new DataFetcher(refreshPeriod);
promise = dataFetcher.getData();

promise.then((data) => {
    //Receive data
    currencies = parseCurrencies(data[0]);
    volumes = parseVolumes(data[1]);

    //console.log(currencies)


    //Create and show graph
    const graph = new Graph(currencies, volumes);
    graph.showGraph();

    //Show UI
    scrollBox(currencies.map(x=>[x['id'],x['name']]), graph)
});
