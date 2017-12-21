const COLORS = window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};
const COLOR_NAMES = Object.keys(COLORS);

class DataChart {
	constructor(id, { mode }) {
  	this.mode = mode;
  	this.chart = null;
    this.canvas = document.getElementById(id);

    this.ctx = this.canvas.getContext("2d");
    this.dataset = {
      datasets: [],
      labels: []
    };
  }
  
  createChart() {
  	const formatMoney = (value, index, values) => '$' + value.toFixed(2)
  	const formatIdentity = (value, index, values) => value;
    
  	this.chart = new Chart(this.ctx, {
      type: this.mode,
      data: this.dataset,
      options: {
        plugins: {
          datalabels: {
            color: 'white',
            display: false,
            font: {
              weight: 'bold'
            },
            formatter: Math.round
          }
        },
        categoryPercentage: 1.5,
        barPercentage: 1.5,
        gridLines: {
        	offsetGridLines: false,
        },
        scales :{
        	xAxes: [{
            ticks: {
                display: this.mode === "bar",
                beginAtZero : true,
              minRotation: this.mode === "horizontalBar" ? 0 : 90,
              maxRotation: this.mode === "horizontalBar" ? 50 : 90,
              callback: this.mode == "horizontalBar"
              	? formatMoney
                : formatIdentity
            },
                categoryPercentage: 1.0,
            barPercentage: 0.8,
            gridLines: { display: false }
          }],
          yAxes: [{
          	ticks: {
                display: this.mode === "horizontalBar",

            	beginAtZero : true,
              callback: this.mode === "horizontalBar" 
              	? formatIdentity
                : formatMoney
            },
          	categoryPercentage: 1.0,
            barPercentage: 0.8,
            gridLines: { display: false}
          }]
        },
        elements: {
          rectangle: {
            borderWidth: 2,
          }
        },
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
        	enabled: false
        }
      }
    });
    
    const key = this.mode === "horizontalBar"
        	? "height"
          : "width";

    if(this.mode === "horizontalBar") {
        this.chart.canvas.parentNode.style["width"] = '300px';

    } else {
        this.chart.canvas.parentNode.style["height"] = '300px';
    }

        this.hasChart = true;
  }
  
  destroyChart() {
  	this.chart.destroy();
    this.hasChart = false;
  }
  
  computeHeight(x) {
  	return (x * 50) + "px";
  }
  
  addDataset(label, value) {
      if(this.dataset.labels.indexOf(label) === -1) {
 		const currenciesDisplayed = this.dataset.datasets.length;
 
 		if(this.hasChart) {
    		const key = this.mode === "horizontalBar"
        	? "height"
          : "width";
          
        this.chart.canvas.parentNode.style[key] = this.computeHeight(currenciesDisplayed + 1);
      	this.chart.resize();
        }
 
        const colorName = COLOR_NAMES[currenciesDisplayed % COLOR_NAMES.length];
        const datasetColor = COLORS[colorName];


        const newDataset = {
            label: label,
            backgroundColor: Chart.helpers.color(datasetColor).alpha(0.5).rgbString(),
            borderColor: datasetColor,
            data: [value],
            datalabels: {
                anchor: 'end',
                align: 'start',
            }
        };

        this.dataset.datasets.push(newDataset);
        this.dataset.labels.push(label);
        this.updateChart();
    }
  }
  
  resetChart() {
  	this.dataset.datasets = [];
    this.dataset.labels = [];
    this.updateChart();
  }
  
    updateChart() {
    const hasDatasetsToDisplay = this.dataset.datasets.length > 0;
        const hasChart = this.hasChart;

        if(hasDatasetsToDisplay) {
        if(!hasChart)
            this.createChart();
            this.chart.update()
        }
        else if(!hasDatasetsToDisplay && hasChart) {
            this.destroyChart();
        }
    }
}