# Smaller space conatiner
# # New docker file
# # Update as you need

# # Specify the base image (for Python 3.10)
# FROM python:3.10-slim

# # Install Python dependencies and system packages
# RUN apt-get update && \
#     apt-get install -y gcc unixodbc unixodbc-dev && \
#     apt-get clean

# # Install Python libraries
# RUN pip install --upgrade pip && \
#     pip install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn confluent-kafka

# # Copy all code and files to the /app directory
# COPY . /app
# WORKDIR /app

# # Run any scripts on boot using CMD (for Flask server, SQL server, Kafka, or anything you want running off the bat)
# # Example - CMD ["name of program ex. python3", "name of script ex. any_script.py"]
# # CMD ["python3", "backend/consumer/app.py"]
# CMD ["python3", "datasim/bussimulation.py"]


# Larger space but more secure
# Use Red Hat UBI with Python 3.11 as the base image
FROM registry.access.redhat.com/ubi8/python-311

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Ensure we are running as root
USER root

# Update the system and install required system dependencies
RUN dnf update -y && \
    dnf install -y gcc make wget tar zlib-devel \
    openssl openssl-devel libffi-devel unixODBC unixODBC-devel && \
    dnf clean all

# Install Python packages
RUN pip install --upgrade pip && \
    pip install pyodbc networkx osmnx simpy scikit-learn confluent-kafka

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Set default command to run the application
CMD ["python3", "datasim/bussimulation.py"]
