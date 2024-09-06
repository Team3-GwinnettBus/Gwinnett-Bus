# Requiremments from gcps include that mySQL is the relational database of choice
# TODO: format data before returning it (depends on how driver is set up to accept - michael)
# import mysql api
import mysql.connector

# to handle https requests
import requests
# custom error for when database query is invalid (wrong bus number, databsae down, etc)
class QueryErrorException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

HOST = "localhost"
USER= "root"
PASSWRD = "password"
DATABASE_NAME = "Name of database created in mySQL goes here"
# datamanager object to manage queries
class DataManager:
   
   # constructor
    def __init__(self):
        # connnect to database (ip,user,pass TBD)
        self.busDatabase = mysql.connector.connect(host=HOST,user = USER,passwd = PASSWRD, database=DATABASE_NAME)
        if self.busDatabase.isConnected():
            self.connected = True
            print("connection to database successful")
            
        else:
            self.connected = False
            print("connection to databse failed")
        # cursor to query/insert
        self.databaseCursor = self.busDatabase.cursor()
        return self.connected
    
    # function called to query database for a particular bus
    # input: bus number output:
    def getData(self, bus_number):
        try:
            data = self.databaseCursor.execute(f"SELECT * FROM {DATABASE_NAME} WHERE id = {bus_number}")
            # **PROCESS DATA (dependent on db scema)**
            jsonLike = {
                # format data into json-like struct
            }
        except:
            QueryErrorException("Invalid Bus Number")
        #return that data
        return jsonLike
    
    def setBusData(self,bus_number,long,lat,heading,accuracy,speed):
        data = {
            "id":bus_number,
              "longitude":long, 
              "latitude":lat, 
              "heading":heading, 
              "accuracy":accuracy,
              "speed":speed
            }

