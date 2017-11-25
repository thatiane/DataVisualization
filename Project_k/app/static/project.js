const flask_server_url = 'http://0.0.0.0:5000';
const refreshPeriod = 300000;

dataFetcher = new DataFetcher(refreshPeriod);
promise = dataFetcher.getData();

promise.then((data) => {
  let currencies = data[0];
  let volumes = data[1];
  let string_currency = '';
  let start_string = false;
  let list_currencies = [];
  // transform the list of char in a list a String
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
  // Now keep only the Names of the Currencies
  let currencies_name = []
  for(let i = 0; i < list_currencies.length; i ++){
      let curr = list_currencies[i];
      let split_curr = curr.split("/");
      currencies_name.push(split_curr[2]);
  }
  //console.log("Name = " + currencies_name);

  ScorllBox(currencies_name)



});
