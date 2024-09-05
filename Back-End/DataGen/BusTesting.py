from BusManager import BusManager


manager = BusManager()
manager.start_buses(3)

for bus in manager.current_fleet:
    print(bus.get_data())
