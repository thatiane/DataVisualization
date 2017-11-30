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
