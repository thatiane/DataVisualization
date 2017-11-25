class Graph {

    constructor(currencies, exchanges) {
        this.currencies = currencies;
        this.exchanges = exchanges;
    }


    showGraph() {
        var yourDiv = document.getElementById("graph")
        yourDiv.style.width = "80%";
        yourDiv.style.height = "90%";
        yourDiv.style.left = "10%";
        yourDiv.style.top = "15px";
        yourDiv.style.position = "absolute";
        yourDiv.style.border = "solid";



        this.cy = cytoscape({
            container: yourDiv,

            layout: {
                name: 'cose',
                padding: 10
            },

            style: cytoscape.stylesheet()
                .selector('node')
                .style({
                    'shape': 'ellipse',
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'text-outline-width': 1,
                    'text-outline-color': '#afb1b0',
                    'background-color': '#afb1b0',
                    'color': '#fff'
                })
                .selector(':selected')
                .style({
                    'border-width': 2,
                    'border-color': '#525453'
                })
                .selector('edge')
                .style({
                    'opacity': 0.666,
                    'width': 'data(strength)',
                    'line-color': 'data(faveColor)',
                    'source-arrow-color': 'data(faveColor)',
                    'target-arrow-color': 'data(faveColor)'
                })
                .selector(':selected')
                .style({
                    'border-width': 2,
                    'border-color': '#525453'
                }),

            elements: {
                nodes: this._setNodes(),
               // edges: this._setEdges()
            }
        });
    }

    _setNodes() {
        var result = []

        for(let i=0; i<this.currencies.length; i++) {
            result.push({data: {id: this.currencies[i]}});
        }

        return result
    }

    _setEdges() {
        var result = [
                    {data: {source: 'j', target: 'e', faveColor: '#6FB1FC', strength: 10}},
                    {data: {source: 'j', target: 'k', faveColor: '#6FB1FC', strength: 4}},
                    {data: {source: 'j', target: 'g', faveColor: '#6FB1FC', strength: 1}},
                    {data: {source: 'e', target: 'k', faveColor: '#EDA1ED', strength: 1}},
                    {data: {source: 'k', target: 'g', faveColor: '#86B342', strength: 3}},
                ]
        return result
    }

}