from confluent_kafka import Consumer
import json

TOPIC = 'GCPS_Bus_Monitoring'
SERVER = 'localhost:9092'

config = {
    'bootstrap.servers': SERVER
}

consumer = Consumer(config)
consumer.subscribe(TOPIC)

while True:
    msg = consumer.poll(1.0)
    if msg:
        msg_text = json.loads(msg.value().decode('utf-8'))
        print("Consumed event from bus {id}".format(id=msg_text['BusID']))
