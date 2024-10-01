import networkx
import folium
import random
import math
import json
import osmnx
import simpy.rt
from datetime import datetime, timezone

NUM_BUSES = 2000
RUNTIME = 20  # Seconds


class Bus(object):
    def __init__(self, env, depot, asset_id, path):
        self.env = env
        self.action = env.process(self.run())
        self.depot = depot

        self.asset = {
            "id": asset_id
        }
        self.location = {}
        self.speed = {}

        self.path = path
        self.current_node_index = 0
        self.current_latitude = 0
        self.current_longitude = 0

    def initialize_data(self):
        start_node = self.path[self.current_node_index]
        self.current_latitude = self.depot.network.nodes[start_node]['y']
        self.current_longitude = self.depot.network.nodes[start_node]['x']

        # Initial point on map
        bus_marker = folium.Marker(
            location=[self.current_latitude, self.current_longitude],
            popup=f"Bus {self.asset['id']}",
            icon=folium.Icon(color='green', icon='bus', prefix='fa')
        )
        bus_marker.add_to(web_map)

        self.location = {
            "latitude": self.current_latitude,
            "longitude": self.current_longitude,
            "headingDegrees": int(random.uniform(0, 360)),
            "accuracyMeters": 0,
            "geofence": {}
        }
        self.speed = {
            "gpsSpeedMetersPerSecond": random.uniform(5, 20),
            "ecuSpeedMetersPerSecond": random.uniform(5, 20)
        }

    def get_data(self):
        return {
            "happenedAtTime": datetime.now(timezone.utc).isoformat(timespec='seconds'),
            "asset": self.asset,
            "location": self.location,
            "speed": self.speed
        }

    def update_location(self):
        if self.current_node_index < len(self.path) - 1:
            current_node = self.path[self.current_node_index]
            next_node = self.path[self.current_node_index + 1]

            current_latitude = self.depot.network.nodes[current_node]['y']
            current_longitude = self.depot.network.nodes[current_node]['x']
            next_latitude = self.depot.network.nodes[next_node]['y']
            next_longitude = self.depot.network.nodes[next_node]['x']

            heading = math.degrees(math.atan2(next_longitude - current_longitude, next_latitude - current_latitude))
            if heading < 0:
                heading += 360

            distance_to_next = math.sqrt(
                (next_latitude - current_latitude) ** 2 + (next_longitude - current_longitude) ** 2
            )
            travel_time = distance_to_next / self.speed['gpsSpeedMetersPerSecond']

            progress = min(1, 5 / travel_time)
            self.current_latitude += progress * (next_latitude - current_latitude)
            self.current_longitude += progress * (next_longitude - current_longitude)

            self.location['latitude'] = self.current_latitude
            self.location['longitude'] = self.current_longitude
            self.location['headingDegrees'] = heading

            if progress >= 1:
                self.current_node_index += 1

    def run(self):
        self.initialize_data()
        start_delay = random.uniform(0, 5)
        yield self.env.timeout(delay=start_delay)

        while self.current_node_index < len(self.path) - 1:
            data = self.get_data()
            print("Sending", json.dumps(data, indent=4))
            self.update_location()
            yield self.env.timeout(delay=5)


class BusDataGenerator(object):
    def __init__(self, graph):
        self.bus_env = simpy.rt.RealtimeEnvironment(factor=1, strict=True)
        self.network = graph

    def generate_paths(self, num_buses):
        paths = []
        for i in range(num_buses):
            origin = random.choice(list(self.network.nodes()))
            destination = random.choice(list(self.network.nodes()))
            path = networkx.shortest_path(self.network, origin, destination, weight='length')
            paths.append(path)
        return paths

    def start_simulation(self, num_buses, seconds):
        # Generate paths for each bus
        print("Generating Paths")
        paths = self.generate_paths(num_buses)

        print("Creating Buses")
        for i in range(num_buses):
            Bus(self.bus_env, self, i, paths[i])  # Pass the path to each bus

        print("Starting Simulation")
        self.bus_env.run(until=seconds)


# Load the network and start the simulation
network = osmnx.load_graphml('MapData/gwinnett.graphml')
web_map = folium.Map(location=[33.96, -84.03], zoom_start=10)
gen = BusDataGenerator(network)
gen.start_simulation(NUM_BUSES, RUNTIME)
web_map.save('simulation_map_after.html')
