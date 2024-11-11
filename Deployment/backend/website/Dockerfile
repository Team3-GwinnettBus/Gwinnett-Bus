# Use an official Python runtime as a base image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y gcc unixodbc unixodbc-dev curl && \
    apt-get clean


# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install fastapi uvicorn pyodbc kafka-python==2.0.2 simpy folium

# Create working directory
WORKDIR /app

# Copy current directory content to /app inside the container
COPY . /app

# Expose port 8000 for FastAPI
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
