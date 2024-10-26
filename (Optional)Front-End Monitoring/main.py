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
#import requests to make https requests
import requests
#import json for parsing 
import json
#initiate our server
server = Flask(__name__)
#initiate our database connection
database = DataManager.DataManager()
# define constants topic name an server address
TOPICNAME = 'GCPS_Bus_Monitoring'
SERVERIP = 'localhost:9092'

# event streaming function continuously waits until topic is updated
# when updated, new thread is created, and data is passed to insertData funtion
# new thread is used so server can support many concurrent requests
def eventStreaming():
    
    consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP) # create consumer, connect with topic
    for messages in consumer:   
        # grab the 'value' tag from kafka event and parse as json
        data = json.loads(messages.value)
        insertData(data)

def insertData(data):
   
    status = database.setBusData(data)
    print("Inserted record " , data)
    if status:
        return "Status: Success"
    else:
        return "Status: Failed"
# server routing handles GET and POST requests for gps data from front end monitoring
def serverRouting():

    # home (index)
    @server.route("/")
    def index():
        return render_template('index.html')  #(templates/index.html)
    
    # getBusData api to query the database and returns a buses location
    @server.route('/getBusData', methods=['GET'])
    def getBusData():
        busId = request.args.get('id') # get bus id from api query 
        print("Request received: Bus # ",busId) #print request to terminal
        return database.getData(busId) #use DataManager object (database=DataManager.Datamanager()) to get data
    

    @server.route('/setBusData',methods=['POST'])
    def setData():
        data = request.get_json()
        print("Incoming Update From Bus ", data['BusID'])
        return insertData(data)
    
    

# MAIN:
# create routing thread (Flask is inheriently multithreaded so running this on one thread wont be a bottleneck)
routingProcess = threading.Thread(target=serverRouting)
routingProcess.start()
#create event streaming thread
eventStreamingProcess = threading.Thread(target=eventStreaming)
eventStreamingProcess.start()
if __name__ == "__main__":
    server.run('0.0.0.0',3000)