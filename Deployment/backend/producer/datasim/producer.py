import json
import time
from kafka import KafkaProducer
# from datasim.simpledatasim import Bus
# from datasim.bussim import Bus

# Kafka Producer setup
TOPIC = 'GCPS_Bus_Monitoring'
SERVER = 'host.containers.internal:9092'

producer = KafkaProducer(
    bootstrap_servers=SERVER,
    client_id='SimpleBusSimulation',
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),

    # These values aren't final, additional testing needed
    linger_ms=50,  # 50 ms delay to batch messages
    batch_size=32 * 1024  # 32KB batch size
)

def send_data(data):
    """Send the bus data to Kafka."""
    producer.send(TOPIC, value=data)

def flush():
    producer.flush()

# # Create an instance of the Bus simulation
# bus = Bus(asset_id=1)  # You can change the asset_id as needed

# # Simulation loop to send bus data every second
# for _ in range(150):  # Simulate for 150 seconds (adjust as necessary)
#     bus.update_location()
#     data = bus.get_data()
#     send_data(producer, TOPIC, data)
#     time.sleep(1)  # Wait for 1 second before sending the next update

# # Ensure all messages are sent to Kafka before exiting
# producer.flush()
# print("Bus simulation complete.")


# # Create a Bus instance
# bus = Bus(producer, TOPIC)

# # Simulation loop to send data every second
# for _ in range(150):  # Simulate for 30 seconds
#     bus.updateCoordinates()
#     bus.send_data()
#     time.sleep(1)  # Wait for 1 second before sending the next data

# # Ensure all messages are flushed to Kafka before exiting
# producer.flush()
# print("Simulation complete")