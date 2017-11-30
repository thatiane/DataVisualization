function accordion(nb_accordion, text, heights) {

    for(let i = 0; i < nb_accordion; i ++){
        let box = "box" + i

        let deploy_scrollBox = d3.select("body")
                                .append("button")
                                    .attr("class", "accordion")
                                    .text(text[i])


        d3.select("body")
            .append("div")
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
            if (panel.style.height != 0 + "px"){
                panel.style.height = 0 + "px";
            } else {
                panel.style.height = heights[i] + "px";
            }
        }
    }
}


function scrollBox_button(idx, graph){
    let w = document.getElementsByClassName("scrollBox")[0].offsetWidth - 30

    let boutons = d3.select("body").selectAll(".box"+idx).append("div")
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
