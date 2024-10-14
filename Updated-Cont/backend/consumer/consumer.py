# from kafka import KafkaConsumer

# TOPICNAME = 'GCPS_Bus_Monitoring'
# SERVERIP = 'host.containers.internal:9092' # before was localhost:9092

# consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP)

# num = 0
# for messages in consumer:
#     print(messages)
#     num += 1
#     if num == 25:
#         break

from kafka import KafkaConsumer
import json
from database.datamanager import DataManager  # Import DataManager

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
            'BusID': bus_data['busID'],  # Example: add BusID if not included in the message (or parse it if present)
            'latitude': bus_data['latitude'],
            'longitude': bus_data['longitude'],
            'speed': bus_data['speed'],  # Default value or retrieve from the message if available
            'heading': bus_data['heading'],  # Default or retrieve from message
            'GeoFence': 'none',  # Example: update based on actual data (optional)
            'GPSTime': bus_data['happenedAtTime'],  # Add timestamp or retrieve from message
            'Accuracy': bus_data['accuracy']
        }

        # Insert the data using DataManager
        db_manager.setBusData(data)

    except Exception as e:
        print(f"Error processing message: {e}")



num = 0
# Consume messages from Kafka
for message in consumer:
    process_message(message)
    num += 1
    if num == 140:
        break

# Close the connection to the database
db_manager.close_connection_db()