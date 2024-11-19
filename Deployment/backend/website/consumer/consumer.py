# call on start of webserver

from confluent_kafka import Consumer
import json
from .database.datamanager import DataManager  # Import DataManager

def consumer_loop():
    # Kafka Consumer setup
    TOPICNAME = 'GCPS_Bus_Monitoring'
    SERVERIP = 'host.containers.internal:9092'
    GROUP_ID = 'bus-monitoring-group'

    config = {
        'bootstrap.servers': SERVERIP,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'latest',
        'enable.auto.commit': True,
        'auto.commit.interval.ms': 2000,  # Commit offsets every 2 seconds
        'session.timeout.ms': 10000,      # 10-second session timeout
        'max.poll.interval.ms': 300000,   # Max interval for processing
    }

    consumer = Consumer(config)
    consumer.subscribe([TOPICNAME])

    # Initialize DataManager to interact with the database
    db_manager = DataManager()

    # Function to process and insert data into the database
    def process_message(message):
        try:
            # Parse the message (assuming JSON format)
            bus_data = json.loads(message.value().decode('utf-8'))
            print(f"Received bus data: {bus_data}")

            # Prepare the data to insert into the database
            data = {
                'BusID': bus_data['BusID'],  # Directly access 'BusID'
                'latitude': bus_data['latitude'],  # Access 'latitude'
                'longitude': bus_data['longitude'],  # Access 'longitude'
                'speed': bus_data['speed'],  # Access 'speed'
                'heading': bus_data['heading'],  # Access 'heading'
                'GeoFence': bus_data.get('geofence', 'none'),  # Use 'geofence' or default to 'none'
                'GPSTime': bus_data['GPS_Time'],  # Access 'GPS_Time'
                'Accuracy': bus_data['accuracy'],  # Access 'accuracy'
            }

            # Insert the data using DataManager
            db_manager.setBusData(data)

        except Exception as e:
            print(f"Error processing message: {e}")

    # Consume messages from Kafka
    # for message in consumer:
    #     process_message(message)

    while True:
        msg = consumer.poll(1.0)
        if msg:
            process_message(msg)

    # Close the connection to the database
    consumer.close()
    db_manager.close_connection_db()
