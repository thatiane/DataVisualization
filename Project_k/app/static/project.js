const flask_server_url = 'http://cryptocurrency.gucevska.io:5000';
const refreshPeriod = 300000;

dataFetcher = new DataFetcher(refreshPeriod);
promise = dataFetcher.getData();

promise.then((data) => {
  
    //Receive data
    currencies = parseCurrencies(data[0]);
    volumes = parseVolumes(data[1]);

    console.log(currencies)
    //Show UI
    scrollBox(currencies.map(x=>x['name']))

    //Create and show graph
    const graph = new Graph(currencies, volumes);
    graph.showGraph();
});
