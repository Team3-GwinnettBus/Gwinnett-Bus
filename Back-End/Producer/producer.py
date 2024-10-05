import json
from kafka import KafkaProducer

# fixes import errors
# pip install --break-system-packages git+https://github.com/dpkp/kafka-python.git

TOPIC = 'GCPS_Bus_Monitoring'
SERVER = 'localhost:9092'

producer = KafkaProducer(
    bootstrap_servers=SERVER,
    client_id='Gwinnett-Bus',
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),

    # These values aren't final, additional testing needed
    linger_ms=50,  # 50 ms delay to batch messages
    batch_size=32 * 1024  # 32KB batch size
)


def send_data(data):
    producer.send(TOPIC, data)


def flush():
    producer.flush()
