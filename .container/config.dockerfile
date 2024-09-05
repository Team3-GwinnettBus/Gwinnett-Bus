# import the docker python base image (im using 3.10 we can choose whatever - michael)
FROM python:3.10
# update pip (just incase)
RUN Pip3 install --upgrade Pip3

#install mySQL for DataManager.py object
RUN Pip3 install mysql-connector

#install kafka api for general kafka server use
RUN Pip3 install kafka-python

# insert imports as you include them in files thx guys