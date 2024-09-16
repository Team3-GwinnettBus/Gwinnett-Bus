# this file is a demo of how to insert data into the database via our server

#import requests
import requests

# save api endpoint (update with used port)
ENDPOINT = 'http://localhost:3000/setBusData'

#format incoming data as json based on formatting instructions (see README)
busdata = {
    "id" : 1,
    "latitude" : 33.8191,
    "longitude" : -84.0155,
    "heading" : 90,
    "accuracy" : 20,
    "speed" : 55
    } 

post = requests.post(url=ENDPOINT,json = busdata)

response = post.text

print(response)

