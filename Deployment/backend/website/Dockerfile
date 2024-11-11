# # Use an official Python runtime as a base image
# FROM python:3.10-slim

# # Install system dependencies and Microsoft SQL Server ODBC Driver
# RUN apt-get update && \
#     apt-get install -y curl apt-transport-https gnupg && \
#     curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
#     curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
#     apt-get update && \
#     ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev gcc && \
#     apt-get clean

# # Install Python dependencies
# RUN pip install --upgrade pip && \
#     pip install fastapi uvicorn pyodbc kafka-python==2.0.2 simpy folium

# # Create working directory
# WORKDIR /app

# # Copy current directory content to /app inside the container
# COPY . /app

# # Expose port 8000 for FastAPI
# EXPOSE 8000

# # Run the FastAPI server
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

# Use Red Hat UBI 8 (Universal Base Image)
FROM registry.access.redhat.com/ubi8/ubi:latest

# Set environment variables for Microsoft ODBC Driver installation
ENV ACCEPT_EULA=Y
ENV PATH=$PATH:/opt/mssql-tools/bin

# Install system dependencies, Microsoft SQL Server ODBC Driver, and Python 3.9
RUN dnf update -y && \
    dnf install -y \
    python39 python39-devel \
    unixODBC unixODBC-devel gcc gcc-c++ make curl tar && \
    dnf clean all

# Install the Microsoft SQL Server ODBC Driver for RHEL 8
RUN curl -o /tmp/msodbcsql18.rpm https://packages.microsoft.com/rhel/8/prod/msodbcsql18-18.2.1.1-1.x86_64.rpm && \
    rpm -Uvh /tmp/msodbcsql18.rpm && \
    rm -f /tmp/msodbcsql18.rpm

# Create a symbolic link for Python3
RUN ln -s /usr/bin/python3.9 /usr/bin/python3 && \
    python3 -m ensurepip && \
    pip3 install --upgrade pip

# Install Python dependencies
RUN pip3 install fastapi uvicorn pyodbc kafka-python==2.0.2 simpy folium

# Set the working directory
WORKDIR /app

# Copy the application code to the container
COPY . /app

# Expose port 8000 for FastAPI
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
