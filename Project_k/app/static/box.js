function myFunction() {
    console.log("fonctionne");
}

function ScorllBox(data) {
    var colorScale = d3.scale.category20();

        var scrollSVG = d3.select(".viewport").append("svg")
            .attr("position", "absolute")
            .attr("top", 15)
            .attr("left", 15)
            .attr("background-color", "#e8e8e8")
            .attr("border", "1px solid #AAAAAA")
            .attr("border-radius", 4)
            .attr("box-shadow", "inset 1px 1px 6px 2px rgba(0,0,0, .25)")
            .attr("class", "scroll-svg");

        var defs = scrollSVG.insert("defs", ":first-child");

        createFilters(defs);

        var chartGroup = scrollSVG.append("g")
            .attr("class", "chartGroup")
            //.attr("filter", "url(#dropShadow1)"); // sometimes causes issues in chrome

        chartGroup.append("rect")
            .attr("fill", "#FFFFFF");

        var rowEnter = function(rowSelection) {
            rowSelection.append("rect")
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("width", "150")
                .attr("height", "24")
                .attr("fill-opacity", 0.25)
                .attr("stroke", "#999999")
                .attr("stroke-width", "2px");
            rowSelection.append("text")
                .attr("transform", "translate(10,15)");
        };
        var rowUpdate = function(rowSelection) {
            rowSelection.select("rect")
                .attr("fill", function(d) {
                    return colorScale(d.id);
                });
            rowSelection.select("text")
                .text(function (d,i) {
                    //return (i + 1) + ". " + d;
                    return d;
                });
        };

        var rowExit = function(rowSelection) {
        };

        var virtualScroller = d3.VirtualScroller()
            .rowHeight(30)
            .enter(rowEnter)
            .update(rowUpdate)
            .exit(rowExit)
            .svg(scrollSVG)
            .totalRows(50)
            .viewport(d3.select(".viewport"));

        virtualScroller.data(data, function(d) {return d; });

        chartGroup.call(virtualScroller);

        function createFilters(svgDefs) {
            var filter = svgDefs.append("svg:filter")
                .attr("id", "dropShadow1")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "200%")
                .attr("height", "200%");

            filter.append("svg:feOffset")
                .attr("result", "offOut")
                .attr("in", "SourceAlpha")
                .attr("dx", "1")
                .attr("dy", "1");

            filter.append("svg:feColorMatrix")
                .attr("result", "matrixOut")
                .attr("in", "offOut")
                .attr("type", "matrix")
                .attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.2 0");

            filter.append("svg:feGaussianBlur")
                .attr("result", "blurOut")
                .attr("in", "matrixOut")
                .attr("stdDeviation", "1");

            filter.append("svg:feBlend")
                .attr("in", "SourceGraphic")
                .attr("in2", "blurOut")
                .attr("mode", "normal");
        }
}
