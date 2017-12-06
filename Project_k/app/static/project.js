const flask_server_url = 'http://0.0.0.0:5000';
const refreshPeriod = 300000;

dataFetcher = new DataFetcher(refreshPeriod);
promise = dataFetcher.getData();

promise.then((data) => {
    //Receive data
    currencies = parseCurrencies(data[0]);
    volumes = parseVolumes(data[1]);

    console.log(currencies)
    console.log(volumes[0])
    slideBar()
    let box_heights = [520, 400,200, 200,]
    accordion(4, ["Select Node", "Select Market", "Nodes", "Edges"], box_heights);

    //Create and show graph
    const graph = new Graph(currencies, volumes);
    graph.showGraph();

    let market = new Object();
    let market_list = [];
    for (let i = 0; i < volumes.length; i++) {
        for (var j = 0; j < volumes[i].length; j++) {
            let key = volumes[i][j].source
            if(!(key in market)){
               market[key] = key
               market_list.push([key, key])

            }
        }
    }

    //Show UI

    currencies_name_id = currencies.map(x=>[x['id'],x['name']])

    const scrollBoxBouton1 = new ScrollBoxBouton(currencies_name_id, 0, box_heights[0], graph, "checkNode");
    scrollBoxBouton1.showScrollBoxBouton();
    scrollBoxBouton1.clickNode()

    const scrollBoxBouton2 = new ScrollBoxBouton(market_list, 1, box_heights[1], graph, "checkMarket");
    scrollBoxBouton2.showScrollBoxBouton();
    scrollBoxBouton2.clickMarket()

    const scrollBox1 = new ScrollBox(2, box_heights[2], true);
    scrollBox1.showScrollBox();

    const scrollBox2 = new ScrollBox(3, box_heights[3], false);
    scrollBox2.showScrollBox();

});
