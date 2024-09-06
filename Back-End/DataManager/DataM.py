import requests
def setBusData(bus_number,long,lat,heading,accuracy,speed):
        data = {
            "id":bus_number,
              "longitude":long, 
              "latitude":lat, 
              "heading":heading, 
              "accuracy":accuracy,
              "speed":speed
            }
              
        response = requests.get("localhost:3000/updateBusData", json=data)
        if response.status_code == 200:
            posts = response.json()
            return print(posts)
        else:
            print('Error:', response.status_code)
            return None
setBusData(3,43,54,4,4,4)