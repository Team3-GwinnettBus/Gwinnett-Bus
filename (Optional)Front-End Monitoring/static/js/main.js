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
  //setBusData(1, lat, lng, 55, 55, 35);
}
// function to update the current bus data
async function GetBusData(bus_number) {
  console.log("Request for Bus " + bus_number + " sent to server. Response:");
  let response = await fetch(
    "/getBusData?" +
      new URLSearchParams({
        id: bus_number,
      }).toString()
  );
  const values = await response.json();
  for (const key in values) {
    var lng = values[key].longitude;
    var lat = values[key].latitude;

    busmarkers[parseInt(key)][0].setLatLng([lat, lng]);
    //busmarkers[parseInt(key)][0].setRadius(accuracyRadius);
    busmarkers[parseInt(key)][1].setLatLng([lat, lng]);
  }
  //map.setView([lat, lng]);
  //update center, circle, and marker/icon

  console.log(values);
  console.log(map.getCenter());
}

// async function setBusData(id_num, long, lat, heading, accuracyMeters, mph) {
//   const data = {
//     id: id_num,
//     longitude: long,
//     latitude: lat,
//     heading: heading,
//     speed: mph,
//   };
//   const options = {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   let response = await fetch("/updateBusData", options);
//   console.log(await response.json());
//   console.log("data send");
// }
// MAIN:

//create map and define startin zoom
var map = L.map("map").setView([33.891792443690065, -84.0392303466797], 11.5);
const defaultView = [33.953470353472376, -84.02841567993165];
//add open street map layer as map view
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 15,
  minZoom: 3,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
map.setView([33.953470353472376, -84.02841567993165]);
//set bus icon
var busIcon = L.icon({
  iconUrl: "/static/res/school-bus.png",
  iconSize: [70, 80],
  iconAnchor: [28, 70],
});
//define map variables (circle and marker)
const busmarkers = [];
for (let i = 0; i < 50; i++) {
  var radius = L.circle([0, 0], { radius: 20 }, { icon: busIcon }).addTo(map);
  var marker = L.marker([0, 0], { icon: busIcon }).addTo(map);
  marker.on("click", () => {
    var latLngs = [marker.getLatLng()];
    var markerBounds = L.latLngBounds(latLngs);
    map.fitBounds(markerBounds);
  });
  busmarkers.push([marker, radius]);
}

//call function

//update every second
setInterval(() => {
  try {
    GetBusData(1).then(endLoader);
  } catch (error) {
    console.log("Error fetching location data");
  }
}, 3000);
// end loading animation
function endLoader() {
  // hide the loader and show the updated info panel
  document.getElementById("loader").style.display = "none";
  document.getElementById("info").style.display = "block";
  document.getElementById("recenter").onclick((e) => {
    map.setView([33.953470353472376, -84.02841567993165]);
  });
}
