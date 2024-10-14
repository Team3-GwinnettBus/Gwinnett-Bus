import json
import time
from kafka import KafkaProducer

class Bus:
    def __init__(self, producer, topic):
        # Starting coordinates for the bus
        self.crd_point = [33.891792443690065, -84.0392303466797]
        self.producer = producer
        self.topic = topic
        self.id = 1

    def updateCoordinates(self):
        # Update coordinates in a constant direction
        self.crd_point[0] += 0.00123
        self.crd_point[1] += 0.00123

    def send_data(self):
        # Create a message with current coordinates
        data = {
            "latitude": self.crd_point[0],
            "longitude": self.crd_point[1],
            "timestamp": time.time(),
            "busID": 1
        }
        # Send data to Kafka
        self.producer.send(self.topic, data)
        print(f"Sent data: {data}")
