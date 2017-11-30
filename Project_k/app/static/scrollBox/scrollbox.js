function scrollBox(data_,idx, graph) {

    let scrollBox = d3.select("body").selectAll(".box"+idx).append("div")
                    .attr("class", "scrollBox")
                    .attr("style", "outline: 3px solid black;")

    let nameBox = scrollBox.selectAll("div")
                    .data(data_)
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

    let inp = nameBox.append("input")
                    .attr("type","checkbox")
                    .attr("class", "check")
                    .attr("value", (d) => d[0])
                    .on("change",function() {
                        let checked = this.checked;
                        let value = (this.value);
                        if(checked) {
                            graph.addNode(value);
                        }
                         else {
                            graph.removeNode(value);
                        }
                    })
                    .attr("checked", true);
}

function scrollBoxNode(idx) {


    let scrollBox = d3.select("body").selectAll(".box"+idx).append("div")
                    .attr("class", "scrollBox")
                    .attr("style", "outline: 3px solid black;");

    let text = scrollBox.append("text")
                            .attr("class", "nodeText")
                            .style("height", "200px")
                            .text("Node")

}

function scrollBoxEdge(idx) {


    let scrollBox = d3.select("body").selectAll(".box"+idx).append("div")
                    .attr("class", "scrollBox")
                    .attr("style", "outline: 3px solid black;");

    scrollBox.append("text")
                .attr("class", "edgeText")
                .style("height", "200px")
                .html("Source = s <br/> Target = t <br/> Volume = v")


}
