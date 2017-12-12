function parseCurrencies(currencies) {

    var cleanedCurrencies = currencies.replace(/'/g, '"').replace(/u"/g, '"').replace(/None/g, '""');
    var splittedCurrencies = JSON.parse(cleanedCurrencies)

    return splittedCurrencies;
}

function parseVolumes(volumes) {
    var cleanedVolumes = volumes.replace(/'/g, '"').replace(/u"/g, '"');
    var splittedVolumes = JSON.parse(cleanedVolumes)

    return splittedVolumes;
}

function dataToDict(currencies, exchanges) {
    var currencies_dict = currenciesDict(currencies);

    var node_ids = Object.keys(currencies_dict);
    var exchanges_dict =  exchangesDict(exchanges,  node_ids);
    var exchanges_total_dict = totalExchangesDict(exchanges_dict, node_ids);

    return [currencies_dict, exchanges_dict, exchanges_total_dict];
}

function currenciesDict(currencies) {
    var currencies_dict = {};

    currencies.forEach(function(node) {
        var newNode = Object.assign({}, node, {visible: false})
        currencies_dict[newNode['id']] = newNode;
    });

    return currencies_dict;
}


function exchangesDict(exchanges,  node_ids) {
    var exchanges_dict = {};

    exchanges.forEach(function (coin_exchanges) {
        coin_exchanges.forEach(function(ex) {
            var pair = ex['pair'].split("/");
            ex['visible'] = false;

            if (node_ids.includes(pair[0]) && node_ids.includes(pair[1])) {
                exchanges_dict[ex['pair'] + ex['source']] = ex
            }
        });
    });

    return exchanges_dict;
}

function totalExchangesDict(exchanges_dict, node_ids) {
    var exchanges_total_dict = {}

    //Converts exchanges to total exchange per pair {id1/id2 -> total exchange details}
    for (var i = 0; i < node_ids.length - 1; i++) {
        var n1 = node_ids[i];
        for (var j = i + 1; j < node_ids.length; j++) {
            var n2 = node_ids[j];
            for (var key in exchanges_dict) {
                if (strContains(key, n1) && strContains(key, n2)) {
                    var pair = n1 + '/' + n2;
                    var volume = parseFloat(exchanges_dict[key]['volume24h']);
                    var existingVolume = 0;
                    if (isDefined(exchanges_total_dict[pair])) {
                        existingVolume = exchanges_total_dict[pair]['volume'];
                    } else {
                        exchanges_total_dict[pair] = {};
                    }
                    exchanges_total_dict[pair]['volume'] = volume + existingVolume;
                }
            }
        }
    }

    return exchanges_total_dict;
}

function isDefined(object) {
    return typeof object != "undefined";
}

function strContains(str, to_check) {
    return str.indexOf(to_check) != -1;
}