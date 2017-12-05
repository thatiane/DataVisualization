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
        inp.onclick = function() {
            let checked = this.checked;
            let value = this.value;
            console.log(value);
            if(checked) {
                // change value for market here too
                //graph.addNode(value);
                console.log(value);
            }
             else {
                //graph.removeNode(value);
                console.log(value);
            }
        }
    }
}
