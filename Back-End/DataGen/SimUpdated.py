import asyncio
import math
import queue
import random
import networkx
import osmnx
from datetime import datetime, timezone


class Bus:
    def __init__(self, asset_id, update_queue, network):
        self.asset_id = {
            "id": asset_id
        }
        self.update_queue = update_queue
        self.network = network
        self.location = {}

        speed = random.uniform(5, 20)
        self.speed = {
            "gpsSpeedMetersPerSecond": speed,
            "ecuSpeedMetersPerSecond": speed
        }

        self.path = self.get_path()
        self.current_node = 0
        self.distance_along_edge = 0.0
        self.update_location(initial=True)

    async def run(self):
        while True:
            self.update_location(initial=False)
            await self.update_queue.put(self.get_data())
            await asyncio.sleep(5)

    # Create a random path from random locations on the graph
    def get_path(self):
        nodes = list(self.network.nodes())
        return networkx.shortest_path(self.network, random.choice(nodes), random.choice(nodes))

    def update_location(self, initial):
        # Initialize variables for new path
        if initial or self.current_node >= len(self.path) - 1:
            self.path = self.get_path()
            self.current_node = 0
            self.distance_along_edge = 0.0

        # Create small variation in speed and calculate distance traveled over 5 seconds
        if not initial:
            speed_change = random.uniform(-0.5, 0.5)
            new_speed = self.speed["gpsSpeedMetersPerSecond"] + speed_change
            self.speed["gpsSpeedMetersPerSecond"] = max(5, min(20, int(new_speed)))
            self.speed["ecuSpeedMetersPerSecond"] = self.speed["gpsSpeedMetersPerSecond"]

            distance_traveled = self.speed["gpsSpeedMetersPerSecond"] * 5  # 5 seconds between updates
            self.distance_along_edge += distance_traveled

        while True:
            current_node = self.path[self.current_node]
            next_node = self.path[self.current_node + 1]

            current_pos = self.network.nodes[current_node]
            next_pos = self.network.nodes[next_node]

            dx = next_pos['x'] - current_pos['x']
            dy = next_pos['y'] - current_pos['y']
            edge_length = math.sqrt(dx ** 2 + dy ** 2)

            # Check if bus reached next node
            if self.distance_along_edge < edge_length:
                progress = self.distance_along_edge / edge_length
                break
            else:
                self.distance_along_edge -= edge_length
                self.current_node += 1
                if self.current_node >= len(self.path) - 1:
                    self.path = self.get_path()
                    self.current_node = 0
                    self.distance_along_edge = 0.0
                    break

        # Calculate the current position
        progress = self.distance_along_edge / edge_length
        current_latitude = current_pos['y'] + progress * dy
        current_longitude = current_pos['x'] + progress * dx

        # Calculate heading
        heading = math.degrees(math.atan2(dx, dy))
        heading = (heading + 360) % 360  # Ensure heading is between 0 and 360

        self.location = {
            "latitude": current_latitude,
            "longitude": current_longitude,
            "headingDegrees": int(heading),
            "accuracyMeters": 5 + random.uniform(-1, 1)
        }

    # Return data as formatted in Samsara API
    def get_data(self):
        return {
            "happenedAtTime": datetime.now(timezone.utc).isoformat(timespec='seconds'),
            "asset": self.asset_id,
            "location": self.location,
            "speed": self.speed
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
            if update['asset'] == {"id": 1}:
                print(update)


async def main():
    # Load saved graph or create new graph from location and ensure its strongly connected
    network = osmnx.load_graphml('MapData/gwinnett.graphml')

    # graph = osmnx.graph_from_place("Gwinnett County, Georgia, USA", network_type='drive')
    # largest_component = max(networkx.strongly_connected_components(graph), key=len)
    # network = networkx.subgraph(graph, largest_component)
    # osmnx.save_graphml(network, 'MapData/gwinnett.graphml')

    update_queue = asyncio.Queue()
    num_buses = 2000

    buses = [Bus(i + 1, update_queue, network) for i in range(num_buses)]
    bus_tasks = [asyncio.create_task(bus.run()) for bus in buses]

    collector = DataCollector(update_queue)
    collector_task = asyncio.create_task(collector.run())

    await asyncio.gather(*bus_tasks, collector_task)


if __name__ == "__main__":
    asyncio.run(main())
