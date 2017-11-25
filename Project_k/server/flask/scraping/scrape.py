import bs4
import requests as rq
import pandas as pd
import time

def get_transactions(market_path):
    base = "https://coinmarketcap.com/" + market_path
    page = rq.get(base)
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

    #convert it to dataframe, but it's not a must!!
    df = pd.DataFrame()

    for k, v in d.items():
        df[k] = pd.Series(v)

    return df

def get_currencies_urls():
    page = rq.get("https://coinmarketcap.com/currencies")
    s = bs4.BeautifulSoup(page.text, 'html.parser')

    currencies=[]
    table = s.find_all('table')[0]
    tr = table.find_all('tr')
    for t in tr:
        a = (t.find_all('a', "price"))
        if(len(a) > 0):
            currencies.append(a[0]['href'])

    return currencies

##Usage: get all currencies urls and get volumes
#curr = get_currencies_urls()
#dfs = []
#start = time.time()
#for c in curr:
#    dfs.append(get_transactions(c))
#end = time.time()
#print(end - start)
