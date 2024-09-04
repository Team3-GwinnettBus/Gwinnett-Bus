# Requiremments from gcps include that mySQL is the relational database of choice
# import mySQL:
import mysql.connector
HOST = "SERVER IP HERE"
USER= "MYSQL USER HERE"
PASSWRD = "MYSQLPASSWRD HERE"
DATABASE_NAME = "Name of database created in mySQL goes here"
# datamanager object to manage queries
class DataManager:
   
   # constructor
    def __init__(self):
        # connnect to database (ip,user,pass TBD)
        self.busDatabase = mysql.connector.connect(host=HOST,user = USER,passwd = PASSWRD, database=DATABASE_NAME)
        # cursor to query/insert
        self.databaseCursor = self.busDatabase.cursor()
    
    # function called to query database for a particular bus
    # input: bus number output:
    def getData(self, bus_number):
        data = self.databaseCursor.execute(f"SELECT * FROM {DATABASE_NAME} WHERE id = {bus_number}")
        # **PROCESS DATA (dependent on db scema)**
        jsonLike = {
            # format data into json-like struct
        }
        #return that data
        return jsonLike
    