import random
import simpy.rt
from datetime import datetime, timezone


class Bus(object):
    def __init__(self, env):
        self.env = env
        self.action = env.process(self.run())

        self.asset = {
            "id": "".join(random.choices('0123456789', k=15))
        }
        self.location = {}
        self.speed = {}

    def initialize_data(self):
        # Initializes data to random values
        # TODO: Make location data somewhat realistic and establish geofence to Gwinnett County
        self.location = {
            "latitude": round(random.uniform(-90, 90), 9),
            "longitude": round(random.uniform(-180, 180), 9),
            "headingDegrees": int(random.uniform(0, 360)),
            "accuracyMeters": 0,
            "geofence": {}
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
            print(self.get_data())
            # Wait 5 seconds between sharing data
            yield self.env.timeout(delay=5)


def start_buses(env, num_buses):
    # Starts each bus
    for i in range(num_buses):
        Bus(env)


env = simpy.rt.RealtimeEnvironment(factor=1, strict=True)
# Number of buses to simulate
start_buses(env, 3)
# Run for n seconds
env.run(until=30)
