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

# Use redhat container image
FROM almalinux:8

# Set environment variables
ENV ACCEPT_EULA=Y
ENV PYTHONUNBUFFERED=1

# Update system and install system dependencies
RUN dnf update -y && \
    dnf install -y gcc unixODBC unixODBC-devel curl tar gzip libffi-devel && \
    dnf clean all

# Install Microsoft SQL Server ODBC Driver
RUN curl https://packages.microsoft.com/config/rhel/8/prod.repo -o /etc/yum.repos.d/mssql-release.repo && \
    dnf update -y && \
    dnf install -y msodbcsql18 mssql-tools && \
    dnf clean all

# Install Python 3.10 and pip
RUN dnf module install -y python:3.10 && \
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
