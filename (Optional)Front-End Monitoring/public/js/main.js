//simple script utilizing OpenStreetMap and the Leaflet Js api to map a location
// example location is International Space Station sice we dont have data yet
//credit / resources:
// API calls for map found here:  https://leafletjs.com/reference.html
// API calls for ISS location example found here: https://wheretheiss.at/w/developer

// Michael Rizig (4850/01 Group 3)

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
setInterval(getISSLocation, 3000);

//fetch location (this entire section will be replaced with a fetch( *sql query* ).then(response=>{ plot coordinates}).catch(e=>{}) when we get the server running)
// navigator.geolocation.watchPosition(success,failure);
// function success(position){

//     var lat = position.coords.latitude;
//     var long = position.coords.longitude;
//     var accuracyRange = position.coords.accuracy;
//     map.setView([lat,long],13)
//     console.log("Location pulled at: " + Date() + "\nCoordinates: \nLat:" + lat +"\nLong:" + long + "Accuracy Range:" + accuracyRange +" meters")

//     L.circle([lat,long],{radius:accuracyRange}).addTo(map)
// }
// function failure(){

// }

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
  UpdateBusData({ id: "1" });
}

async function UpdateBusData(data) {
  const options = {
    method: "GET",
    body: JSON.stringify(data),
  };
  let response = await fetch("/update");
  console.log(await response.json());
}
//toggle popup code viewer
// function togglePopup(){
//     if(document.getElementById("codebox").style.display=="block"){
//         document.getElementById("codebox").style.display="none"
//     }
//     else{
//          document.getElementById("codebox").style.display="block"
//     }

//    console.log("Code Viewer Toggled")
// }
