from flask import Flask, render_template
from multiprocessing import Process
import os

template_dir = os.path.abspath('../../app/template')
static_dir = os.path.abspath('../../app/static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

@app.route('/')
def index():
    return render_template('project.html')

@app.route('/data')
def data():
    return None


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', threaded=True)
