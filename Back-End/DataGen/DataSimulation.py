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

    def update_location(self):
        # Small fluctuation in speed
        speed_change = random.randint(-5, 5)
        self.speed["gpsSpeedMetersPerSecond"] = min(30, max(0, self.speed["gpsSpeedMetersPerSecond"] + speed_change))
        self.speed["ecuSpeedMetersPerSecond"] = min(30, max(0, self.speed["ecuSpeedMetersPerSecond"] + speed_change))

        # Take average of GPS and ECU speed to calculate distance traveled in 5 seconds
        avg_speed = (self.speed["gpsSpeedMetersPerSecond"] + self.speed["ecuSpeedMetersPerSecond"]) / 2
        distance = avg_speed * 5

        # Small fluctuation in heading degrees and converting it to radians
        degree_change = random.randint(-10, 10)
        self.location["headingDegrees"] = (self.location["headingDegrees"] + degree_change) % 360
        radians = math.radians(self.location["headingDegrees"])

        # Approximate conversion factors
        meters_per_degree_latitude = 111320
        meters_per_degree_longitude = 111320 * math.cos(math.radians(self.location["latitude"]))

        # Calculate change in latitude and longitude
        delta_latitude = (distance * math.cos(radians)) / meters_per_degree_latitude
        delta_longitude = (distance * math.sin(radians)) / meters_per_degree_longitude

        # Update the current location
        self.location["latitude"] += delta_latitude
        self.location["longitude"] += delta_longitude

    def run(self):
        self.initialize_data()
        # Stagger the start of each bus
        start_delay = random.uniform(0, 5)
        yield self.env.timeout(delay=start_delay)

        while True:
            # Send to Kafka producer here
            data = self.get_data()
            self.producer.send_data(data)
            print("Sending", self.get_data())
            # Wait 5 seconds between sharing data
            self.update_location()
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
