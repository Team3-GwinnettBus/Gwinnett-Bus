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
    DATABASE= "GCPS_Bus_Data" 
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
        output = {}
        # Execute the select query
        self.db_cursor.execute(f"SELECT * FROM CurrentBusLocations AS Numeric")
        # Fetch all the rows
        rows = self.db_cursor.fetchall()
        rows = [tuple(row) for row in rows]
        print(rows)
        for i in range(len(rows)):
            output[f'{i}'] = {
            "id" : rows[i][0],
            "longitude" : rows[i][1],
            "latitude" : rows[i][2],
            "heading" : rows[i][4],
            "accuracy" : rows[i][7],
            "speed" : rows[i][3],
            "GeoFence": rows[i][5],
            "GPS_Time": rows[i][6]
            }
        print(output)
        # format into our required json        
        return output
    #todo
    def setBusData(self,data):
        if data['BusID']<1 or data['latitude'] < 30 or  data['latitude'] >35 or  data['longitude']< -85 or data['heading'] > 360 or  data['heading']<0 or data['speed']<0:
            print("anomaly detected in data.",data['BusID'],data['longitude'] ,data['latitude'],data['heading'],data['speed'])
            self.db_cursor.execute(f"INSERT INTO InvalidData (GPSTime,BusID,longitude,latitude,heading,speed,GeoFence) VALUES (GETDATE(),{data['BusID']},{data['longitude']},{data['latitude']},{data['heading']},{data['speed']},'GeoFenceDataHere');")
        else:
            # define and execute sql command to write data
            self.db_cursor.execute(f"INSERT INTO LiveData (GPSTime,BusID,longitude,latitude,heading,speed,GeoFence) VALUES (GETDATE(),{data['BusID']},{data['longitude']},{data['latitude']},{data['heading']},{data['speed']},'GeoFenceDataHere');")
        # call update procedure in db
        self.db_cursor.execute(f"UPDATE CurrentBusLocations SET GPSTime = GETDATE(), longitude = {data['longitude']}, latitude = {data['latitude']}, heading = {data['heading']}, speed ={data['speed']} where BusID = {data['BusID']}")
        # commit the change
        self.db_connection.commit()
        return True
