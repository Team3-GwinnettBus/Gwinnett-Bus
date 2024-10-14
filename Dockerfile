FROM python:3.12

ADD . .
WORKDIR /\(Optional\)Front-End\ Monitoring

# dependencies:
RUN pip install Flask
RUN pip install pyodbc
RUN pip install kafka
RUN pip install kafka-python

EXPOSE 3000

# start  
RUN pwd
RUN ls
RUN python main.py