import json
from confluent_kafka import Producer

TOPIC = 'GCPS_Bus_Monitoring'
SERVER = 'localhost:9092'

config = {
    'bootstrap.servers': SERVER,
    'client.id': 'Gwinnett-Bus',
    'value_serializer': lambda v: json.dumps(v).encode('utf-8'),
    'linger_ms': 50,
    'batch.size': 64 * 1024  # 64KB
}

producer = Producer(config)


def send_data(data):
    producer.produce(TOPIC, value=data)


def flush():
    producer.flush()
