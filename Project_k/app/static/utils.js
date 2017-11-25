function parseCurrencies(currencies) {
    console.log(currencies);

    let string_currency = '';
    let start_string = false;
    let list_currencies = [];

    // Transform the list of char in a list a String
    for(let i = 0; i < currencies.length; i ++){
        let char_ = currencies[i];
        if(char_ == "'"){
            if(start_string){
                start_string = false;
                string_currency += char_;
                list_currencies.push(string_currency);
                string_currency = '';
            }else{
                start_string = true;
            }
        }
        if(start_string){
            string_currency += char_;
        }
    }

    //Keep only the Names of the Currencies
    let currencies_name = []
    for(let i = 0; i < list_currencies.length; i ++){
        let curr = list_currencies[i];
        let split_curr = curr.split("/");
        currencies_name.push(split_curr[2]);
    }

    return currencies_name;
}

function parseVolumes(volumes) {
    //var result = JSON.parse(volumes)
    var cleanedVolumes = volumes.replace(/'/g, '"').replace(/u"/g, '"');
    var splittedCurrencies = JSON.parse(cleanedVolumes)

    return splittedCurrencies;
}