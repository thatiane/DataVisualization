class CustomNetwork {

    constructor(currencies, exchanges) {
        this.currencies = currencies;
        this.exchanges = exchanges;

        //Generate the expandable list
        this._generateExpandableList(currencies.map(c=>c['name']), exchanges);

        this.costumizedCurrencies = [];
    }

    pickNodes() {

    }

    _generateExpandableList(currencies, exchanges) {

        const list = document.getElementById("list");
        const genElem = function(label)  {
            var domElement = document.createElement("div");
            var text = document.createTextNode(label);
            domElement.appendChild(text);
            domElement.setAttribute("class", "coin-name");
            domElement.setAttribute("data-value", label);

            //Add on click listener
            domElement.addEventListener("click", function() {
                var computedStyle = window.getComputedStyle(domElement, null);
                var color = computedStyle['background-color'];
                if(computedStyle['background-color'] === 'rgb(255, 255, 0)') {
                    domElement.style.backgroundColor = 'rgb(0, 128, 0)';
                } else if (computedStyle['background-color'] === 'rgb(0, 128, 0)') {
                    domElement.style.backgroundColor = 'rgb(255, 255, 0)'
                }
            });

            return domElement;
        };

        //Add cancel button at the end of the list
        currencies.forEach(currency => list.appendChild(genElem(currency)));

        var domElement = document.createElement("div");
        var text = document.createTextNode("Cancel");
        domElement.appendChild(text);
        domElement.setAttribute("class", "btn btn-info");
        domElement.addEventListener("click", cancel);

        function cancel() {
            const eles = document.getElementsByClassName("coin-name");
            [].forEach.call(eles, function (el) {el.style.backgroundColor = 'rgb(255, 255, 0)';});
        }

        list.appendChild(domElement);

        //Add done button at the end of the list
        var domElement = document.createElement("span");
        var text = document.createTextNode("Done");
        domElement.appendChild(text);
        domElement.setAttribute("class", "btn btn-info");
        domElement.addEventListener("click", done);

        var currencies = this.currencies;
        var chosenNodes = [];
        function done() {
            var eles = document.getElementsByClassName("coin-name");
            var chosenCurrencies = [].filter.call(eles, function(x) {return x.style.backgroundColor == 'rgb(0, 128, 0)'});
            console.log(chosenCurrencies)

            chosenNodes = currencies.filter(x => [].map.call(chosenCurrencies, function(el) {return el.dataset.value}).indexOf(x['name']) != -1);
            console.log(chosenNodes);
            [].forEach.call(eles, function (el) {el.style.backgroundColor = 'rgb(255, 255, 0)';});

            const graph = document.getElementById("graph");
            console.log(graph.getElementsByTagName("g")[0])
            graph.removeChild(graph.getElementsByTagName("g")[0]);

            const g = new Graph(chosenNodes, exchanges);
            g.showGraph();

            const graph = document.getElementById("graph");
        }

        list.appendChild(domElement);

    }
}