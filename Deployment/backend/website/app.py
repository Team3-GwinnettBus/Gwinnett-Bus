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
    cursor.execute("SELECT * FROM CurrentBusLocations WHERE BusID BETWEEN 1 AND 35")
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

    cursor.execute("SELECT * FROM CurrentBusLocations WHERE BusID BETWEEN 1 AND 35")
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

# serve frontend webpages
@app.get("/{path:path}")
async def root(path: str):
    pages = ["", "about", "contact", "map", "dashboard", "documents", "documentation", "learning", "journal"]

    if path in pages:
        return FileResponse("index.html")
    else:
        return {"error": "No webpage here :("}
