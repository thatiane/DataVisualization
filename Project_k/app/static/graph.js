class Graph {

    constructor(currencies, exchanges) {
      this.currencies = currencies;

      this.exchanges = {};

      var exchanges = [].concat.apply([], exchanges);

      // Temp code, removes USD from exchanges
      exchanges = _.filter(exchanges, (exchange) => {
        var currencies_ids = _.map(currencies, (curr) => { return curr.id; });

        var curr1 = exchange.pair.split('/')[0];
        var curr2 = exchange.pair.split('/')[1];

        return currencies_ids.includes(curr1) && currencies_ids.includes(curr2);
      });

      var exchanges_grouped = _.groupBy(exchanges, (exchange) => {
        var pair = exchange.pair;

        return pair.split('/').sort();
      });

      var merged_exchanges = [];

      for (var group in exchanges_grouped) {

        var reducedGroup = _.reduce(exchanges_grouped[group], function(acc, exchange) {
          return {volume24h: acc.volume24h + exchange.volume24h, price: acc.price + exchange.price, size: acc.size + 1.0}
        }, {volume24h:0.0, price:0.0, size:0.0});

        reducedGroup.price = reducedGroup.price / reducedGroup.size;

        var source = group.split(',')[0];
        var target = group.split(',')[1];

        merged_exchanges = merged_exchanges.concat({source: source, target: target, value: 1, volume24h: reducedGroup.volume24h, price: reducedGroup.price});
        //merged_exchanges = merged_exchanges.concat({source: source, target: target, value: 1});

      }

      this.mergedExchanges = merged_exchanges;

        /*for (let i = 0; i < currencies.length; i++) {
            var node = currencies[i];
            node['visible'] = false;
            this.currencies[node['id']] = node
        }





        var node_ids = Object.keys(this.currencies);

        for (let i = 0; i < exchanges.length; i++) {
            var coin_exchanges = exchanges[i];

            for (let j = 0; j < coin_exchanges.length; j++) {
                var ex = exchanges[i][j];
                var pair = ex['pair'].split("/");
                ex['visible'] = false;

                if (node_ids.includes(pair[0]) && node_ids.includes(pair[1])) {
                    this.exchanges[ex['pair'] + ex['source']];
                }
            }
        }

        this.exchanges_total = {};


        var count = 0;
        for (var i = 0; i < node_ids.length - 1; i++) {
            var n1 = node_ids[i];
            for (var j = i + 1; j < node_ids.length; j++) {
                var n2 = node_ids[j];
                for (var key in this.exchanges) {
                    if (key.indexOf(n1) != -1 && key.indexOf(n2) != -1) {
                        var pair = n1 + '/' + n2;
                        var volume = parseFloat(this.exchanges[key]['volume24h']);
                        var existingVolume = 0;
                        if (typeof this.exchanges_total[pair] != "undefined") {
                            existingVolume = this.exchanges_total[pair]['volume'];
                        } else {
                            count = count + 1;
                            this.exchanges_total[pair] = {};
                        }

                        this.exchanges_total[pair]['volume'] = volume + existingVolume;
                    }
                }
            }
        }*/


    }


    showGraph() {



      var svg = d3.select("#graph").call(d3.zoom().on("zoom", function () {
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
          .data(this.mergedExchanges)
          .enter().append("line")
            .attr("stroke-width", function(d) { return 3 * Math.log(d['volume24h']);});

        var node = svg.append("g")
            .attr("class", "nodes")
          .selectAll("circle")
          .data(this.currencies)
          .enter().append("circle")
            .attr("r", function(d) { return 10 * Math.log(d['volume-usd']);})
            .attr("fill", 'black')
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(this.currencies)
            .on("tick", ticked);

        simulation.force("link")
            .links(this.mergedExchanges);

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

    _setNodes() {
        var result = [];

        for(var key in this.currencies) {
            var node = this.currencies[key];
            node['visible'] = true;

            var value = Math.abs(Math.log(parseFloat(node['volume-btc']))*10);
            result.push({data: {id: key, width: value, strength: value/3}});
        }

        return result
    }

    _setEdges() {
        var result = [];
        var node_ids = Object.keys(this.currencies);
        for (var key in this.exchanges_total) {
            var edge = this.exchanges_total[key];
            var pair = key.split("/");

            if(node_ids.includes(pair[0]) && node_ids.includes(pair[1])) {
                edge['visible'] = true;
                var edge_size = Math.log(edge['volume'] + 3)/Math.log(3);

                result.push({data: {id: key, source: pair[0], target: pair[1], faveColor: '#6FB1FC', strength: edge_size}});
            }
        }

        return result
    }

    removeNode(id) {
        var node_to_remove;
        var es = [];

        cy.nodes().forEach(function (node) {
            if ((node.data('id') === id)) {
                node_to_remove = node;
            }
        });

        cy.edges().forEach(function (edge) {
            if ((edge.data('source') === id) || (edge.data('target') === id)) {
              es.push(edge);

            }
        });

        if(typeof node_to_remove != "undefined") {
            this.currencies[node_to_remove.data('id')]['node'] = node_to_remove;
            this.currencies[node_to_remove.data('id')]['visible'] = false;

            for (let i = 0; i < es.length; i++) {
                var edge = this.exchanges_total[es[i].data('id')];
                edge['edge'] = es[i];
                edge['visible'] = false;
            }
            cy.remove("#"+id);
        }
    }

    addNode(id) {
        var node_to_add = this.currencies[id];

        if(typeof node_to_add != "undefined" && !node_to_add['visible']) {
            node_to_add['visible'] = true;
            cy.add(node_to_add['node']);

            //Add the edges
            for(var key in this.exchanges_total) {
                var edge = this.exchanges_total[key];
                if(key.indexOf(id) !== -1 && !edge['visible']) {
                    var edge_to_add = edge['edge'];
                    var source_id = edge_to_add.data('source');
                    var target_id = edge_to_add.data('target');

                    if(this.currencies[source_id]['visible'] && this.currencies[target_id]['visible']) {
                        cy.add(edge_to_add);
                    }
                }
            }
        }
    }
}
