# Very small space container
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
    openssl openssl-devel libffi-devel unixODBC unixODBC-devel curl && \
    dnf clean all

# Install Microsoft SQL Server ODBC Driver
RUN curl -o /etc/yum.repos.d/mssql-release.repo https://packages.microsoft.com/config/rhel/8/prod.repo && \
    ACCEPT_EULA=Y dnf install -y msodbcsql18 && \
    dnf clean all

# Install Python packages
RUN pip install --upgrade pip && \
    pip install fastapi uvicorn pyodbc kafka-python==2.0.2 simpy folium

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Expose port 8000 for FastAPI
EXPOSE 8000

# Set default command to run the FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
