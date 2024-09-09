# simple function reading all data in db table
def read_telemetry_data(cursor):
    # Execute the select query
    cursor.execute('SELECT * FROM BusTelemetryData')

    # Fetch all the rows
    rows = cursor.fetchall()

    # Process and print the data (or return the rows)
    for row in rows:
        print(f"BusID: {row.BusID}, Timestamp: {row.LatestTimestamp}, Location: {row.Location}, Speed: {row.Speed}, Status: {row.Status}")

    return rows
