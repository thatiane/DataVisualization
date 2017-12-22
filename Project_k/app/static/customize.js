const SELECT_COLOR = 'rgba(139, 147, 167, 0.29)';
const DESELECT_COLOR = 'rgba(240, 241, 244, 0.29)';

class InteractiveGraph {

    constructor(currencies, exchanges) {
        this.currencies = currencies;
        this.exchanges = exchanges;

        //Initialize graph
        this.graph = new Graph(currencies, exchanges);
        this.graph.showGraph();
        this.graph.addAllToCharts();

        this._init(this.currencies, this.exchanges, this.graph);
    }

    _init(currencies, exchanges, graph) {
        const currencyNames = currencies.map(x=>x['name']);

        setOnClickListeners();
        setExpandableList();

        function setExpandableList() {
            const button = document.getElementById("modify-network");
            const list = document.getElementById(button.getAttribute("href").substr(1));

            const genElem = function (label) {
                var domElement = document.createElement("div");
                var text = document.createTextNode(label);
                domElement.appendChild(text);
                domElement.setAttribute("class", "coin-name");
                domElement.setAttribute("data-value", label);

                //Add on click listener
                domElement.addEventListener("click", function () {
                    var computedStyle = window.getComputedStyle(domElement, null);
                    var color = computedStyle['background-color'];
                    if (computedStyle['background-color'] === DESELECT_COLOR) {
                        domElement.style.backgroundColor = SELECT_COLOR;
                    } else if (computedStyle['background-color'] === SELECT_COLOR) {
                        domElement.style.backgroundColor = DESELECT_COLOR;
                    }

                    var eles = document.getElementsByClassName("coin-name");
                    var chosenCurrencies = [].filter.call(eles, function (x) {
                        return x.style.backgroundColor == SELECT_COLOR
                    });
                    var chosenNodes = currencies.filter(x => [].map.call(chosenCurrencies, function (el) {
                        return el.dataset.value
                    }).indexOf(x['name']) != -1);

                    graph.restartGraph(chosenNodes, exchanges);
                });

                return domElement;
            };

            currencyNames.forEach(currency => list.appendChild(genElem(currency)));
        }

        /*
         * Make the buttons checked
         */
        //document.getElementById("reinitialise").click();
        var eles = document.getElementsByClassName("coin-name");
        [].forEach.call(eles, function (el) {
            el.style.backgroundColor = SELECT_COLOR;
        });

        /**
         * Set on click listeners for the
         * three buttons in the UI
         *
         */
        function setOnClickListeners() {
            // reinitialize the graph with all currencies
            // and marks all nodes as selected
            const reinitialize = document.getElementById("reinitialise");
            reinitialize.addEventListener("click", function() {
                var eles = document.getElementsByClassName("coin-name");
                [].forEach.call(eles, function (el) {
                    el.style.backgroundColor = SELECT_COLOR;
                });
                graph.restartGraph(currencies, exchanges)
            });

            //Cleans all nodes and marks all nodes as unselected
            const clean = document.getElementById("clean");
            clean.addEventListener("click", function() {
                var eles = document.getElementsByClassName("coin-name");
                [].forEach.call(eles, function (el) {
                    el.style.backgroundColor = DESELECT_COLOR;
                });

                graph.restartGraph([], []);
            });

            //Keeps the text color of the button to white
            const modify = document.getElementById("modify-network");
            modify.addEventListener("click", function() {
               this.style.color = "rgb(255, 255, 255)";
            });
        }
    }
}