//simple script utilizing OpenStreetMap and the Leaflet Js api to map a location
// example location is International Space Station sice we dont have data yet
//credit / resources:
// API calls for map found here:  https://leafletjs.com/reference.html
// API calls for ISS location example found here: https://wheretheiss.at/w/developer

// Michael Rizig (4850/01 Group 3)

//fet iss location using 'Where Is The ISS?' API as an example
async function getISSLocation() {
  //fetch the iss data from api and parse the longitude and latitude
  const response = await fetch(
    "https://api.wheretheiss.at/v1/satellites/25544"
  );
  const values = await response.json();
  var lng = values.longitude;
  var lat = values.latitude;
  //update center, circle, and marker/icon
  map.setView([lat, lng]);
  radius.setLatLng([lat, lng]);
  marker.setLatLng([lat, lng]);
  GetBusData({ id: "1" });
}
// function to update the current bus data
async function GetBusData(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  let response = await fetch("/getBusData", options);
  console.log(await response.json());
}
// MAIN:

//create map and define startin zoom
var map = L.map("map").setView([33.891792443690065, -84.0392303466797], 6);

//add open street map layer as map view
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 15,
  minZoom: 3,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//set bus icon
var busIcon = L.icon({
  iconUrl: "../res//school-bus.png",
  iconSize: [70, 80],
  iconAnchor: [28, 70],
});
//define map variables (circle and marker)
var radius = L.circle([0, 0], { radius: 1000 }, { icon: busIcon }).addTo(map);
var marker = L.marker([0, 0], { icon: busIcon }).addTo(map);
//call function
getISSLocation();
//update every second
setInterval(getISSLocation, 1500);
