from kafka import KafkaConsumer

TOPICNAME = 'GCPS_Bus_Monitoring'
SERVERIP = 'localhost:9092'

consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP)

for messages in consumer:
    print(messages)