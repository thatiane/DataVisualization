
class Graph {

    constructor(currencies, exchanges) {
        this._init(currencies, exchanges);

        this.priceChart = new DataChart("nodes-histo", {mode: "horizontalBar"});
        this.linkChart = new DataChart("links-histo", { mode: "bar" });
        this.pieChart = new PieChart("pie-chart");

    }

    _init(currencies, exchanges) {
        this.currencies = currencies;
        this.currencies = _.sortBy(this.currencies, 'price-usd');
        this.displayedCurrencies = currencies;

        var refined_exchanges = this._createExchanges(currencies, exchanges);


        var merged_exchanges = refined_exchanges[0];
        this.mergedExchanges = merged_exchanges;
        this.displayedLinks = merged_exchanges;

        this.grouped_exchanges = refined_exchanges[1];
    }

    showGraph() {

        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementById('graph'),
            x = (g.clientWidth),
            y = (w.innerHeight || e.clientHeight || g.clientHeight);

        var svg = d3.select("#graph")
                .attr("width", x)
                .attr("height", y)
                .call(d3.zoom().on("zoom", function () { svg.attr("transform", d3.event.transform)}))
                .append("g"), width = +x, height = +y;

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(y /3.5).strength(0.1))
            .force("collide", d3.forceCollide().radius(15))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2 - 100, height /2 - 100));

        var grouped = this.grouped_exchanges;
        var exchangesChart = this.linkChart;
        var pchart = this.pieChart;

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.displayedLinks).enter().append("line")
            .attr("stroke-width", function (d) {
                return 0.15 * Math.log(d['volume24h']);
            }).on("click", function(d){
              exchangesChart.addDataset(d['source']['id'] + "-" + d['target']['id'], Math.log(d['volume24h'])+10);
              var markets = grouped[d['source']['id']+","+d['target']['id']];
              var labels = [];
              var values = [];
              markets.forEach(function (m) {
                  labels.push(m['source']);
                  values.push(m['volume24h']);
              });

              pchart.createChart(values, labels);
            });

        link.append("title")
            .text(function (d) {
                return "Exchange between: " + d.source + " and " + d.target + " with volume=" + d.volume24h;
            });


        var chart = this.priceChart;
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.displayedCurrencies).enter().append("circle")
            .attr("r", function (d) {
                return 0.7 * Math.log(d['volume-usd']);
            })
            .attr("fill", 'black')
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("click", function(d){
              chart.addDataset(d['name'], Math.log(d['price-usd'])+10);
            });


        node.append("title")
            .text(function (d) {
                return d.name + " " + d['price-usd'] + "$";
            });

        simulation
            .nodes(this.displayedCurrencies)
            .on("tick", ticked);

        simulation.force("link")
            .links(this.displayedLinks);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }


        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }

    _createExchanges(currencies, exchanges) {
        var exchanges = [].concat.apply([], exchanges);
        var currencies_ids = _.map(currencies, (curr) => {
            return curr.id;
        });

        //Create links only for existing nodes
        exchanges = _.filter(exchanges, (exchange) => {
            var curr1 = exchange.pair.split('/')[0];
            var curr2 = exchange.pair.split('/')[1];

            return currencies_ids.includes(curr1) && currencies_ids.includes(curr2);
        });

        //Groups exchanges by source-target id
        var exchanges_grouped = _.groupBy(exchanges, (exchange) => {
            var pair = exchange.pair;
            return pair.split('/').sort();
        });

        //Merges exchanges between same coins but different markets (source)
        var merged_exchanges = [];

        for (var group in exchanges_grouped) {

            /*This groups information from different markets.
             * volume24h is the accumulated volume from the exchanges on every market
             * price is the mean price of all exchanges between two coins
             */
            var reducedGroup = _.reduce(exchanges_grouped[group], function (acc, exchange) {
                return {
                    volume24h: acc.volume24h + exchange.volume24h,
                    price: acc.price + exchange.price,
                    size: acc.size + 1.0
                }

            }, {volume24h: 0.0, price: 0.0, size: 0.0});
            reducedGroup.price = reducedGroup.price / reducedGroup.size;

            var source = group.split(',')[0];
            var target = group.split(',')[1];

            merged_exchanges = merged_exchanges
                .concat({
                    source: source,
                    target: target,
                    value: 1, volume24h: reducedGroup.volume24h,
                    price: reducedGroup.price
                });
        }
        merged_exchanges = _.sortBy(merged_exchanges, ['source', 'target']);
        return [merged_exchanges, exchanges_grouped];
    }

    /**
     * Restarts the graph with
     * the chosen currencies
     */
    restartGraph(currencies, exchanges) {
        const graphElement = document.getElementById("graph");
        graphElement.removeChild(graphElement.getElementsByTagName("g")[0]);

        this.priceChart.resetChart();
        this.linkChart.resetChart();
        this.pieChart.resetChart();

        this._init(currencies, exchanges);
        this.showGraph();
    }

    addAllToCharts() {
        var nodeChart = this.priceChart;
        this.displayedCurrencies.slice(0,20).forEach(x=>nodeChart.addDataset(x['name'], Math.log(x['price-usd'])+10));
        var linkChart = this.linkChart;
        this.displayedLinks.slice(0,30).forEach(d => linkChart.addDataset(d['source']['id'] + "-" + d['target']['id'], Math.log(d['volume24h'])+10));

        var pieChart = this.pieChart;
        var d = this.displayedLinks[0];
        var markets = this.grouped_exchanges[d['source']['id']+","+d['target']['id']];
              var labels = [];
              var values = [];
              markets.forEach(function (m) {
                  labels.push(m['source']);
                  values.push(m['volume24h']);
              });

              pieChart.createChart(values, labels);
    }
}
