from multiprocessing import Manager
from flask import jsonify
import requests
import bs4
from helper.timer import set_interval

class VolumesFetcher:

    def __init__(self, currencies_fetcher, refresh_rate):
        manager = Manager()
        self.pairs_volume = manager.list()
        self.currencies_fetcher = currencies_fetcher
        self.refresh_rate = refresh_rate

    def scrap_data_once(self):
            currencies = self.currencies_fetcher.scrap_data()

            del self.pairs_volume[:]

            for c in currencies:
                transactions = self.__get_transactions(c)
                self.pairs_volume._callmethod('append', [transactions])

    def scrap_data_repeatedly(self):
        self.scrap_data_once()
        set_interval(self.scrap_data_once, self.refresh_rate)

    def get_json_data(self):
        return jsonify(self.pairs_volume.__str__())

    def __string_to_number(self, string):
        # Last two line deal with the ** rows marked on coinmarketcap\
        string = string.replace('$', '')\
                       .replace(',', '')\
                       .replace('%', '')\
                       .replace('\n', '')\
                       .replace('*', '')

        return float(string)

    def __get_transactions(self, market_path):
        base = "http://coinmarketcap.com/" + market_path
        page = requests.get(base)
        s = bs4.BeautifulSoup(page.text, 'html.parser')

        table = s.findAll("table", id="markets-table")
        trs = table[0].findAll('tr')

        d = {}
        names = [t.text for t in trs[0].findAll('th')]

        for n in names:
            d[n] = []

        for t in trs[1::]:
            td = t.findAll('td')
            for i, n in zip(td, names):
                d[n].append(i.text.strip())

        # TODO remove pair with volume == 0
        clean = self.__string_to_number
        rows = list(zip(*d.values()))
        rows = list(map(lambda row: {'source': row[1], 'pair': row[2], 'volume24h': clean(row[3]), 'price': clean(row[4]), 'volume%': clean(row[5]) / 100, 'updated': row[6]}, rows))

        return rows
