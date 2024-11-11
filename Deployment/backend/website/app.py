# Imports
from fastapi import FastAPI, File, Form, BackgroundTasks
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import pyodbc
from consumer.consumer import consumer_loop
import threading
import folium
from folium.plugins import HeatMap
from kafka import KafkaAdminClient, KafkaConsumer, TopicPartition
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import io
import base64


# Creating a fastapi app
app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.mount("/assets", StaticFiles(directory="assets"), name="static") # change this address to be correct place


# Kafka connection point
KAFKA_BROKER = 'host.containers.internal:9092'

# Establish the database connection
def get_db_connection():
    conn = pyodbc.connect('DRIVER={ODBC Driver 18 for SQL Server};'
                          'SERVER=10.96.32.157;'
                          'DATABASE=GCPS_Bus;'
                          'UID=SA;'
                          'PWD=HootyHoo!;'
                          'TrustServerCertificate=yes;')
    return conn

@app.on_event("startup")
async def startup_event():
    threading.Thread(target=consumer_loop, daemon=True).start()

# authentication
@app.get("/auth")
async def auth(email: str, password: str):
    try:
        # does nothing but return bus id
        return {"status": "good", "message": "Login successful", "busID": int(email)}
    except Exception as e:
        return {"status": "error", "message": str(e)}



# get current location object from bus id
@app.get("/bus/{bus_id}")
async def get_bus_location(bus_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # SQL query to fetch bus data
    cursor.execute("SELECT * FROM CurrentBusLocations WHERE BusID = ?", bus_id)
    row = cursor.fetchone()

    if row:
        # Convert row data into a dictionary
        bus_data = {
            "BusID": row[0],
            "Longitude": row[1],
            "Latitude": row[2],
            "Speed": row[3],
            "Heading": row[4],
            "GeoFence": row[5],
            "GPSTime": row[6],
            "Accuracy": row[7],
            "LastUpdated": row[8]
        }
        return bus_data
    else:
        raise HTTPException(status_code=404, detail="Bus not found")


# get all bus objects and return in an array
@app.get("/buses")
async def get_all_buses():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch all buses with IDs 1 to 50
    cursor.execute("SELECT * FROM CurrentBusLocations WHERE BusID BETWEEN 1 AND 100")
    rows = cursor.fetchall()

    if rows:
        buses = []
        for row in rows:
            bus_data = {
                "BusID": row[0],
                "Longitude": row[1],
                "Latitude": row[2],
                "Speed": row[3],
                "Heading": row[4],
                "GeoFence": row[5],
                "GPSTime": row[6],
                "Accuracy": row[7],
                "LastUpdated": row[8]
            }
            buses.append(bus_data)
        return {"buses": buses}
    else:
        raise HTTPException(status_code=404, detail="No buses found")


@app.get("/heatmap", response_class=HTMLResponse)
async def get_heatmap():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM CurrentBusLocations WHERE BusID BETWEEN 1 AND 100")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No bus data found")

    buses = []
    for row in rows:
        bus_data = {
            "BusID": row[0],
            "Longitude": row[1],
            "Latitude": row[2],
            "Speed": row[3],
            "Heading": row[4],
            "GeoFence": row[5],
            "GPSTime": row[6],
            "Accuracy": row[7],
            "LastUpdated": row[8]
        }
        buses.append(bus_data)

    m = folium.Map(location=[33.95, -84.07], zoom_start=10)
    locations = [(bus['Latitude'], bus['Longitude']) for bus in buses if bus['Latitude'] and bus['Longitude']]
    if locations:
        HeatMap(locations, radius=10, blur=15).add_to(m)
    return m._repr_html_()



# functions for monitoring health of Kafka
@app.get("/health")
async def kafka_health():
    try:
        admin_client = KafkaAdminClient(bootstrap_servers=KAFKA_BROKER)
        brokers = admin_client.describe_cluster()
        return {
            "status": "healthy",
            "cluster_id": brokers['cluster_id'],
            "brokers": brokers['brokers']
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}



@app.get("/topics")
async def get_topics():
    try:
        admin_client = KafkaAdminClient(bootstrap_servers=KAFKA_BROKER)
        topics = admin_client.list_topics()
        return {"topics": topics}
    except Exception as e:
        return {"error": str(e)}



@app.get("/api/consumer-lag")
async def get_consumer_lag(topic: str, group_id: str):
    consumer = KafkaConsumer(
        bootstrap_servers=KAFKA_BROKER,
        group_id=group_id,
        enable_auto_commit=False
    )

    partitions = consumer.partitions_for_topic(topic)
    if not partitions:
        return {"error": f"No partitions found for topic {topic}"}

    consumer_offsets = {}
    for partition in partitions:
        tp = TopicPartition(topic, partition)  # Create a TopicPartition object
        consumer.assign([tp])  # Assign the TopicPartition to the consumer

        # Fetch the current offset for the consumer
        consumer_position = consumer.position(tp)

        # Fetch the end offset (latest offset in the topic)
        end_offset = consumer.end_offsets([tp])[tp]

        # Calculate lag as the difference between the latest and current offsets
        consumer_offsets[partition] = {
            "current_offset": consumer_position,
            "end_offset": end_offset,
            "lag": end_offset - consumer_position
        }

    # Close the consumer to release resources
    consumer.close()

    return consumer_offsets



@app.get("/consumer-groups")
async def get_consumer_groups():
    try:
        # Connect to the Kafka broker
        admin_client = KafkaAdminClient(bootstrap_servers=KAFKA_BROKER)

        # List all consumer groups
        groups = admin_client.list_consumer_groups()

        # Extract just the group IDs from the response
        group_ids = [group[0] for group in groups]  # Each group is a tuple (group_id, is_simple_consumer_group)

        return {"consumer_groups": group_ids}
    except Exception as e:
        return {"error": str(e)}


# serve frontend webpages
@app.get("/{path:path}")
async def root(path: str):
    pages = ["", "about", "contact", "map", "dashboard", "documents", "documentation", "learning", "journal"]

    if path in pages:
        return FileResponse("index.html")
    else:
        return {"error": "No webpage here :("}
