# this file is the driver file for the server, will handle requests and return data from db

#import server lib
from flask import Flask, render_template, request
# import kafka for data consumption
#from kafka import KafkaConsumer
# to import datamanager
import sys
sys.path.insert(1,'../Back-End/DataManager')
#import our datamanager object
import DataManager
# import threading to make this a multithreaded server
import threading
#import requests to make https requests
import requests

#initiate our server
server = Flask(__name__)
#initiate our database connection
database = DataManager.DataManager()
# define constants topic name an server address
TOPICNAME = 'Bus_Data'
SERVERIP = 'localhost:9092'

# event streaming function continuously waits until topic is updated
# when updated, new thread is created, and data is passed to insertData funtion
# new thread is used so server can support many concurrent requests
def eventStreaming():
    
    consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP) # create consumer, connect with topic
    for messages in consumer:   
        # Todo: format messages values into json format for insertData to work properly
        threading.Thread(target=insertData,args={messages}) #insert each new event into the database

def insertData(data):
   
    status = database.setBusData(data['id'],data["longitude"],data["latitude"],data["heading"],data["accuracy"],data["speed"])
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
    server.run('localhost',3000)
    

# MAIN:
# create routing thread (Flask is inheriently multithreaded so running this on one thread wont be a bottleneck)
routingProcess = threading.Thread(target=serverRouting)
routingProcess.start()
#create event streaming thread
#eventStreamingProcess = threading.Thread(target=eventStreaming)
#eventStreamingProcess.start()