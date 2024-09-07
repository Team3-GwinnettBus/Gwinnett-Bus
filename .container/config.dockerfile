# import the docker python base image (im using 3.10 we can choose whatever - michael)
FROM python:3.10
# import kafka base image for docker
FROM apache/kafka:3.8.0

#start kafka server ( -p signifies port, default is 9092)
RUN -p 9092:9092 apache/kafka:3.8.0
# update pip (just incase)
RUN Pip3 install --upgrade Pip3

#install mySQL for DataManager.py object
RUN Pip3 install mysql-connector

#install kafka api for general kafka server use
RUN Pip3 install kafka-python

#install library to allow for api calls
RUN Pip3 install requests

#install server dependency flask
RUN Pip3 install flask
# pip install confluent-kafka
# insert imports as you include them in files thx guys