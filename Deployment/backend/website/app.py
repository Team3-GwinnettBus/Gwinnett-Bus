# Imports
from fastapi import FastAPI, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import pyodbc
from consumer.consumer import consumer_loop
import threading

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
                          'SERVER=172.31.41.118;'
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
        # for now just fetch buses id
        return {"status": "good", "message": "Login successful", "busID": int(email)}
        
        # conn = get_db_connection()
        # cursor = conn.cursor()

        # # Fetch the password and BusID from the database based on the email
        # cursor.execute("SELECT PasswordHash, BusID FROM Auth WHERE Email = ?", email)
        # row = cursor.fetchone()

        # # If no row is found, the email is not valid
        # if row is None:
        #     return {"status": "fail", "message": "Email not found"}

        # # If the password matches, return success with BusID
        # if row[0] == password:
        #     return {"status": "good", "message": "Login successful", "busID": row[1]}

        # # If the password doesn't match
        # return {"status": "bad", "message": "Incorrect password"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    # finally:
    #     cursor.close()
    #     conn.close()


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


# serve frontend webpages
@app.get("/{path:path}")
async def root(path: str):
    pages = ["", "about", "contact", "map", "dashboard", "documents", "documentation", "learning", "journal"]

    if path in pages:
        return FileResponse("index.html")
    else:
        return {"error": "No webpage here :("}
