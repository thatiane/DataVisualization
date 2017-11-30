function accordion(nb_accordion, text) {

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
                panel.style.height = 520 + "px";
            }
        }
    }
}
