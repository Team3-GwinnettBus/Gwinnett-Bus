### 1. Get Linux
FROM redhat/ubi9

### 2. Get Java via the package manager
RUN DNF update \
&& DNF upgrade \
&& DNF add --no-cache bash \
&& DNF add --no-cache --virtual=build-dependencies unzip \
&& DNF add --no-cache curl \
&& DNF add --no-cache openjdk8-jre

### 3. Get Python, PIP

RUN DNF add --no-cache python3 \
&& python3 -m ensurepip \
&& pip3 install --upgrade pip setuptools \
&& rm -r /usr/lib/python*/ensurepip && \
if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
rm -r /root/.cache

WORKDIR /home/administrator/Gwinnett-Bus

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
