from flask import jsonify
import requests
import bs4

CURRENCIES_DATA_URL = 'https://coinmarketcap.com/currencies'

class CurrenciesFetcher:

    def __init__(self):
        self.currencies = []

    def scrap_data(self):
        page = requests.get(CURRENCIES_DATA_URL)
        s = bs4.BeautifulSoup(page.text, 'html.parser')

        currencies = []
        table = s.find_all('table')[0]
        tr = table.find_all('tr')
        for t in tr:
            a = (t.find_all('a', "price"))
            if(len(a) > 0):
                currencies.append(a[0]['href'])

        self.currencies = []
        self.currencies.extend(currencies)

        return self.currencies

    def get_currencies(self):
        return jsonify(self.currencies.__str__())
