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
    DRIVER = "ODBC Driver 18 for SQL Server"
    SERVER = "RHEL9.xVM"
    DATABASE= "GCPS_Bus" 
    uid = "SA"
    pwd = "HootyHoo!"
   
    # constructor
    def __init__(self):
        # connection string to db (fields are hardcoded but can be added as parameters)
        db_microsoft_sql_server_connection_string = f"""
        DRIVER={{{self.DRIVER}}};
        SERVER={self.SERVER};
        DATABASE={self.DATABASE};
        uid={self.uid};
        pwd={self.pwd};
        TrustServerCertificate=yes;
       """
        print(db_microsoft_sql_server_connection_string)

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
            self.db_cursor.execute(f"SELECT * FROM ( SELECT *, ROW_NUMBER() OVER (ORDER BY LastUpdated DESC) AS rn FROM CurrentBusLocations ) AS subquery WHERE rn = {bus_number};")
            # Fetch all the rows
            rows = self.db_cursor.fetchall()[0]
            print(rows)
            # format into our required json
            output = {
                "id" : bus_number,
                "longitude" : rows[1],
                "latitude" : rows[2],
                "heading" : rows[4],
                "accuracy" : rows[8],
                "speed" : rows[3],
                "GeoFence": rows[5],
                "GPS_Time": rows[6]
            }              
            return output
    #todo
    def setBusData(self,bus_number,long,lat,heading,accuracy,speed):
        
        # define and execute sql command to write data
        self.db_cursor.execute(f"INSERT INTO LiveData (GPSTime,longitude,latitude,heading,accuracy,speed,GeoFence) VALUES (GETDATE(),-84.386100,33.76100,90,200,20,'GeoFenceDataHere');")
        # call update procedure in db
        self.db.cursor.execute("UpdateCurrentBusLocation;")
        # commit the change
        self.db_connection.commit()
        return True
