# simple function for writing data to db
def write_data(db_connection_obj, bus_id, time, location, speed, status):
    # define and execute sql command to write data
    db_connection_obj.cursor.execute('''
        INSERT INTO BusTelemetryData (BusID, LatestTimestamp, Location, Speed, Status)
        VALUES (?, ?, ?, ?, ?)
    ''', (bus_id, time, location, speed, status))

    # commit the change
    db_connection_obj.connection.commit()
