from flask import jsonify
import requests
import bs4
from multiprocessing import Pool

CURRENCIES_DATA_URL = 'https://coinmarketcap.com/currencies'


def scrap_data():
    page = requests.get(CURRENCIES_DATA_URL)
    s = bs4.BeautifulSoup(page.text, 'html.parser')

    currencies = []
    table = s.find_all('table')[0]
    tr = table.find_all('tr')

    for t in tr:
        a = (t.find_all('a'))
        change_rates_elements = t.find_all(class_='percent-24h')

        if (len(a) > 0):
            currency_infos = {'market_path': extract_value(a, 3, 'href'),
                              'id': extract_value_2(a, 0),
                              'name': extract_value_2(a, 1),
                              'price-usd': extract_value(a, 2, 'data-usd'),
                              'price-btc': extract_value(a, 2, 'data-btc'),
                              'volume-btc': extract_value(a, 3, 'data-btc'),
                              'volume-usd': extract_value(a, 3, 'data-usd'),
                              'change-usd': extract_value(change_rates_elements, 0, 'data-usd'),
                              'change-btc': extract_value(change_rates_elements, 0, 'data-btc'),
                              'supply': extract_value(a, 4, 'data-supply')
                              }

            currencies.append(currency_infos)

    return currencies


def scrap_data_once():
    currencies = scrap_data()

    p = Pool(4)
    pairs_volume = p.map(get_transactions, [c['market_path'] for c in currencies])

    return [currencies, pairs_volume]


def string_to_number(string):
    # Last two line deal with the ** rows marked on coinmarketcap\
    string = string.replace('$', '')\
                   .replace(',', '')\
                   .replace('%', '')\
                   .replace('\n', '')\
                   .replace('*', '')

    return float(string)

def get_transactions(market_path):
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
    clean = string_to_number

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

def extract_value(bs4_htmls, element_index, attribute_name):
    r_value = None

    try:
        r_value = bs4_htmls[element_index][attribute_name]
    except:
        return r_value
    return r_value

def extract_value_2(bs4_htmls, element_index):
    r_value = None

    try:
        r_value = bs4_htmls[element_index].text
    except:
        return r_value
    return r_value