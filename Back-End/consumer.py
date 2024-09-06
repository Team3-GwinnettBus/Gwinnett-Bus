from kafka import KafkaConsumer

TOPICNAME = 'quickstart-events'
SERVERIP = 'localhost:9092'

consumer = KafkaConsumer(TOPICNAME, bootstrap_servers=SERVERIP)

for messages in consumer:
    print(messages)