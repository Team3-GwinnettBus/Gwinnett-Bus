
FROM openjdk:11
WORKDIR /home/administrator/Gwinnett-Bus

ADD . . 
# open port
EXPOSE 9092

# start kafka
RUN kafka_2.13-3.8.0/bin/kafka-server-start.sh config/kraft/server.properties

# start  
RUN CD \(Optional\)Front-End\ Monitoring/
RUN python main.py
