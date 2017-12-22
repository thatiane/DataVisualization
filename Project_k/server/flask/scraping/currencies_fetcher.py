from flask import jsonify
import requests
import bs4

CURRENCIES_DATA_URL = 'https://coinmarketcap.com/currencies'

class CurrenciesFetcher:

    def __init__(self):
        self.currencies = []

    def scrap_data(self):
        """Fetch a list of currencies with many infos"""
        page = requests.get(CURRENCIES_DATA_URL)
        s = bs4.BeautifulSoup(page.text, 'html.parser')

        currencies = []
        table = s.find_all('table')[0]
        tr = table.find_all('tr')

        for t in tr:
            a = (t.find_all('a'))
            change_rates_elements = t.find_all(class_='percent-24h')

            if(len(a) > 0):
                currency_infos = {'market_path': self.__extract_value(a, 3, 'href'),
                                  'id': self.__extract_value_2(a, 0),
                                  'name': self.__extract_value_2(a, 1),
                                  'price-usd': self.__extract_value(a, 2, 'data-usd'),
                                  'price-btc': self.__extract_value(a, 2, 'data-btc'),
                                  'volume-btc': self.__extract_value(a, 3, 'data-btc'),
                                  'volume-usd': self.__extract_value(a, 3, 'data-usd'),
                                  'change-usd': self.__extract_value(change_rates_elements, 0, 'data-usd'),
                                  'change-btc': self.__extract_value(change_rates_elements, 0, 'data-btc'),
                                  'supply': self.__extract_value(a, 4, 'data-supply')
                                  }

                currencies.append(currency_infos)

        self.currencies = []
        self.currencies.extend(currencies)

        return self.currencies

    def get_currencies(self):
        """Return a list of currencies"""
        return jsonify(self.currencies.__str__())

    def __extract_value(self, bs4_htmls, element_index, attribute_name):
        r_value = None

        try:
            r_value = bs4_htmls[element_index][attribute_name]
        except:
            return r_value
        return r_value

    def __extract_value_2(self, bs4_htmls, element_index):
        r_value = None

        try:
            r_value = bs4_htmls[element_index].text
        except:
            return r_value
        return r_value
