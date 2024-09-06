from kafka import KafkaProducer

TOPICNAME = 'GCPS_Bus_Monitoring'
SERVERIP = 'localhost:9092'

producer = KafkaProducer(bootstrap_servers=SERVERIP)
producer.send(TOPICNAME,b'test')
producer.flush()
print("sent")