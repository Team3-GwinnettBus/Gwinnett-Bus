// this file is the 'server' to manage the database
// used for testing purposes while waiting for server fron ksu

// api manuel for express : https://expressjs.com/en/4x/api.html

// import express api to use server functionality
const expressApi = require("express");
//create server
const server = expressApi();

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
server.post("/update", (request, response) => {
  console.log(request.body);
});
