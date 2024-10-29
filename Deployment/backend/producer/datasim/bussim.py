import networkx
import osmnx
import os
import pickle
import random
from datetime import datetime, timezone

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the graphml file and edge data file
graphml_path = os.path.join(current_dir, 'mapdata', 'gwinnett.graphml')
edge_data_path = os.path.join(current_dir, 'mapdata', 'edge_data.pkl')

# Load the network from the graphml file
network = osmnx.load_graphml(graphml_path)

# Load edge dictionary from the edge_data.pkl file
with open(edge_data_path, 'rb') as f:
    edges = pickle.load(f)

def get_path():
    """Generate a random path from the road network graph."""
    nodes = list(network.nodes())
    return networkx.shortest_path(network, random.choice(nodes), random.choice(nodes))

class Bus:
    """A class to simulate bus movement on the road network."""
    def __init__(self, asset_id):
        self.asset_id = {
            "id": asset_id
        }
        self.location = {}

        # Random speed for the bus
        speed = random.randint(5, 20)
        self.speed = {
            "gpsSpeedMetersPerSecond": speed,
            "ecuSpeedMetersPerSecond": speed
        }

        # Generate a random path
        self.path = get_path()
        self.current_node = 0
        self.distance_along_edge = 0.0

    def update_location(self):
        """Update the bus location based on its speed and path."""
        self.distance_along_edge += self.speed['gpsSpeedMetersPerSecond'] * 5

        # Check if bus has finished its current path
        while self.current_node < len(self.path) - 1:
            current_edge = edges.get((self.path[self.current_node], self.path[self.current_node + 1]))
            edge_length = current_edge['length']
            edge_angle = current_edge['heading']

            if self.distance_along_edge >= edge_length:
                # Move to the next node
                self.distance_along_edge -= edge_length
                self.current_node += 1
            else:
                progress = self.distance_along_edge / edge_length

                start_lat = current_edge['start_lat']
                start_lon = current_edge['start_lon']
                end_lat = current_edge['end_lat']
                end_lon = current_edge['end_lon']

                # Calculate current coordinates based on progress
                current_latitude = start_lat + (end_lat - start_lat) * progress
                current_longitude = start_lon + (end_lon - start_lon) * progress

                self.location = {
                    "latitude": current_latitude,
                    "longitude": current_longitude,
                    "headingDegrees": edge_angle,
                    "accuracyMeters": 5 + random.uniform(-1, 1)
                }
                return

        # If the bus finishes the path, generate a new one
        if self.current_node >= len(self.path) - 1:
            self.path = get_path()
            self.current_node = 0
            self.distance_along_edge = 0.0

    def get_data(self):
        """Return the bus data formatted with all required fields."""
        
        # Ensure that all necessary fields are part of the returned data
        bus_data = {
            "happenedAtTime": datetime.now(timezone.utc).isoformat(timespec='seconds'),
            "busID": self.asset_id["id"],  # BusID is in the asset_id dict
            "latitude": self.location.get("latitude", 0),
            "longitude": self.location.get("longitude", 0),
            "heading": self.location.get("headingDegrees", 0),  # Assuming heading is stored in degrees
            "accuracy": self.location.get("accuracyMeters", 0),
            "speed": self.speed.get("gpsSpeedMetersPerSecond", 0),  # Include speed field
        }

        return bus_data