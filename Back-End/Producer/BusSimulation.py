import asyncio
import networkx
import osmnx
import pickle
import random
from datetime import datetime, timezone

KAFKA_MODE = True

if KAFKA_MODE:
    from producer import send_data, flush

# Load saved graph or create new graph from location and ensure its strongly connected
network = osmnx.load_graphml('MapData/gwinnett.graphml')

# Load edge dictionary from file
with open('MapData/edge_data.pkl', 'rb') as f:
    edges = pickle.load(f)


# Generate a random path from random locations on the graph
def get_path():
    nodes = list(network.nodes())
    return networkx.shortest_path(network, random.choice(nodes), random.choice(nodes))


class Bus:
    def __init__(self, asset_id, update_queue):
        self.asset_id = {
            "BusID": asset_id
        }
        self.update_queue = update_queue
        self.location = {}

        speed = random.randint(5, 20)
        self.speed = {
            "gpsSpeedMetersPerSecond": speed,
            "ecuSpeedMetersPerSecond": speed
        }

        self.path = get_path()
        self.current_node = 0
        self.distance_along_edge = 0.0

    async def run(self):
        while True:
            self.update_location()
            await self.update_queue.put(self.get_data())
            await asyncio.sleep(5)

    def update_location(self):
        # Calculate how far vehicle traveled in past 5 seconds
        self.distance_along_edge += self.speed['gpsSpeedMetersPerSecond'] * 5

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
            self.path = get_path()
            self.current_node = 0
            self.distance_along_edge = 0.0

    # Return data as formatted in Samsara API
    def get_data(self):
        return {
            "BusID": self.asset_id["BusID"],
            "latitude": self.location["latitude"],
            "longitude": self.location["longitude"],
            "heading": self.location["headingDegrees"],
            "accuracy": self.location["accuracyMeters"],
            "speed": self.speed["gpsSpeedMetersPerSecond"],
            "geofence": "Geofence",
            "GPS_Time": datetime.now(timezone.utc).isoformat(timespec='seconds')
        }


class DataCollector:
    def __init__(self, update_queue):
        self.update_queue = update_queue

    # Fetch all updates from update queue and process each update for each iteration
    async def run(self):
        while True:
            updates = []
            while not self.update_queue.empty():
                updates.append(await self.update_queue.get())
            self.process_updates(updates)
            await asyncio.sleep(5)

    # Send each bus data to Kafka producer
    @staticmethod
    def process_updates(updates):
        for update in updates:
            # Uncomment send_data and flush to test simulation
            send_data(update)

            # Prints bus data of bus 1 for debugging
            if update['BusID'] == {"BusID": 1}:
                print(update)

        flush()


async def main():
    update_queue = asyncio.Queue()
    num_buses = 3

    buses = [Bus(i + 1, update_queue) for i in range(num_buses)]
    bus_tasks = [asyncio.create_task(bus.run()) for bus in buses]

    collector = DataCollector(update_queue)
    collector_task = asyncio.create_task(collector.run())

    await asyncio.gather(*bus_tasks, collector_task)


if __name__ == "__main__":
    asyncio.run(main())
