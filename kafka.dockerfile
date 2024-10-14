
FROM openjdk:11
WORKDIR /home/administrator/Gwinnett-Bus/kafka_2.13-3.8.0

ADD . . 
# open port
EXPOSE 9092

# start kafka
RUN KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
RUN bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties

RUN /bin/kafka-server-start.sh config/kraft/server.properties


