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
DATABASE_NAME = "test_bus_data"
# datamanager object to manage queries
class DataManager:
   
   # constructor
    def __init__(self):
        # connnect to database (ip,user,pass TBD)
        self.busDatabase = mysql.connector.connect(host=HOST,user = USER,passwd = PASSWRD, database=DATABASE_NAME)
        # cursor to query/insert
        self.databaseCursor = self.busDatabase.cursor()
        return None
    
    # function called to query database for a particular bus
    # input: bus number output:
    def getData(self, bus_number):
            # query database for most recent data abt that bus
            self.databaseCursor.execute(f"SELECT * FROM Bus{bus_number} ORDER BY time DESC LIMIT 1;")
            # **PROCESS DATA (dependent on db scema)**
            raw = self.databaseCursor.fetchall()
            data = raw[0]
            # format into our required json
            output = {
                "id" : bus_number,
                "longitude" : data[1],
                "latitude" : data[2],
                "heading" : data[3],
                "accuracy" : data[4],
                "speed" : data[5]
            }               
            #return that data
            return output
    
    def setBusData(self,bus_number,long,lat,heading,accuracy,speed):
        data = {
            "id":bus_number,
              "longitude":long, 
              "latitude":lat, 
              "heading":heading, 
              "accuracy":accuracy,
              "speed":speed
            }
