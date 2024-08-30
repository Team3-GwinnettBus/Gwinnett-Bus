from kafka import KafkaConsumer

TOPIC_NAME = 'quickstart-events'

consumer = KafkaConsumer(TOPIC_NAME)

for messages in consumer:
    print(messages)