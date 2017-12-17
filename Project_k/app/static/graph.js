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
        this.node_markets = {};

        let keys =  Object.keys(this.exchanges)
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let pair = this.exchanges[key].pair;
            let market = this.exchanges[key].source
            let s_t = pair.split("/");

            for (var j = 0; j < s_t.length; j++) {
                if(s_t[j] in this.node_markets){
                    let market_in_node = this.node_markets[s_t[j]]
                    if(!(market in market_in_node)){
                        this.node_markets[s_t[j]][market] = true;
                    }
                }else{
                    this.node_markets[s_t[j]] = {};
                    this.node_markets[s_t[j]][market] = true
                }
            }
        }
    }


    showGraph() {
        var div = document.getElementById("graph");
        var acc_width = document.getElementsByClassName("accordion")[0].offsetWidth
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

        let coins = this.currencies

        let obj_node = new Object();
        cy.on('click', 'node', function (evt) {
             let data = this._private.data
             let key = data.id
             let node = coins[key]
             let value = [node["change-usd"],node["price-usd"], node["volume-usd"]]

             if(key in obj_node){
                delete obj_node[key];
             }else{
                 obj_node[key] = value
             }
             let text = "";
             let size_node = Object.keys(obj_node).length;
             if(size_node == 0){
                 text = text.concat("Node")
             }else{
                 for (let i = 0; i < size_node; i++) {
                     let key_obj = Object.keys(obj_node)[i]
                     text = text.concat("<b><u>"+key_obj +"</u></b><br/> change in usd: "+obj_node[key_obj][0]+"<br/> price in usd: "+obj_node[key_obj][1]+"<br/> volume in usd: " +obj_node[key_obj][2]+"<br/> <br/>");
                 }
             }
             document.getElementsByClassName("nodeText")[0].innerHTML = text
        });


        let obj_edge = new Object();
        //let edg = this.exchanges;
        let edg_tot = this.exchanges_total
        cy.on('click', 'edge', function (evt) {
            let source = this._private.data.source
            let target = this._private.data.target
            let key = source+"/"+target;

            if(key in obj_edge){
               delete obj_edge[key];
            }else{
                obj_edge[key] = key
            }

            let text = "";
            let size_edge = Object.keys(obj_edge).length;
            if(size_edge == 0){
                text = text.concat("Source = s <br/> Target = t <br/> Volume = v");
            }else{
                for (let i = 0; i < size_edge; i++) {
                    let key_obj = Object.keys(obj_edge)[i]
                    let res = key_obj.split("/");
                    let s = res[0]
                    let t = res[1]
                    let v = edg_tot[s+"/"+t].volume
                    text = text.concat("Source = <b>" + s + "</b><br/> Target = <b>" + t + "</b><br/> Volume = " + v + "<br/> <br/>");
                }
            }
            document.getElementsByClassName("edgeText")[0].innerHTML = text
        });
        cy.nodes().qtip({
                content: function(){
                    let node = coins[this._private.data['id']]
                    let change = node["change-usd"]
                    let name = node['name']
                    let price = node["price-usd"]
                    let volume = node["volume-usd"]
                    let result = "<b>" +name + "</b> <br/> change in usd: " + change + "<br/> price in usd: " + price + "<br/> volume in usd: " + volume;

                    return result

                },position: {
                    my: 'top right',
                    at: 'bottom center'
                },show: {
                    event: 'mouseover'
                },hide: {
                    event: 'mouseout'
                }
            });

        cy.edges().qtip({
                content: {
                    /*console.log(this._private.data);
                    let s = this._private.data.source;
                    let t = this._private.data.target;
                    let v = edg_tot[s+"/"+t].volume;
                    let result = "Source = " + s + "<br/> Target = " + t + "<br/> Volume = " + v;
                    */
                    text: 'I follow the mouse whilst I\'m visible. Weeeeee!',
                    //console.log("in");

                    //return result

                },position: {
                    //target: this,

                    viewport: ('.egde'),
                    adjust: {
                        method: 'none shift',
                        mouse: true
                    }
                },show: {
                    event: 'mouseover'
                },hide: {
                    event: 'mouseout'
                }/*,style: {
                    left: "200px",
                    top: "200px"
                }*/
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
