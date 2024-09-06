// this file is the 'server' to manage the database
// used for testing purposes while waiting for server fron ksu

// api manuel for express : https://expressjs.com/en/4x/api.html

// import express api to use server functionality
const expressApi = require("express");

// import database api
const nedb = require("nedb");

//create server
const server = expressApi();

//create database and pass it path to our db file
const database = new nedb("data/busdata.db");
database.loadDatabase();
// listen on port 300
server.listen("3000", () => console.log("live"));

// allow data to be public
server.use(
  expressApi.static(
    "/Users/michaelrizig/Documents/GitRepos/Gwinnett-Bus/(Optional)Front-End Monitoring/public"
  )
);

//specify how we are going to parse jsons when recieved.
server.use(expressApi.json({ limit: "1mb" }));

// server routing for post requests (when a bus is updating its location, this route api is used)
// /getBusData api will return the bus data passed to it via the json.
// expected request includes " 'id': x " tag that will be used to query database
server.post("/getBusData", (request, response) => {
  console.log(request.body);

  const responseJson = {};
  response.json(responseJson);
});

server.post("/updateBusData", (request, response) => {
  var data = {
    id: request.body.id,
    latitude: request.body.latitude,
    longitude: request.body.longitude,
    headingDegrees: request.body.heading,
    accuracyMeters: request.body.heading,
    gpsSpeedMetersPerSecond: request.body.speed,
  };
  database.insert(data);
  console.log("data inserted:", data);
});
