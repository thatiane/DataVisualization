from multiprocessing import Manager
from flask import jsonify
import requests
import bs4
from helper.timer import set_interval

class VolumesFetcher:

    def __init__(self, currencies_fetcher, refresh_rate):
        """ Class constructor for VolumesFetcher

        Keyword arguments:
        currencies_fetcher -- the currency fetcher to use
        refresh_rate -- determine the frequency at which the fetching happens
        """
        manager = Manager()
        self.pairs_volume = manager.list()
        self.currencies = manager.list()
        self.currencies_fetcher = currencies_fetcher
        self.refresh_rate = refresh_rate

    def scrap_data_once(self):
        """Fetch exchanges information"""
        currencies = self.currencies_fetcher.scrap_data()

        pairs_volume = []

        for c in currencies:
            transactions = self.__get_transactions(c['market_path'])
            pairs_volume.append(transactions)

        # Problem here. This should be atomic
        self.currencies[:] = currencies
        self.pairs_volume[:] = pairs_volume
        print('Volume scraping complete')

    def scrap_data_repeatedly(self):
        """Fetch exchanges information repeatedly"""
        self.scrap_data_once()
        set_interval(self.scrap_data_once, self.refresh_rate)

    def get_json_data(self):
        """Get the currencies and exchanges information in JSON format"""
        return jsonify([self.get_currencies(), self.get_volumes()])

    def get_volumes(self):
        """Get the exchanges information"""
        return self.pairs_volume.__str__()

    def get_currencies(self):
        """Get the currencies information"""
        return self.currencies.__str__()

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

        # TODO remove pairs with volume == 0
        clean = self.__string_to_number

        source = d["Source"]
        updated = d["Updated"]
        price = d["Price"]
        pair = d["Pair"]
        volume24 = d["Volume (24h)"]
        volume = d["Volume (%)"]
        tag = d["#"]

        rows = zip(tag, source, pair, volume24, price, volume, updated)
        rows = list(map(lambda row: {'source': row[1], 'pair': row[2], 'volume24h': clean(row[3]), 'price': clean(row[4]), 'volume%': clean(row[5]) / 100, 'updated': row[6]}, rows))

        return rows
