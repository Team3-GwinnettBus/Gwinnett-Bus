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

# Set redhat container image
FROM almalinux:8

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Update system packages and install required system dependencies
RUN dnf update -y && \
    dnf install -y gcc unixODBC unixODBC-devel libffi-devel tar gzip && \
    dnf clean all

# Install Python 3.10 from the default repositories
RUN dnf module enable -y python:3.10 && \
    dnf module install -y python:3.10 && \
    python3 -m ensurepip && \
    pip3 install --upgrade pip

# Install Python libraries
RUN pip3 install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Run the default command to execute your Python script
CMD ["python3", "datasim/bussimulation.py"]
