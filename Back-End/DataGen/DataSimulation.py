import math
import random
import simpy.rt
from datetime import datetime, timezone


class Bus(object):
    def __init__(self, env, producer):
        self.env = env
        self.producer = producer
        self.action = env.process(self.run())

        self.asset = {
            "id": "".join(random.choices('0123456789', k=15))
        }
        self.location = {}
        self.speed = {}

    def initialize_data(self):
        # Initializes data to random values in geofence
        center_latitude = 33.9197
        center_longitude = -84.0167
        radius_meters = 22000

        def get_random_location():
            radius_degrees = radius_meters / 111320
            angle = random.uniform(0, 2 * math.pi)
            distance = random.uniform(0, radius_degrees)

            random_latitude = center_latitude + distance * math.cos(angle)
            random_longitude = center_longitude + distance * math.sin(angle) / math.cos(math.radians(center_latitude))

            return random_latitude, random_longitude

        latitude, longitude = get_random_location()
        self.location = {
            "latitude": latitude,
            "longitude": longitude,
            "headingDegrees": int(random.uniform(0, 360)),
            "accuracyMeters": 0,
            "geofence": {
                "circle": {
                    "latitude": center_latitude,
                    "longitude": center_longitude,
                    "radiusMeters": radius_meters
                }
            }
        }
        self.speed = {
            "gpsSpeedMetersPerSecond": random.uniform(0, 60),
            "ecuSpeedMetersPerSecond": random.uniform(0, 60)
        }

    def get_data(self):
        # Returns the bus data as formatted in Samsara API
        return {
            "happenedAtTime": datetime.now(timezone.utc).isoformat(timespec='seconds'),
            "asset": self.asset,
            "location": self.location,
            "speed": self.speed
        }

    def run(self):
        self.initialize_data()
        while True:
            # Send to Kafka producer here
            data = self.get_data()
            self.producer.send_data(data)
            print("Sending", self.get_data())
            # Wait 5 seconds between sharing data
            yield self.env.timeout(delay=5)


class BusDataGenerator(object):
    # Initialize data generator with producer in producer.py
    def __init__(self, producer):
        self.bus_env = simpy.rt.RealtimeEnvironment(factor=1, strict=True)
        self.producer = producer

    def start_simulation(self, num_buses, seconds):
        # Starts each bus
        for i in range(num_buses):
            Bus(self.bus_env, self.producer)

        # Run for n seconds
        self.bus_env.run(until=seconds)
