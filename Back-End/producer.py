from kafka import KafkaProducer
import json
import time
TOPICNAME = 'GCPS_Bus_Monitoring'
SERVERIP = 'localhost:9092'
lat = 37.8191
producer = KafkaProducer(bootstrap_servers=SERVERIP,value_serializer=lambda v: json.dumps(v).encode('utf-8'))
for i in range(10):
    lat = lat + .1
    time.sleep(1.5)
    producer.send(TOPICNAME,{
        "id" : 1,
        "latitude" : lat,
        "longitude" : -84.0155,
        "heading" : 90,
        "accuracy" : 20,
        "speed" : 55
        } )
    producer.flush()
print("sent")   