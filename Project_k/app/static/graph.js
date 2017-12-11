class Graph {

    constructor(currencies, exchanges) {
        this.currencies = {};
        this.exchanges = {};

        for (let i = 0; i < currencies.length; i++) {
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
                    this.exchanges[ex['pair'] + ex['source']] = ex
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
        }


    }


    showGraph() {
        var div = document.getElementById("graph");
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.left = "0";
        div.style.top = "0";
        div.style.position = "fixed";
        div.style.zIndex = "-1";
        div.style.background = "#000";
        div.style.alignContent="center";

        var curr = this.currencies;


        cy = window.cy = cytoscape({
            container: div,

            layout: {
               name: 'concentric',
                concentric: function( node ){
                    return node.degree();
                },
                levelWidth: function( nodes ){
                    return 3;
                }
            },

            style: cytoscape.stylesheet()
                .selector('node')
                .style({
                    'shape': 'ellipse',
                    'width': 'data(width)',
                    'height': 'data(width)',
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'font-size': 'data(strength)',
                    'text-outline-width': 1,
                    'text-outline-color': '#afb1b0',
                    'background-color': '#afb1b0',
                    'color': '#fff',
                })
                .selector(':selected')
                .style({
                    'border-width': 2,
                    'border-color': '#525453'
                })
                .selector('edge')
                .style({
                    'curve-style': 'bezier',
                    'opacity': 0.666,
                    'width': 'data(strength)',
                    'line-color': 'data(faveColor)',

                })
                .selector(':selected')
                .style({
                    'border-width': 2,
                    'border-color': '#525453'
                }),

            elements: {
                nodes: this._setNodes(),
                edges: this._setEdges()
            }
        });
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
