# Specify the base image (for Python 3.10)
FROM python:3.10-slim

# Install Python dependencies and system packages
RUN apt-get update && \
    apt-get install -y gcc unixodbc unixodbc-dev && \
    apt-get clean
RUN apt-get update && \
    apt-get install -y gcc unixodbc unixodbc-dev curl gnupg && \
    apt-get clean && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18
# Install Python libraries
RUN pip install --upgrade pip && \
    pip install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn flask

# Copy all code and files to the /app directory
COPY . .
WORKDIR /

# Run any scripts on boot using CMD (for Flask server, SQL server, Kafka, or anything you want running off the bat)
# Example - CMD ["name of program ex. python3", "name of script ex. any_script.py"]
# CMD ["python3", "backend/consumer/app.py"]
RUN kafka_2.13-3.8.0/bin/kafka-server-start.sh config/kraft/server.properties &
RUN ../Back-End/Producer/bussim.sh &
RUN python ../'(Optional)Front-End Monitoring'/main.py

EXPOSE 3000