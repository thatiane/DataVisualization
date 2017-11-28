function scrollBox(data_, graph) {
    let w = 155

    let deploy_scrollBox = d3.select("body")
                            .append("button")
                                .attr("class", "accordion")
                                .text("Select Nodes")
                                .on("click", ()=>{
                                    if(box._groups[0][0].style.height == "" || box._groups[0][0].style.height == "0px"){
                                        box._groups[0][0].style.height = 520 + "px"
                                    }else{
                                        box._groups[0][0].style.height = 0 + "px"
                                    }
                                })

    let box = d3.select("body")
                .append("div")
                    .attr("class", "box")

    let scrollBox = box.append("div")
                    .attr("class", "scrollBox")
                    .attr("style", "outline: 3px solid black;")

    let nameBox = scrollBox.selectAll("div")
                    .data(data_)
                    .enter()
                    .append("div")
                    .attr("class", "nameBox")
                    .attr("height", 24)
                    .attr("width", 25)
                    //.attr("transform", (d,i) => "translate(3,"+0.2*i+")");

    let svg = nameBox.append("svg")
                        .attr("class", "row")
                        .attr("height", 24)
                        .attr("width", w - 35);

    let rect = svg.append('rect')
                    .attr("height", 24)
                    .attr("width", w - 35)
                    .attr("rx", 3)
                    .attr("ry", 3)
                    .attr("fill-opacity", 0.25)
                    .attr("stroke", "#999999")
                    .attr("stroke-width", "2px")
                    .attr("fill", "#1f77b4");

    let text = svg.append('text')
                    .text((d) => d[1])
                    .attr("transform","translate(10,15)");

    let inp = nameBox.append("input")
                    .attr("type","checkbox")
                    .attr("class", "check")
                    .attr("value", (d) => d[0])
                    .on("change",function() {
                        var checked = this.checked;
                        var value = (this.value);
                        if(checked) {
                            graph.addNode(value);
                        }
                         else {
                            graph.removeNode(value);
                        }
                    })
                    .attr("checked", true);


    let boutons = box.append("div")
                    .attr("class", "boutons")
                    .attr("height", 100)
                    .attr("width", w)

    let check_all = boutons.append("button")
                    .attr("class", "bouton_check")
                    .on("click", () => {
                        let list_to_check = document.getElementsByClassName("check");
                        for(let i =0; i<list_to_check.length; i++){
                            list_to_check[i].checked = true;
                            graph.addNode( list_to_check[i].value);
                        }
                    })
                    .text("Check All")

    let uncheck_all = boutons.append("button")
                        .attr("class", "bouton_uncheck")
                        .on("click", () => {
                            let list_to_check = document.getElementsByClassName("check");
                            for(let i =0; i<list_to_check.length; i++){
                                list_to_check[i].checked = false;
                                graph.removeNode( list_to_check[i].value);
                            }
                        })
                        .text("Uncheck All")

}
