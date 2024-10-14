FROM python:3.12

WORKDIR /

ADD . . 
# dependencies:
RUN pip install Flask
RUN pip install pyodbc
RUN pip install kafka
RUN pip install kafka-python


# open port
EXPOSE 3000

# start kafka
RUN kafka_2.13-3.8.0/bin/kafka-server-start.sh config/kraft/server.properties

# start  
RUN CD cd Gwinnett-Bus/\(Optional\)Front-End\ Monitoring/
RUN python main.py
