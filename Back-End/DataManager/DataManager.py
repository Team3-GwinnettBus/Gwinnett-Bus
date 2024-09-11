# Requiremments from gcps include that mySQL is the relational database of choice
# TODO: format data before returning it (depends on how driver is set up to accept - michael)

import pyodbc

# custom error for when database query is invalid (wrong bus number, databsae down, etc)
class QueryErrorException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

# datamanager object to manage queries
class DataManager:
    # Connection Variables
    DRIVER = "SQL Server"
    SERVER = "localhost"
    DATABASE= "GCPS_BusData" 
    Trust_Connection = "yes"
    uid = "<username>"
    pwd = "<password"
   
    # constructor
    def __init__(self):
        # connection string to db (fields are hardcoded but can be added as parameters)
        db_microsoft_sql_server_connection_string = (
            'DRIVER={ODBC Driver 17 for SQL Server};'
            'SERVER=localhost;'  # temp location for now using local host
            'DATABASE=GCPS_BusData;'
            'UID=SA;'
            'PWD=SomeStringPassword'
        )

        # setup connection to db
        self.db_connection = pyodbc.connect(db_microsoft_sql_server_connection_string)

        # control object to manipulate db
        self.db_cursor = self.db_connection.cursor()

        return None


    def close_connection_db(self):
        # clean up after done using db
        self.db_cursor.close()
        self.db_connection.close()
        
    # function called to query database for a particular bus
    # input: bus number output:
    def getData(self, bus_number):
            
            # Execute the select query
            self.cursor.execute(f"SELECT * FROM Bus{bus_number} ORDER BY time DESC LIMIT 1;")

            # Fetch all the rows
            rows = self.cursor.fetchall()

            # format into our required json
            output = {
                "id" : rows.BusID,
                "longitude" : rows.Latitude,
                "latitude" : rows.Longitude,
                "heading" : rows.Heading,
                "accuracy" : rows.Accuracy,
                "speed" : rows.speed
            }              
            return output
    #todo
    def setBusData(self,bus_number,long,lat,heading,accuracy,speed):
        
        # define and execute sql command to write data
        self.db_connection.cursor.execute(f"INSERT INTO test_bus_data.Bus{bus_number} (time,longitude,latitude,heading,accuracy,speed) VALUES (GETDATE(),{long},{lat},{heading},{accuracy},{speed});")
        # commit the change
        self.db_connection.connection.commit()
        return True
