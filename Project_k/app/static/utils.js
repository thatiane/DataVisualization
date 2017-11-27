function parseCurrencies(currencies) {

    var cleanedCurrencies = currencies.replace(/'/g, '"').replace(/u"/g, '"').replace(/None/g, '""');
    var splittedCurrencies = JSON.parse(cleanedCurrencies)

    return splittedCurrencies[0];
}

function parseVolumes(volumes) {
    var cleanedVolumes = volumes.replace(/'/g, '"').replace(/u"/g, '"');
    var splittedVolumes = JSON.parse(cleanedVolumes)

    return splittedVolumes;
}