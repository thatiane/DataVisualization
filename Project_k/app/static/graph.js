class Graph {

    constructor(currencies, exchanges) {
        this.currencies = currencies;
        this.exchanges = exchanges;
        this.currencieIds = [];
        this.removedNodes = [];
        this.removedEdges = [];

    }


    showGraph() {
        var div = document.getElementById("graph");
        var acc_width = document.getElementsByClassName("accordion")[0].offsetWidth
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.left = "0";
        div.style.top = "0";
        div.style.paddingLeft = "0px"//acc_width + 10 + "px";
        div.style.position = "fixed";
        div.style.zIndex = "-1";


        cy = window.cy = cytoscape({
            container: div,

            layout: {
                name: 'cose'
               // padding: 10
            },

            style: cytoscape.stylesheet()
                .selector('node')
                .style({
                    'shape': 'ellipse',
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'text-outline-width': 1,
                    'text-outline-color': '#afb1b0',
                    'background-color': '#afb1b0',
                    'color': '#fff'
                })
                .selector(':selected')
                .style({
                    'border-width': 2,
                    'border-color': '#525453'
                })
                .selector('edge')
                .style({
                    'opacity': 0.666,
                    'width': 'data(strength)',
                    'line-color': 'data(faveColor)',
                    'target-arrow-shape': 'triangle'
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
        let obj_node = new Object();
        cy.on('click', 'node', function (evt) {
             let data = this._private.data
             let key = data.name
             let value = [data["change-usd"],data["price-usd"], data["volume-usd"]]

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
        cy.on('click', 'edge', function (evt) {
            let source = this._private.data.source
            let target = this._private.data.target
            let key = source+"_"+target;

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
                    let res = key_obj.split("_");
                    let s = res[0]
                    let t = res[1]
                    text = text.concat("Source = <b>" + s + "</b><br/> Target = <b>" + t + "</b><br/> Volume = " + "v" + "<br/> <br/>");
                }
            }
            document.getElementsByClassName("edgeText")[0].innerHTML = text
        });
        cy.on('mouseover', 'node', function (evt) {
            console.log("text");
        });
        cy.on('mouseout', 'node', function (evt) {
            console.log("text2");
        });
        cy.on('mouseover', 'edge', function (evt) {
            console.log("text");
        });
        cy.on('mouseout', 'edge', function (evt) {
            console.log("text2");
        });
    }

    _setNodes() {
        var result = [];

        for(let i=0; i<this.currencies.length; i++) {
            result.push({data: this.currencies[i]});
            //Keep track of existing nodes
            this.currencieIds.push(this.currencies[i]['id']);
        }

        return result
    }

    _setEdges() {
        var result = [];

        for (let i = 0; i < this.exchanges.length; i++) {
            for (let j = 0; j < this.exchanges[i].length; j++) {
                var pair = this.exchanges[i][j]['pair'].split("/");

                //Set edges only between existing nodes
                if(this.currencieIds.includes(pair[0]) && this.currencieIds.includes(pair[1])) {
                    result.push({data: {source: pair[0], target: pair[1], faveColor: '#6FB1FC', strength: 1}});
                }
            }
        }

        return result
    }

    removeNode(id) {
        var ns = []
        var es = []
        cy.nodes().forEach(function (node) {
            if ((node.data('id') === id)) {
                ns.push(node);

            }
        });

        cy.edges().forEach(function (edge) {
            if ((edge.data('source') === id) || (edge.data('target') === id)) {
                es.push(edge);

            }
        });

        for (let i = 0; i < ns.length; i++) {
            this.removedNodes.push(ns[i]);
        }

        for (let i = 0; i < es.length; i++) {
            this.removedEdges.push(es[i]);
        }

        var index = this.currencieIds.indexOf(id);
        if (index > -1) {
            this.currencieIds.splice(index, 0);
        }

        cy.remove("#"+id);
    }

    addNode(id) {
        for (let i = 0; i < this.removedNodes.length; i++) {
            var node = this.removedNodes[i];
            if(node.data("id") === id) {
                cy.add(node);
                this.currencieIds.push(id);
            }
        }

        for (let i = 0; i < this.removedEdges.length; i++) {
             var edge = this.removedEdges[i];
             var source_id = edge.data('source');
             var target_id = edge.data('target');

            if((source_id === id) || (target_id === id)) {
                //console.log(source_id);
                //console.log(target_id);

                if(this.currencieIds.includes(source_id) && this.currencieIds.includes(target_id)) {
                    cy.add(edge);
                }
            }
        }

    }
}
