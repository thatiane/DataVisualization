const SELECT_COLOR = 'rgb(0, 128, 0)';
const DESELECT_COLOR = 'rgb(255, 255, 0)';
const DONE_TEXT = "Done";
const CANCEL_TEXT = "Cancel";

class InteractiveGraph {

    constructor(currencies, exchanges) {
        this.currencies = currencies;
        this.exchanges = exchanges;
        this.graph = new Graph(currencies, exchanges);
        this.graph.showGraph();

        //Generate the expandable list
        this._generateExpandableList(currencies.map(c=>c['name']), exchanges, "make-network", false);
        this._generateExpandableList(currencies.map(c=>c['name']), exchanges, "modify-network", true);
    }

    _generateExpandableList(currencies, exchanges, id, modify) {
        const reinitialize = document.getElementById("reinitialise");
        var g = this.graph;
        var curr = this.currencies;
        reinitialize.addEventListener("click", function() {
            g.cleanGraph();
            g = new Graph(curr, exchanges);
            g.showGraph();
        });

        this.graph = g;

        const button = document.getElementById(id)
        const list = document.getElementById(button.getAttribute("href").substr(1));

        const genElem = function(label)  {
            var domElement = document.createElement("div");
            var text = document.createTextNode(label);
            domElement.appendChild(text);
            domElement.setAttribute("class", "coin-name");
            domElement.setAttribute("data-value", label);
            if(modify) {
                if(g.currencies.map(x=>x.name).indexOf(label) != -1) {
                    domElement.setAttribute("style", "background-color: " + SELECT_COLOR);
                }
            }

            //Add on click listener
            domElement.addEventListener("click", function() {
                var computedStyle = window.getComputedStyle(domElement, null);
                var color = computedStyle['background-color'];
                if(computedStyle['background-color'] === DESELECT_COLOR) {
                    domElement.style.backgroundColor = SELECT_COLOR;
                } else if (computedStyle['background-color'] === SELECT_COLOR) {
                    domElement.style.backgroundColor = DESELECT_COLOR;
                }
            });

            return domElement;
        };

        currencies.forEach(currency => list.appendChild(genElem(currency)));

        //Add Done and Cancel buttons
        this._generateCancelButton(list, button);
        this._generateDoneButton(list, button, modify);
    }

    _generateCancelButton(list, button) {

         //Add cancel button at the end of the list
        var domElement = document.createElement("div");
        var text = document.createTextNode(CANCEL_TEXT);
        domElement.appendChild(text);
        domElement.setAttribute("class", "btn btn-info");
        domElement.addEventListener("click", cancel);

        function cancel() {
            const eles = document.getElementsByClassName("coin-name");
            [].forEach.call(eles, function (el) {el.style.backgroundColor = DESELECT_COLOR;});
            button.click();
        }

        list.appendChild(domElement);
    }

    _generateDoneButton(list, button, modify) {
        //Add done button at the end of the list
        var domElement = document.createElement("div");
        var text = document.createTextNode(DONE_TEXT);
        domElement.appendChild(text);
        domElement.setAttribute("class", "btn btn-info");
        domElement.addEventListener("click", done);

        var currencies = this.currencies;
        var exchanges = this.exchanges;
        var newGraph = this.graph;

        function done() {
            var eles = document.getElementsByClassName("coin-name");
            var chosenCurrencies = [].filter.call(eles, function(x) {return x.style.backgroundColor == SELECT_COLOR});
            var chosenNodes = currencies.filter(x => [].map.call(chosenCurrencies, function(el) {return el.dataset.value}).indexOf(x['name']) != -1);
            if(!modify) {
                [].forEach.call(eles, function (el) {el.style.backgroundColor = DESELECT_COLOR;});
            }

            newGraph.cleanGraph();
            newGraph = new Graph(chosenNodes, exchanges);
            newGraph.showGraph();

            button.click();
        }

        this.graph = newGraph;
        list.appendChild(domElement);
    }
}