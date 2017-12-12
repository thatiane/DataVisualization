class Heatmap {

    constructor(currencies_dict, exchanges_dict, exchanges_total_dict) {
        this.currencies = currencies_dict;
        this.exchanges = exchanges_dict;
        this.exchanges_total = exchanges_total_dict;
    }

    showHeatmap() {

        var xValues = []
        var zValues = []

        var count = 0;
        for(var key1 in this.currencies) {
            xValues.push(key1);
            var values = [];
            for(var key2 in this.currencies) {
                var pair = key1 + '/' + key2;
                var edge = this.exchanges_total[pair];
                if(typeof edge != "undefined") {
                    count += 1;
                    values.push(Math.log(parseFloat(edge["volume"])));
                } else {
                    values.push(0);
                }
            }
            zValues.push(values);
        }

        console.log(count);

        var data = [{
          x: xValues,
          y: xValues,
          z: zValues,
          type: 'heatmap',
          colorscale: [['0.0', 'rgb(255, 255, 255)'],
                       ['5.0', 'rgb(215,48,39)'],
                       ['20.0', 'rgb(0, 0, 0)']]

        }];

        var layout = {
          annotations: [],
          xaxis: {
            ticks: '',
            side: 'top',
              autosize: false
          },
          yaxis: {
            ticks: '',
            side: 'top',

            autosize: false
          }
        };


        Plotly.newPlot('myDiv', data, layout);

        var myPlot = document.getElementById('myDiv');

            myPlot.on('plotly_click', function(data){
            for(var i=0; i < data.points.length; i++){
                //Do anything with clicked

                var annotate_text = 'x = '+data.points[i].x +
                              'y = '+data.points[i].y;

                console.log(annotate_text);
            }
        });
    }
}