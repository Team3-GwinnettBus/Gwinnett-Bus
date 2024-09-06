# this file is the driver file for the server, will handle requests and return data from db

#import server lib
from flask import Flask, render_template, request

# import kafka for data consumption
from kafka import KafkaConsumer
# to import datamanager
import sys
sys.path.insert(1,'../Back-End/DataManager')

#import our datamanager object
import DataManager

# import threading to make this a multithreaded server
import threading

#initiate our server
server = Flask(__name__)

#initiate our database connection
#database = DataManager.DataManager()
TOPICNAME = 'Bus_Data'
SERVERIP = 'localhost:9092'

# event streaming function continuously waits until topic is updated
# when updated, new thread is created, and data is passed to insertData funtion
# new thread is used so server can support many concurrent requests
def eventStreaming():
    consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP)

    for messages in consumer:
        threading.Thread(target=insertData,args={messages})
    
# server routing handles GET and POST requests for gps data from front end monitoring
def serverRouting():

    # home (index)
    @server.route("/")
    def index():
        return render_template('index.html')

    # getBusData api to query the database and returns a buses location
    @server.route('/getBusData', methods=['POST'])
    def getBusData():
        busId = request.get_json()['id']
        queryResults = getData(busId)
        return queryResults
    server.run('localhost',3000)

#Todo
def insertData(data):
    # take passed in data and insert it into the mySQL database
    pass

#Todo
def getData(id):
    # take id (key) and query the database for most recent data from that bus
    pass

# MAIN:
# create routing thread (Flask is inheriently multithreaded so running this on one thread wont be a bottleneck)
routingProcess = threading.Thread(target=serverRouting)
routingProcess.start()

#create event streaming thread
eventStreamingProcess = threading.Thread(target=eventStreaming)
eventStreamingProcess.start()