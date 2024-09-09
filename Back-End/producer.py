import json
from DataGen import DataSimulation
from kafka import KafkaProducer


class KafkaDataProducer:
    def __init__(self, topic, server):
        self.topic = topic
        self.producer = KafkaProducer(
            bootstrap_servers=server,
            client_id='Gwinnett-Bus',
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

    def send_data(self, data):
        self.producer.send(self.topic, data)


# Kafka Producer setup
TOPIC = 'quickstart-events'
SERVER = 'localhost:9092'

BusDataProducer = KafkaDataProducer(TOPIC, SERVER)

# Initialize and start generation of synthetic bus data
data_generator = DataSimulation.BusDataGenerator(BusDataProducer)
data_generator.start_simulation(3, 30)

BusDataProducer.producer.flush()
print("Simulation complete")
