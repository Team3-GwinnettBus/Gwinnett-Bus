import pyodbc

def connect_db():
    # connection string to db (fields are hardcoded but can be added as parameters)
    db_microsoft_sql_server_connection_string = (
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=localhost,1433;'  # temp location for now using local host
        'DATABASE=GCPS_BusData;'
        'UID=SA;'
        'PWD=SomeStringPassword'
    )

    # setup connection to db
    db_connection = pyodbc.connect(db_microsoft_sql_server_connection_string)

    # control object to manipulate db
    db_cursor = db_connection.cursor()

    return {
        "connection": db_connection,
        "cursor": db_cursor
    }


def close_connection_db(db_connection, db_cursor):
    # clean up after done using db
    db_cursor.close()
    db_connection.close()
