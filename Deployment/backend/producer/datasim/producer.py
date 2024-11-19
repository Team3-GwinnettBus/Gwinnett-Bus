import json
import time
from confluent_kafka import Producer

# Kafka Producer setup
TOPIC = 'GCPS_Bus_Monitoring'
SERVER = 'host.containers.internal:9092'

config = {
    'bootstrap.servers': SERVER,
    'client.id': 'Gwinnett-Bus',
    # 'value.serializer': lambda v: json.dumps(v).encode('utf-8'),
    'linger.ms': 50,
    'batch.size': 64 * 1024
}

producer = Producer(config)

def send_data(data):
    """Send the bus data to Kafka."""
    # producer.send(TOPIC, value=data)
    # id = data['asset']['id'] # use for key
    value = json.dumps(data).encode('utf-8')
    producer.produce(TOPIC, value=value)

def flush():
    producer.flush()
