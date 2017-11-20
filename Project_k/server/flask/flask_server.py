from flask import Flask, render_template
from flask_assets import Bundle, Environment
from multiprocessing import Process
from scraping.currencies_fetcher import CurrenciesFetcher
from scraping.volumes_fetcher import VolumesFetcher
import os

template_dir = os.path.abspath('../../app/template')
static_dir = os.path.abspath('../../app/static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

js = Bundle('project.js', 'service/currencies-fetcher.js', output='gen/javascript.js')

assets = Environment(app)
assets.register('javascript_js', js)

currencies_fetcher = CurrenciesFetcher()
volumes_fetchers = VolumesFetcher(currencies_fetcher, 300)

@app.route('/')
def index():
    return render_template('project.html')

@app.route('/data')
def data():
    return volumes_fetchers.get_json_data()


if __name__ == '__main__':
    scraper_process = Process(target=volumes_fetchers.scrap_data_repeatedly)
    scraper_process.start()

    app.run(debug=True, host='0.0.0.0')
