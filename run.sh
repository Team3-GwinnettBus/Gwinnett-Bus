#!/bin/bash cd ~
cd Gwinnett-Bus/Back-End/Producer/
./bussim.sh &

cd ~

cd Gwinnett-Bus/
cd '(Optional)Front-End Monitoring'
python main.py            
