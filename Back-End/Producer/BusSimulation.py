import asyncio
import csv
import networkx
import osmnx
import pickle
import random
from datetime import datetime, timezone, timedelta

KAFKA_MODE = True

if KAFKA_MODE:
    from producer import send_data, flush

# Load saved graph or create new graph from location and ensure its strongly connected
network = osmnx.load_graphml('MapData/gwinnett.graphml')

school_nodes = []

current_time = datetime.now(timezone.utc)

# Load edge dictionary from file
with open('MapData/edge_data.pkl', 'rb') as f:
    edges = pickle.load(f)

MAX_PATH_LENGTH = 10000  # Meters
UPDATE_INTERVAL = 5  # Seconds


class Bus:
    def __init__(self, asset_id, update_queue, active_bus_count, completion_event):
        self.school_id = None
        self.route_completed = False
        self.active_bus_count = active_bus_count
        self.completion_event = completion_event

        self.asset_id = {
            "BusID": asset_id
        }
        self.update_queue = update_queue
        self.location = {}

        speed = random.randint(10, 15)
        self.speed = {
            "gpsSpeedMetersPerSecond": speed,
            "ecuSpeedMetersPerSecond": speed
        }

        self.path = self.get_path()
        self.current_node = 0
        self.distance_along_edge = 0.0

    async def run(self):
        while not self.route_completed:
            self.update_location()
            await self.update_queue.put(self.get_data())
            await asyncio.sleep(UPDATE_INTERVAL)

        self.active_bus_count -= 1
        print(self.active_bus_count)
        if self.active_bus_count == 0:
            self.completion_event.set()

    # Generate a random path from a random school
    def get_path(self):
        # Select a random school as starting location
        start_node = random.choice(school_nodes)
        self.school_id = start_node
        path = [start_node]
        length = 0

        # Add nodes to path as long as it until it surpasses desired length
        while length < MAX_PATH_LENGTH:
            # Get all neighbors excluding nodes already in path
            adjacent_nodes = list(networkx.neighbors(network, path[-1]))
            neighbors = [n for n in adjacent_nodes if n not in path]

            if not neighbors:
                # Backtrack is there no other option
                if len(path) > 1:
                    neighbors = adjacent_nodes
                else:
                    return self.get_path()

            # Add new edge to path
            next_node = random.choice(neighbors)
            edge = edges.get((path[-1], next_node))
            length += edge['length']
            path.append(next_node)

        return path

    def update_location(self):
        # Calculate how far vehicle traveled in past interval
        self.distance_along_edge += self.speed['gpsSpeedMetersPerSecond'] * UPDATE_INTERVAL

        # Check if bus finished path
        while self.current_node < len(self.path) - 1:
            current_edge = edges.get((self.path[self.current_node], self.path[self.current_node + 1]))
            edge_length = current_edge['length']
            edge_angle = current_edge['heading']

            # If there's enough distance to cover the current edge
            if self.distance_along_edge >= edge_length:
                # Move to the next node
                self.distance_along_edge -= edge_length
                self.current_node += 1
            else:
                progress = self.distance_along_edge / edge_length

                # Get start and end coordinates of edge
                start_lat = current_edge['start_lat']
                start_lon = current_edge['start_lon']
                end_lat = current_edge['end_lat']
                end_lon = current_edge['end_lon']

                # Calculate new coordinates from progress
                current_latitude = start_lat + (end_lat - start_lat) * progress
                current_longitude = start_lon + (end_lon - start_lon) * progress

                # Update the location with heading and accuracy
                self.location = {
                    "latitude": current_latitude,
                    "longitude": current_longitude,
                    "headingDegrees": edge_angle,
                    "accuracyMeters": 5 + random.uniform(-1, 1)
                }
                return

        # Get new path
        if self.current_node >= len(self.path) - 1:
            # Get path to return to school
            if self.path[-1] == self.school_id:
                self.path = networkx.shortest_path(network, self.path[-1], self.school_id)
                self.current_node = 0
                self.distance_along_edge = 0.0
            else:
                # End bus travel
                print("Route Completed for bus", self.asset_id['BusID'])
                self.route_completed = True

    # Return data as formatted in Samsara API
    def get_data(self):
        global current_time

        return {
            "BusID": self.asset_id["BusID"],
            "latitude": self.location["latitude"],
            "longitude": self.location["longitude"],
            "heading": self.location["headingDegrees"],
            "accuracy": self.location["accuracyMeters"],
            "speed": self.speed["gpsSpeedMetersPerSecond"],
            "geofence": "Geofence",
            "GPS_Time": current_time.isoformat(timespec='seconds')
        }


class DataCollector:
    def __init__(self, update_queue):
        self.update_queue = update_queue

    # Fetch all updates from update queue and process each update for each iteration
    async def run(self, completion_event):
        while not completion_event.is_set():
            updates = []
            while not self.update_queue.empty():
                updates.append(await self.update_queue.get())
            self.process_updates(updates)
            await asyncio.sleep(UPDATE_INTERVAL)

    # Send each bus data to Kafka producer
    @staticmethod
    def process_updates(updates):
        for update in updates:
            # Uncomment send_data and flush to test simulation
            send_data(update)

            # Prints bus data of bus 1 for debugging
            if update['BusID'] == 1:
                print(update)

        flush()


def find_school_nodes():
    with open('MapData/school_data.csv', 'r') as school_data:
        for line in csv.DictReader(school_data):
            node = osmnx.nearest_nodes(network, float(line['longitude']), float(line['latitude']))
            school_nodes.append(node)


async def start_clock(completion_event):
    global current_time

    # Initialize time to 6:15 AM EST
    current_time = datetime.now(timezone.utc).replace(hour=11, minute=15)

    # Start clock
    while not completion_event.is_set():
        await asyncio.sleep(1)
        current_time += timedelta(seconds=1)


async def main():
    find_school_nodes()

    update_queue = asyncio.Queue()
    num_buses = 50
    active_bus_count = num_buses

    completion_event = asyncio.Event()

    timing_task = asyncio.create_task(start_clock(completion_event))

    buses = [Bus(i + 1, update_queue, active_bus_count, completion_event) for i in range(num_buses)]
    bus_tasks = [asyncio.create_task(bus.run()) for bus in buses]

    collector = DataCollector(update_queue)
    collector_task = asyncio.create_task(collector.run(completion_event))

    await asyncio.gather(*bus_tasks, collector_task)

    print("Simulation Complete")


if __name__ == "__main__":
    asyncio.run(main())
