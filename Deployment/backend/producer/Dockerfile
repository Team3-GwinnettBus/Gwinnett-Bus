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

# Install EPEL and update system packages
RUN dnf install -y epel-release && \
    dnf update -y

# Install required development tools and libraries, including zlib
RUN dnf install -y gcc make wget tar bzip2 bzip2-devel \
    zlib zlib-devel openssl openssl-devel libffi-devel unixODBC unixODBC-devel

# Download and install Python 3.10 from source
RUN wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz && \
    tar xvf Python-3.10.12.tgz && \
    cd Python-3.10.12 && \
    ./configure --enable-optimizations && \
    make altinstall && \
    ln -s /usr/local/bin/python3.10 /usr/bin/python3 && \
    python3 -m ensurepip && \
    pip3 install --upgrade pip && \
    cd .. && rm -rf Python-3.10.12*

# Install Python libraries
RUN pip3 install pyodbc networkx osmnx kafka-python==2.0.2 simpy scikit-learn

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Run the default command
CMD ["python3", "datasim/bussimulation.py"]
