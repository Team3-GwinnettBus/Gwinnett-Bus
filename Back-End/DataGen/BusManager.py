import random


# This is just to have some data to work with
# Data will eventually be dynamically updated and more logical
class BusManager:
    @staticmethod
    def create_bus():
        bus_id = "".join(random.choices('0123456789', k=15))
        latitude = random.uniform(-90, 90)
        longitude = random.uniform(-180, 180)
        heading_degrees = int(random.uniform(0, 360))
        accuracy_meters = 0
        gps_speed = 0
        ecu_speed = 0
        return Bus(bus_id, latitude, longitude, heading_degrees, accuracy_meters, gps_speed, ecu_speed)

    def __init__(self):
        self.current_fleet = []

    def start_buses(self, count: int):
        # Creates n buses and adds them to current fleet
        for i in range(count):
            bus = self.create_bus()
            self.current_fleet.append(bus)


class Bus:
    def __init__(self, asset_id, latitude, longitude, heading_degrees, accuracy_meters, gps_speed, ecu_speed):
        self.happened_at_time = None
        self.asset = {
            "id": asset_id
        }
        self.location = {
            "latitude": round(latitude, 9),
            "longitude": round(longitude, 9),
            "headingDegrees": heading_degrees,
            "accuracyMeters": accuracy_meters,
            "geofence": {}
        }
        self.speed = {
            "gpsSpeedMetersPerSecond": gps_speed,
            "ecuSpeedMetersPerSecond": ecu_speed
        }

    def get_data(self):
        # Returns the bus data as formatted in Samsara API
        return {
            "happenedAtTime": self.happened_at_time,
            "asset": self.asset,
            "location": self.location,
            "speed": self.speed
        }
