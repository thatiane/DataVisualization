class ScrollBox {
    constructor(idx, box_height, bool_node) {
        this.idx = idx;
        this.box_height = box_height
        this.bool_node = bool_node;
    }

    showScrollBox(bool_bouton, bool_node = false) {
        let scrollBox = d3.select("body").selectAll(".box"+this.idx).append("div")
                        .attr("class", "scrollBox")
                        .style("outline", "3px solid black")
                        .style("height", this.box_height-5 + "px")

        let text = ""

        let box_text = scrollBox.append("text")

        if(this.bool_node){
            box_text = box_text.attr("class", "nodeText")
            text = "Node"
        }else{
            box_text = box_text.attr("class", "edgeText")
            text = "Source = s <br/> Target = t <br/> Volume = v"
        }
        box_text.html(text)
    }
}

class ScrollBoxBouton extends ScrollBox{


    constructor(data_, idx, box_height, graph, check_name) {
        super(idx, box_height, false);
        this.data_ = data_;
        this.graph = graph;
        this.check_name = check_name;

    }
    showScrollBoxBouton(){
        let scrollBox = d3.select("body").selectAll(".box"+this.idx).append("div")
                        .attr("class", "scrollBox")
                        .style("outline", "3px solid black")
                        .style("height", this.box_height-20 + "px")

        let nameBox = scrollBox.selectAll("div")
                        .data(this.data_)
                        .enter()
                        .append("div")
                        .attr("class", "nameBox")

        let wRect = document.getElementsByClassName("scrollBox")[0].offsetWidth - 30

        let svg = nameBox.append("svg")
                            .attr("class", "row")
                            .attr("height", 24)
                            .attr("width", wRect);

        let rect = svg.append('rect')
                        .attr("height", 24)
                        .attr("width", wRect)
                        .attr("rx", 3)
                        .attr("ry", 3)
                        .style("fill-opacity", 0.25)
                        .style("stroke", "#999999")
                        .style("stroke-width", "2px")
                        .style("fill", "#1f77b4");

        let text = svg.append('text')
                        .text((d) => d[1])
                        .attr("transform","translate(5,15)");

        nameBox.append("input")
                .attr("type","checkbox")
                .attr("class", this.check_name)
                .attr("value", (d) => d[0])
                .attr("checked", true);

        scrollBox_button(this.idx, this.graph, this.check_name);
    }

    clickNode(){
        let inp = document.getElementsByClassName(this.check_name)
        let graph = this.graph
        for (let i = 0; i < inp.length; i++) {
            inp[i].onclick = function() {
                let checked = this.checked;
                let value = this.value;
                if(checked) {
                    graph.addNode(value);
                }
                 else {
                    graph.removeNode(value);
                }
            }
        }
    }
    clickMarket(){
        let inp = document.getElementsByClassName(this.check_name)
        let graph = this.graph
        for (let i = 0; i < inp.length; i++) {
            inp[i].onclick = function() {
                let checked = this.checked;
                let value = this.value;
                let ex = graph.exchanges
                let keys = Object.keys(ex)
                if(checked) {
                    for (let j = 0; j < keys.length; j++) {
                        if(keys[j].includes(value)){
                            let key = keys[j]
                            let pair = ex[key].pair
                            let s_t = pair.split("/");
                            let nb_of_actif_market = 0

                            for (var k = 0; k < s_t.length; k++) {
                                graph.node_markets[s_t[k]][value] = true
                                let markets_keys = Object.keys(graph.node_markets[s_t[k]])
                                nb_of_actif_market = 0

                                for (let l = 0; l < markets_keys.length; l++) {
                                    if(graph.node_markets[s_t[k]][markets_keys[l]]){
                                        nb_of_actif_market += 1;
                                    }
                                }
                                if(nb_of_actif_market == 1){
                                    graph.addNode(s_t[k]);
                                }
                            }
                        }
                    }
                }else {
                    for (let j = 0; j < keys.length; j++) {
                        if(keys[j].includes(value)){
                            let key = keys[j]
                            let pair = ex[key].pair
                            let s_t = pair.split("/");
                            let nb_of_actif_market = 0

                            for (var k = 0; k < s_t.length; k++) {
                                graph.node_markets[s_t[k]][value] = false
                                let markets_keys = Object.keys(graph.node_markets[s_t[k]])
                                nb_of_actif_market = 0

                                for (let l = 0; l < markets_keys.length; l++) {
                                    if(graph.node_markets[s_t[k]][markets_keys[l]]){
                                        nb_of_actif_market += 1;
                                    }
                                }
                                if(nb_of_actif_market < 1){
                                    graph.removeNode(s_t[k]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
