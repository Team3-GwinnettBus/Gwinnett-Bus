#!/bin/bash

#start kafka
cd ~
cd Gwinnett-Bus
cd 'kafka_2.13-3.8.0'
bin/kafka-server-start.sh config/kraft/server.properties &
sleep 10

#start bus locations simulations
cd ~
cd Gwinnett-Bus/Back-End/Producer/
./bussim.sh &

#start server
cd ~
cd Gwinnett-Bus/
cd '(Optional)Front-End Monitoring'
python main.py     
