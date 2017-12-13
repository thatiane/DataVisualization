class Heatmap {

    constructor(currencies_dict, exchanges_dict, exchanges_total_dict) {
        this.currencies = currencies_dict;
        this.exchanges = exchanges_dict;
        this.exchanges_total = exchanges_total_dict;
    }

    showHeatmap() {

        var xValues = []
        var yValues = []

        var zValues = []
        var coinInfo = [];

        var count = 0;
        var visited = [];
        var visited2 = [];

        for(var key1 in this.currencies) {
            xValues.push(key1);
            yValues.push(key1);
            var values = [];
            var cInfo = [];
            visited.push(key1);
            for(var key2 in this.currencies) {
                var pair = key1 + '/' + key2;
                var edge = this.exchanges_total[pair];
                var v = NaN;
                if(isDefined(edge)) {
                    count += 1;
                    v = (parseFloat(edge["volume"]));
                }

                if(visited.includes(key2)) {
                    values.push(undefined);
                } else {
                    values.push(Math.log(v));
                }

                if(isNaN(v)) {
                    v = 0;
                }

                var text = "Coin: " + this.currencies[key1]['name'] + "<br> Coin: "  + this.currencies[key2]['name']  + "<br> Volume: " + v;
                cInfo.push(text);
            }
            coinInfo.push(cInfo);
            zValues.push(values);
        }

        var data = [{
          x: xValues,
          y: yValues,
          z: zValues,
          mode: 'markers',
          marker: {size:16},
          text: coinInfo,
          hoverinfo: 'text',
          type: 'heatmap',
          colorscale: [['0.0', 'rgb(255, 255, 255)'],
                       ['5.0', 'rgb(215,48,39)'],
                       ['20.0', 'rgb(0, 0, 0)']],
          showscale: false
        }];

        var layout = {
          xaxis: {
            ticks: '',
            showgrid: false,
            side: 'top',
            autosize: false,
            autorange: "reversed"
          },
          yaxis: {
            autosize: false,
              autorange: "reversed",
              showgrid: false
          }
        };

        Plotly.newPlot('myDiv', data, layout);

        var myPlot = document.getElementById('myDiv');

        myPlot.on('plotly_click', function(data){
            for(var i=0; i < data.points.length; i++){
                //Do anything with clicked
                 if(isDefined(data.points[i].z)) {
                     var text = 'x = ' + data.points[i].x +
                         'y = ' + data.points[i].y;
                 }
            }
        });

        var dragLayer = document.getElementsByClassName('nsewdrag')[0];
        myPlot.on('plotly_hover', function(data){
             for(var i=0; i < data.points.length; i++){
                 if(isDefined(data.points[i].z)) {
                     dragLayer.style.cursor = 'pointer'
                 } else {
                    dragLayer.style.cursor = 'default'
                    Plotly.Fx.hover('myDiv',[ ]);
                 }
            }
        });
    }
}