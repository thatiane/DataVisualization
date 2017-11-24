
function showGraph(data) {

    var yourDiv = document.getElementById("graph")
    yourDiv.style.left = 0;
    yourDiv.style.top = 0;
    yourDiv.style.width = "100%";
    yourDiv.style.height = "100%";
    yourDiv.style.position = "absolute";

    var cy = cytoscape({
        container: yourDiv,

        layout: {
            name: 'cose',
            padding: 10
        },

        style: cytoscape.stylesheet()
            .selector('node')
            .style({
                'shape': 'data(faveShape)',
                'content': 'data(name)',
                'text-valign': 'center',
                'text-outline-width': 1,
                'text-outline-color': 'data(faveColor)',
                'background-color': 'data(faveColor)',
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
             //   'width': 'mapData(strength, 70, 100, 2, 6)',
                'width': 'data(strength)',
                'target-arrow-shape': 'triangle',
                'source-arrow-shape': 'circle',
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
            nodes: nodes([]),

            edges: [
                {data: {source: 'j', target: 'e', faveColor: '#6FB1FC', strength: 10}},
                {data: {source: 'j', target: 'k', faveColor: '#6FB1FC', strength: 4}},
                {data: {source: 'j', target: 'g', faveColor: '#6FB1FC', strength: 1}},
                {data: {source: 'e', target: 'k', faveColor: '#EDA1ED', strength: 1}},
                {data: {source: 'k', target: 'g', faveColor: '#86B342', strength: 3}},
            ]
        }
    });
}

function nodes(data) {
    //TODO : work with real data
    var result = [
                {data: {id: 'j', name: 'Jerry', weight: 20, faveColor: '#6FB1FC', faveShape: 'ellipse'}},
                {data: {id: 'e', name: 'Elaine', weight: 20, faveColor: '#EDA1ED', faveShape: 'ellipse'}},
                {data: {id: 'k', name: 'Kramer', weight: 20, faveColor: '#86B342', faveShape: 'ellipse'}},
                {data: {id: 'g', name: 'George', weight: 20, faveColor: '#F5A45D', faveShape: 'ellipse'}}
            ]
    return result
}


