# this file is the driver file for the server, will handle requests and return data from db
from flask import Flask, render_template, request

# to import datamanager
import sys
sys.path.insert(1,'../Back-End/DataManager')
#import our datamanager object
import DataManager
#initiate our server
server = Flask(__name__)
#initiate our database connection
#database = DataManager.DataManager()

# server routing:

# home (index)
@server.route("/")
def index():
    return render_template('index.html')

# getBusData api to query the database and returns a buses location
@server.route('/getBusData', methods=['POST'])
def getBusData():
    busId = request.get_json()
    print(busId) 
    return { "long": 1 , "lat": 2}
server.run('localhost',3000)