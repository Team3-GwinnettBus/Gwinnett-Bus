# call on start of webserver

from kafka import KafkaConsumer
import json
from .database.datamanager import DataManager  # Import DataManager

def consumer_loop():
    # Kafka Consumer setup
    TOPICNAME = 'GCPS_Bus_Monitoring'
    SERVERIP = 'host.containers.internal:9092'

    consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP)

    # Initialize DataManager to interact with the database
    db_manager = DataManager()

    # Function to process and insert data into the database
    def process_message(message):
        try:
            # Parse the message (assuming JSON format)
            bus_data = json.loads(message.value.decode('utf-8'))
            print(f"Received bus data: {bus_data}")

            # Prepare the data to insert into the database
            data = {
                'BusID': bus_data['asset']['id'],  # Updated to get the ID from 'asset'
                'latitude': bus_data['location']['latitude'],
                'longitude': bus_data['location']['longitude'],
                'speed': bus_data['speed']['gpsSpeedMetersPerSecond'],
                'heading': bus_data['location']['headingDegrees'],
                'GeoFence': 'none',  # Example placeholder
                'GPSTime': bus_data['happenedAtTime'],
                'Accuracy': bus_data['location']['accuracyMeters']
            }

            # Insert the data using DataManager
            db_manager.setBusData(data)

        except Exception as e:
            print(f"Error processing message: {e}")

    # Consume messages from Kafka
    for message in consumer:
        process_message(message)

    # Close the connection to the database
    db_manager.close_connection_db()
