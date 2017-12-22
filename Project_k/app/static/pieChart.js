const RCOLORS = [ "#FF6384", "#36A2EB", "#FFCE56", "#FF6375", "#23A2EB", "#F3CE56", "#FFF384", "#36A6EB", "#FFD156"];

class PieChart {

    constructor(id) {
        this.chart = null;
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
    }

    createChart(values, labels) {
        this.resetChart();

        var colors = [];
        values.forEach(function (v) {
            colors.push(RCOLORS[getRandomInt(0, 9)]);
        })


        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data:values,
                    backgroundColor: colors
                }],
                labels: labels
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        display: false,
                    }
                },
                responsive: true,
                legend: {
            display: false
         },
            }
        };

        this.chart = new Chart(this.ctx, config);

        function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min)) + min;
        }
    }

    resetChart() {
        if(this.chart != null) {
            this.chart.destroy();
        }
    }
}
