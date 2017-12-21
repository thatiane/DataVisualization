const SELECT_COLOR = 'rgb(0, 128, 0)';
const DESELECT_COLOR = 'rgb(255, 255, 0)';
const DONE_TEXT = "Done";
const CANCEL_TEXT = "Cancel";

class InteractiveGraph {

    constructor(currencies, exchanges) {
        this.currencies = currencies;
        this.exchanges = exchanges;

        //Initialize graph
        var graph = new Graph(currencies, exchanges);
        graph.showGraph();

        this._init(currencies.map(c=>c['name']), exchanges, false);
    }

    _init(currencies, exchanges, id) {
        var completeCurrencies = this.currencies;

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
                    var chosenNodes = completeCurrencies.filter(x => [].map.call(chosenCurrencies, function (el) {
                        return el.dataset.value
                    }).indexOf(x['name']) != -1);

                    restartGraph(chosenNodes, exchanges);
                });

                return domElement;
            };

            currencies.forEach(currency => list.appendChild(genElem(currency)));
        }

        /*
         * Make the buttons checked
         */
        document.getElementById("reinitialise").click();

        /**
         * Restarts the graph with
         * the chosen currencies
         */
        function restartGraph(currencies, exchanges) {
            const graphElement = document.getElementById("graph");
            graphElement.removeChild(graphElement.getElementsByTagName("g")[0]);
            var g = new Graph(currencies, exchanges);
            g.showGraph();
        }

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
                restartGraph(completeCurrencies, exchanges)
            });

            //Cleans all nodes and marks all nodes as unselected
            const clean = document.getElementById("clean");
            clean.addEventListener("click", function() {
                var eles = document.getElementsByClassName("coin-name");
                [].forEach.call(eles, function (el) {
                    el.style.backgroundColor = DESELECT_COLOR;
                });
                restartGraph([], [])
            });

            //Keeps the text color of the button to white
            const modify = document.getElementById("modify-network");
            modify.addEventListener("click", function() {
               this.style.color = "rgb(255, 255, 255)";
            });
        }
    }
}