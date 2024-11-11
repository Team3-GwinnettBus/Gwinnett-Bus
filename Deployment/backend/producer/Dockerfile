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
#     pip install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn

# # Copy all code and files to the /app directory
# COPY . /app
# WORKDIR /app

# # Run any scripts on boot using CMD (for Flask server, SQL server, Kafka, or anything you want running off the bat)
# # Example - CMD ["name of program ex. python3", "name of script ex. any_script.py"]
# # CMD ["python3", "backend/consumer/app.py"]
# CMD ["python3", "datasim/bussimulation.py"]


# Redhat dockerfile
# Use Red Hat UBI 8 (Universal Base Image) as the base image
FROM registry.access.redhat.com/ubi8/ubi:latest

# Install Python 3.10 and other system dependencies
RUN dnf update -y && \
    dnf install -y python39 python39-devel gcc unixODBC unixODBC-devel && \
    dnf clean all

# Create a symbolic link for `python3` to point to `python3.9`
RUN ln -s /usr/bin/python3.9 /usr/bin/python3 && \
    python3 -m ensurepip && \
    pip3 install --upgrade pip

# Install Python libraries
RUN pip3 install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn

# Set the working directory
WORKDIR /app

# Copy all code and files to the /app directory
COPY . /app

# Run the Python script on container startup
CMD ["python3", "datasim/bussimulation.py"]
