from kafka import KafkaProducer

TOPICNAME = 'quickstart-events'
KafkaServer = 'localhost:9092'

producer = KafkaProducer(bootstrap_servers=KafkaServer)
producer.send(TOPICNAME,b'test')
producer.flush()
print("sent")