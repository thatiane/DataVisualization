function accordion(nb_accordion, text, heights) {

    for(let i = 0; i < nb_accordion; i ++){
        let box = "box" + i

        let insidebox = d3.select("body").selectAll(".slideBar_box")

        let deploy_scrollBox = insidebox.append("button")
                                    .attr("class", "accordion")
                                    .text(text[i])


        insidebox.append("div")
                .attr("class", box)
                .style("width", 160+"px")
                .style("height", 0+"px")
                .style("overflow", "hidden")
                .style("padding-left", 10+"px")
                .style("padding-right", 10+"px");
    }


    let acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            let parent = this.parentElement
            let transition = "all 0.8s"
            if (panel.style.height != 0 + "px"){
                panel.style.height = 0 + "px";
                panel.style.transition = transition;
                this.parentElement.style.height = parseInt(parent.style.height) - heights[i] + "px";
            } else {
                panel.style.height = heights[i] + "px";
                panel.style.transition = transition;
                this.parentElement.style.height = parseInt(parent.style.height) + heights[i] + "px";
            }
        }
    }
}


function scrollBox_button(idx, graph, check_name){

    let boutons = d3.select("body").selectAll(".box"+idx).append("div")
                    .attr("class", "boutons")
                    .style("background-color", "White")

    let check_all = boutons.append("button")
                    .attr("class", "bouton_check")
                    .on("click", () => {
                        let list_to_check = document.getElementsByClassName(check_name);
                        for(let i =0; i<list_to_check.length; i++){
                            list_to_check[i].checked = true;
                            if(check_name == "checkNode"){
                                graph.addNode(list_to_check[i].value);
                            }else{
                                let keys = Object.keys(graph.node_markets)
                                for (let j = 0; j < keys.length; j++) {
                                    graph.node_markets[keys[j]][list_to_check[i].value] = true
                                }
                            }
                        }
                        if(check_name == "checkMarket"){
                            let keys = Object.keys(graph.node_markets)
                            for (let j = 0; j < keys.length; j++) {
                                let key = keys[j]
                                graph.addNode(key);
                            }
                        }
                    })
                    .text("Check All")

    let uncheck_all = boutons.append("button")
                        .attr("class", "bouton_uncheck")
                        .on("click", () => {
                            let list_to_check = document.getElementsByClassName(check_name);
                            for(let i =0; i<list_to_check.length; i++){
                                list_to_check[i].checked = false;
                                if(check_name == "checkNode"){
                                    graph.removeNode( list_to_check[i].value);
                                }else{
                                    let keys = Object.keys(graph.node_markets)
                                    for (let j = 0; j < keys.length; j++) {
                                        graph.node_markets[keys[j]][list_to_check[i].value] = false
                                    }
                                }
                            }
                            if(check_name == "checkMarket"){
                                let keys = Object.keys(graph.node_markets)
                                for (let j = 0; j < keys.length; j++) {
                                    let key = keys[j]
                                    graph.removeNode(key);
                                }
                            }
                            let node_text = "Node";
                            document.getElementsByClassName("nodeText")[0].innerHTML = node_text;
                            let edge_text = "Source = s <br/> Target = t <br/> Volume = v";
                            document.getElementsByClassName("edgeText")[0].innerHTML = edge_text;
                        })
                        .text("Uncheck All")
}
