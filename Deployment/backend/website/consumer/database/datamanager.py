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
    SERVER = "10.96.32.157"
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

    def setBusData(self, data):
        # Check if the BusID already exists in the database
        self.db_cursor.execute(f"SELECT COUNT(*) FROM CurrentBusLocations WHERE BusID = {data['BusID']}")
        exists = self.db_cursor.fetchone()[0]

        if exists == 0:
            # Insert new BusID into CurrentBusLocations if not found
            print(f"BusID {data['BusID']} not found in CurrentBusLocations. Adding new entry.")
            self.db_cursor.execute(
                f"INSERT INTO CurrentBusLocations (BusID, longitude, latitude, heading, speed, GPSTime, GeoFence) "
                f"VALUES ({data['BusID']}, {data['longitude']}, {data['latitude']}, {data['heading']}, "
                f"{data['speed']}, GETDATE(), 'GeoFenceDataHere');"
            )

        if False: #(data['BusID']<1 or data['latitude'] < 30 or  data['latitude'] >35 or data['longitude'] > -80 or   data['longitude']< -84 or data['heading'] > 360 or  data['heading']<0 or data['speed']<0):
            print("anomaly detected in data.",data['BusID'],data['longitude'] ,data['latitude'],data['heading'],data['speed'])
            self.db_cursor.execute(f"INSERT INTO InvalidData (GPSTime,BusID,longitude,latitude,heading,speed,GeoFence) VALUES (GETDATE(),{data['BusID']},{data['longitude']},{data['latitude']},{data['heading']},{data['speed']},'GeoFenceDataHere');")
        else:
            # define and execute sql command to write data
            self.db_cursor.execute(f"INSERT INTO LiveData (GPSTime,BusID,longitude,latitude,heading,speed,GeoFence) VALUES (GETDATE(),{data['BusID']},{data['longitude']},{data['latitude']},{data['heading']},{data['speed']},'GeoFenceDataHere');")
        # call update procedure in db
        self.db_cursor.execute("EXEC UpdateCurrentBusLocation;")
        # commit the change
        self.db_connection.commit()
        return True
