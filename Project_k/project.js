const url_name = 'https://www.cryptonator.com/api/currencies';
const url_data = 'https://api.cryptonator.com/api/full/';
//const test_url = 'http://ip.jsontest.com/';

d3.json(url_name, function(error_name, data_name) { 
    //console.log('Checkout this JSON data_name! ', data_name);
    console.log('Checkout data_name! ', data_name.rows);
    let crypto_names = data_name.rows

    let dataset_name = crypto_names.map(function(d) {
        let url_data_usd =  url_data + String(d["code"])+ "-usd"
        let url_data_usd2 =  url_data + "usd-" + String(d["code"])
        return [ d["code"], d["name"], d["statuses"], url_data_usd];
        //return [ d["code"], d["name"], d["statuses"], url_data_usd, url_data_usd2];

    });

    let crypto_data = [];
    let data_length = dataset_name.length

    for (let i = 0; i < dataset_name.length; i++) {
        d3.json(dataset_name[i][3], function(error_data, data){
            //d3.json(dataset_name[i][4], function(error_data2, data2){
                if(data.success == true && data.ticker.markets.length > 0){
                    crypto_data.push(data)
                }/*else if(data2.success == true && data2.ticker.markets.length > 0){
                    //console.log(data2.ticker.markets.length);
                    crypto_data.push(data2)
                }*/

                if(data_length - 1 == i){
                console.log('Checkout this crypto_data', crypto_data);

                let svg = d3.select("body")
                            .append("svg")
                            .attr("class", "first")

                let datasize = crypto_data.length;

                var padding = 10;
                const x_border = 4;
                const w = svg[0][0].clientWidth;
                const h = svg[0][0].clientHeight;
                const width = (w / datasize);

                var yScale = d3.scale.linear()
                                .domain([0, d3.max(crypto_data, function(d) { return d.ticker.markets.length; })])
                                .range([h - padding, padding]);

                var xScale = d3.scale.linear()
                                .domain([0, crypto_data.length])
                                .range([x_border, w - x_border]);


                let whatever2 = svg.selectAll('rect')
                                    .data(crypto_data)
                                    .enter()
                                    .append('rect')
                                        .attr('x', (d,i) => xScale(i))
                                        .attr('y', (d,i) => yScale(d.ticker.markets.length))
                                        .attr('width', (d, i) => width)
                                        .attr('height', (d, i) => h - yScale(d.ticker.markets.length) - padding)
                                        .style("fill", (d,i) => "rgb(0,0,0)")

                let omgText = svg.selectAll("text")
                                    .data(crypto_data)
                                    .enter()
                                    .append("text")
                                        .text((d) => d.ticker.base)
                                        .attr("x", (d,i) => xScale(i))
                                        .attr("y", (d,i) => yScale(d.ticker.markets.length))
                                        .attr("font-family", "sans-serif")
                                        .attr("font-size", "7px")
                                        .attr("fill", "red");

                // create the links

                function getKey(value, array){
                    for(let key in array){
                        //console.log(array[key]);
                        if(array[key].name == value){
                            return key;
                        }
                    }
                    return null;
                };

                let nodes = crypto_names.map(function(elem) {return {"name":elem.code} });

                let links1 = []
                let links2 = []
                for (let j = 0; j < crypto_data.length; j++) {
                    link = crypto_data[j].ticker.markets
                    source = crypto_data[j].ticker.base
                    for(let k = 0; k < link.length; k++) {
                        market = link[k].market
                        volume = link[k].volume

                        let key_s = getKey(source, nodes);
                        let key_t = getKey(market, nodes);
                        links1.push({"source" : source, "market": market, "volume": volume})
                        links2.push({"source" : key_s, "market": market, "volume": volume})
                    }
                }
                console.log('Checkout the Nodes ', nodes);
                console.log('Checkout the Links1 ', links1);
                console.log('Checkout the Links2 ', links2);


                }
            //})
        })
    }

})
