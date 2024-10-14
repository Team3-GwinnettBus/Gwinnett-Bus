FROM python:3.12
WORKDIR /\(Optional\)Front-End\ Monitorings

ADD . .

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