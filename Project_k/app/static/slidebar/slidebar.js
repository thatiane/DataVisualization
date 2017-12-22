function slidebar() {

    let deploy_slideBar = d3.select("body")
                            .append("button")
                                .attr("class", "slideBar")
                                .text("Information")

        d3.select("body")
            .append("div")
                .attr("class", "slideBar_box")
                .style("height", 0+"px")

    let slideBars = document.getElementsByClassName("slideBar");
    let acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < slideBars.length; i++) {
        slideBars[i].onclick = function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            let transition = "all 0.8s"
            if (panel.style.height != 0 + "px"){
                panel.style.height = 0 + "px";
                panel.style.transition = transition;
                for (let j = 0; j < acc.length; j++) {
                    if(acc[j].className.includes("active")){
                        acc[j].click()
                    }
                }
            } else {
                panel.style.height = 105 + "px";
                panel.style.transition = transition;
            }
        }
    }

}
