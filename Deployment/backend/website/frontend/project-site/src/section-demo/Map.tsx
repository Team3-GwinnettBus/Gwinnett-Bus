import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const [radius, setRadius] = useState(null);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [direction, setDirection] = useState(0);
  const [recent, setRecent] = useState(null);

  const navigate = useNavigate();

  // Function to fetch bus data
  const fetchBusData = async (busID) => {
    try {
      const response = await fetch(`http://10.96.32.157:8000/bus/${busID}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json(); // Only call response.json() once
      console.log(data); // Log the data to check its contents

      setLat(data.Latitude);
      setLong(data.Longitude);
      setSpeed(data.Speed);
      setDirection(data.Heading);
      setRecent(formatDate(data.LastUpdated));
      // setRadius(data.Accuracy);

      return {
        lat: data.Latitude, // Use correct case-sensitive property names
        lng: data.Longitude,
        accuracy: data.Accuracy,
      };
    } catch (error) {
      console.error("Error fetching bus data:", error);
      return null;
    }
  };

  function formatDate(isoString) {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // "long", "short", or "narrow" are valid
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return date.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    // Check localStorage for email and busID
    const email = localStorage.getItem("email");
    const busID = localStorage.getItem("busID");

    if (!email || !busID) {
      // Redirect to login page if not found
      navigate("/login");
    } else {
      console.log("Email:", email);
      console.log("BusID:", busID);
    }
  }, [navigate]);

  // Initialize the map and markers when the component mounts
  useEffect(() => {
    const initialLatLng: [number, number] = [
      33.891792443690065, -84.0392303466797,
    ];

    // Initialize map
    const leafletMap = L.map("map").setView(initialLatLng, 20);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 15,
      minZoom: 3,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap);

    // Set up blue circle marker for the bus
    const initialMarker = L.circleMarker(initialLatLng, {
      color: "black", // Circle border color
      fillColor: "orange", // Circle fill color
      fillOpacity: 1, // Full opacity for the dot
      radius: 8, // Size of the dot
    }).addTo(leafletMap);

    // Set up accuracy circle
    const initialRadius = L.circle(initialLatLng, {
      radius: 100,
    }).addTo(leafletMap);

    // Save the map, marker, and radius to state
    setMap(leafletMap);
    setMarker(initialMarker);
    setRadius(initialRadius);

    // Clean up the map when the component unmounts
    return () => {
      leafletMap.remove();
    };
  }, []);

  // Fetch and update bus data every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const busID = localStorage.getItem("busID");
      const busData = await fetchBusData(busID);
      if (busData && marker && radius && map) {
        // Update marker and radius position
        map.setView([busData.lat, busData.lng]);
        marker.setLatLng([busData.lat, busData.lng]);
        radius.setLatLng([busData.lat, busData.lng]);
      }
    }, 3000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [map, marker, radius]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        id="map"
        className="w-full md:w-1/2 h-1/2 md:h-full z-0 rounded-xl"
      ></div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center bg-black-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Bus Monitoring Info</h1>
        <div className="border-2 p-2 rounded-xl">
          <h5>Bus #{localStorage.getItem("busID")}</h5>
          <p>
            {" "}
            Coodinate: {lat}, {long}{" "}
          </p>
          <p>Speed: {speed}</p>
          <p>Direction: {direction} degrees</p>
          <p>Last Updated: {recent}</p>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="m-4 px-10 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          {" "}
          Logout{" "}
        </button>
      </div>
    </div>
  );
};

export default Map;
