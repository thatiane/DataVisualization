import psycopg2
from scrape import *
import time
import datetime


def save_data():
    connect_str = "insert your db info here, create your tables currency and volume_pair in advance"

    # use our connection values to establish a connection
    conn = psycopg2.connect(connect_str)
    conn.set_session(autocommit=True)

    # create a psycopg2 cursor that can execute queries
    cursor = conn.cursor()

    #scrape the data
    data = scrap_data_once()
    currencies = data[0]
    volumes = data[1]

    t = time.time()
    for c in currencies:
        cursor.execute("""INSERT INTO currency (change_btc, change_usd,id, name,price_btc,price_usd, supply, volume_btc,volume_usd, time) VALUES (%s,%s, %s,%s,%s,%s,%s,%s,%s,%s);"""
                       ,      (c['change-btc'],
                               c['change-usd'],
                               c['id'],
                               c['name'],
                               c['price-btc'],
                               c['price-usd'],
                               c['supply'],
                               c['volume-btc'],
                               c['volume-usd'],
                               t))

    for v in volumes:
        cursor.execute(
            """INSERT INTO volume_pair (pair, price, source, updated, volume_perc, volume24h, time)
                          VALUES (%s,%s, %s,%s,%s,%s,%s);"""
            , (v['pair'],
               v['price'],
               v['source'],
               v['updated'],
               v['volume%'],
               v['volume24h'],
               t))