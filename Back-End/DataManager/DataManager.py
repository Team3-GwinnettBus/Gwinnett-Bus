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
    SERVER = "MichaelsMainPC"
    DATABASE= "GCPS_Bus" 
    Trust_Connection = "yes"
    uid = "user"
    pwd = "pass"
   
    # constructor
    def __init__(self):
        # connection string to db (fields are hardcoded but can be added as parameters)
        db_microsoft_sql_server_connection_string = f"""
        DRIVER={{{self.DRIVER}}};
        SERVER={self.SERVER};
        DATABASE={self.DATABASE};
        Trust_Connection={self.Trust_Connection};
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
            self.db_cursor.execute(f"SELECT * FROM ( SELECT *, ROW_NUMBER() OVER (ORDER BY Time DESC) AS rn FROM dbo.Bus1 ) AS subquery WHERE rn = 1;")

            # Fetch all the rows
            rows = self.db_cursor.fetchall()[0]
            print(rows)
            # format into our required json
            output = {
                "id" : bus_number,
                "longitude" : rows[2],
                "latitude" : rows[1],
                "heading" : rows[3],
                "accuracy" : rows[4],
                "speed" : rows[5]
            }              
            return output
    #todo
    def setBusData(self,bus_number,long,lat,heading,accuracy,speed):
        
        # define and execute sql command to write data
        self.db_cursor.execute(f"INSERT INTO GCPS_Bus.dbo.Bus{bus_number} (time,longitude,latitude,heading,accuracy,speed) VALUES (GETDATE(),{long},{lat},{heading},{accuracy},{speed});")
        # commit the change
        self.db_connection.commit()
        return True
