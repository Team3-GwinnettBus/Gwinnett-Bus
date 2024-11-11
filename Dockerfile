# Specify the base image (for Python 3.10)
FROM python:3.10-slim

# Install Python dependencies and system packages
RUN apt-get update && \
    apt-get install -y gcc unixodbc unixodbc-dev && \
    apt-get clean

# Install Python libraries
RUN pip install --upgrade pip && \
    pip install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn

# Copy all code and files to the /app directory
COPY . /Gwinnett-Bus 
WORKDIR /Gwinnett-Bus

# Run any scripts on boot using CMD (for Flask server, SQL server, Kafka, or anything you want running off the bat)
# Example - CMD ["name of program ex. python3", "name of script ex. any_script.py"]
# CMD ["python3", "backend/consumer/app.py"]
RUN ls