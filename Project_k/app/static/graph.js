class Graph {

    constructor(currencies, exchanges) {

      this.currencies = currencies;
      this.currencies = _.sortBy(this.currencies, 'price-usd');
      this.displayedCurrencies = currencies;

      var merged_exchanges = this._createExchanges(currencies, exchanges);

      this.mergedExchanges = merged_exchanges;
      this.displayedLinks = merged_exchanges;

    }


    showGraph() {

        var svg = d3.select("#graph")
                    .call(d3.zoom().on("zoom", function () {
                        svg.attr("transform", d3.event.transform)
                    }))
                    .append("g"),

            width = +svg.attr("width"),
            height = +svg.attr("height");

            //var color = d3.scaleOrdinal(d3.schemeCategory20);

        var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(10000).strength(0.01))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(this.displayedLinks).enter().append("line")
        .attr("stroke-width", function(d) { return 3 * Math.log(d['volume24h']);});



        var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(this.displayedCurrencies).enter().append("circle")
        .attr("r", function(d) { return 10 * Math.log(d['volume-usd']);})
        .attr("fill", 'black')
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(this.displayedCurrencies)
            .on("tick", ticked);

        simulation.force("link")
            .links(this.displayedLinks);

        this.d3Nodes = node;
        this.d3Links = link;
        this.simulation = simulation;

        function ticked() {
          link
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
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

    removeNode(id) {
      console.log(this.d3Nodes);
      this.displayedCurrencies = _.filter(this.displayedCurrencies, (currency) => {
        return currency.id !== id;
      });

      this.displayedLinks = _.filter(this.displayedLinks, (exchangePair) => {
        return (exchangePair.target.id !== id) && (exchangePair.source.id !== id);
      });

      this._updateSimulation(this.displayedCurrencies, this.displayedLinks);

      this._updateD3Nodes(this.d3Nodes, this.displayedCurrencies, false);
      this._updateD3Links(this.d3Links, this.displayedLinks, false);
      console.log(this.d3Nodes);
    }

    addNode(id) {
      this.displayedCurrencies = this.displayedCurrencies.concat(_.find(this.currencies, (currency) => {
        return currency.id === id;
      }));

      this.displayedCurrencies = _.sortBy(this.displayedCurrencies, 'price-usd');

      this.displayedLinks = this.displayedLinks.concat(_.filter(this.mergedExchanges, (exchangePair) => {
        return (exchangePair.source === id) || (exchangePair.target === id);
      }));

      this.displayedLinks = _.sortBy(this.displayedLinks, ['source', 'target']);

      this._updateSimulation(this.displayedCurrencies, this.displayedLinks);

      this._updateD3Nodes(this.d3Nodes, this.displayedCurrencies, true);
      this._updateD3Links(this.d3Links, this.displayedLinks, true);
    }

    _updateSimulation(nodes, links) {
      this.simulation.nodes(nodes);
      this.simulation.force("link").links(links);
      this.simulation.alpha(1).restart();
    }

    _updateD3Links(d3Links, displayedLinks, add) {
      d3Links = d3Links.data(displayedLinks);
      if(add) {
        d3Links = d3Links.enter().append("line")
                         .attr("stroke-width", function(d) { return 3 * Math.log(d['volume24h']);})
                         .merge(d3Links);
      } else {
        d3Links = d3Links.exit().remove();
      }
    }

    _updateD3Nodes(d3Nodes, displayedNodes, add) {
      console.log('here ' + JSON.stringify(displayedNodes));
      d3Nodes = d3Nodes.data(displayedNodes);

      if(add) {
        d3Nodes.enter().append("circle")
            .attr("r", function(d) { return 10 * Math.log(d['volume-usd']);})
            .attr("fill", 'black')
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .merge(d3Nodes);
      } else {
        d3Nodes.exit().remove();
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
        var currencies_ids = _.map(currencies, (curr) => { return curr.id; });

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
            var reducedGroup = _.reduce(exchanges_grouped[group], function(acc, exchange) {
                return {volume24h: acc.volume24h + exchange.volume24h,
                        price: acc.price + exchange.price,
                        size: acc.size + 1.0}

            }, {volume24h: 0.0, price: 0.0, size: 0.0});
            reducedGroup.price = reducedGroup.price / reducedGroup.size;

            var source = group.split(',')[0];
            var target = group.split(',')[1];

            merged_exchanges = merged_exchanges
                .concat({source: source,
                    target: target,
                    value: 1, volume24h: reducedGroup.volume24h,
                    price: reducedGroup.price});
        }

        merged_exchanges = _.sortBy(merged_exchanges, ['source', 'target']);
        return merged_exchanges;
    }

    _createSVG() {

    }
}
