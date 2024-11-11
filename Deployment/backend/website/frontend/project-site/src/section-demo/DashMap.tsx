import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import schoolData from "./school_data.csv"; // Assuming the CSV is in the src folder

const DashMap = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [radiusCircles, setRadiusCircles] = useState([]);
  const [busDataList, setBusDataList] = useState([]);
  const [avgSpeed, setAvgSpeed] = useState(0);

  const navigate = useNavigate();

  // Function to fetch all bus data
  const fetchAllBusData = async () => {
    try {
      const response = await fetch(`http://10.96.32.157:8000/buses`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return data.buses;
    } catch (error) {
      console.error("Error fetching bus data:", error);
      return [];
    }
  };

  // Function to calculate the average speed
  const calculateAvgSpeed = (buses) => {
    if (buses.length === 0) return 0;
    const totalSpeed = buses.reduce((sum, bus) => sum + bus.Speed, 0);
    return (totalSpeed / buses.length).toFixed(2);
  };

  // Function to draw squares for schools
  const drawSchoolZones = (leafletMap: L.Map) => {
    fetch(schoolData)
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split("\n").slice(1); // Skip the header row

        rows.forEach((row, index) => {
          // Split the row by commas
          const [school, latitude, longitude] = row.split(",");

          // Ensure that latitude and longitude are present
          if (!latitude || !longitude) {
            console.error(`Missing coordinates at row ${index + 2}: ${row}`);
            return; // Skip this row if coordinates are missing
          }

          // Trim whitespace and parse the latitude and longitude
          const lat = parseFloat(latitude.trim());
          const lng = parseFloat(longitude.trim());

          // Check if lat/lng are valid numbers
          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid coordinates at row ${index + 2}: ${row}`);
            return; // Skip this row if invalid
          }

          // Determine the school type based on its name and set a lighter color
          let color = "#A6D7A3"; // Light green for elementary
          if (school.includes("Middle")) color = "#A3C5D7"; // Light blue for middle school
          if (school.includes("High")) color = "#C5A3D7"; // Light purple for high school

          // Define a square with a side length of about 0.5 miles (approx. 0.003 degrees)
          const offset = 0.003;

          const bounds: L.LatLngBoundsLiteral = [
            [lat - offset, lng - offset] as [number, number],
            [lat + offset, lng + offset] as [number, number],
          ];

          try {
            // Create the rectangle zone
            const zone = L.rectangle(bounds, {
              color: color,
              weight: 2,
              fillOpacity: 0.1,
            });

            // Create a tooltip for the school name
            const tooltip = zone.bindTooltip(school, {
              permanent: false,
              direction: "top",
              offset: [0, -10],
              opacity: 0.9,
            });

            // Show the tooltip on hover
            zone.on("mouseover", () => tooltip.openTooltip());
            zone.on("mouseout", () => tooltip.closeTooltip());

            // Show the tooltip on right-click
            zone.on("contextmenu", (e) => {
              tooltip.openTooltip();
              e.originalEvent.preventDefault();
            });

            // Hide the tooltip on any other click on the map
            leafletMap.on("click", () => tooltip.closeTooltip());

            zone.addTo(leafletMap);
          } catch (error) {
            console.error(`Error creating zone for row ${index + 2}:`, error);
          }
        });
      })
      .catch((error) => console.error("Error loading school data:", error));
  };

  // Initialize the map and markers when the component mounts
  useEffect(() => {
    const initialLatLng: L.LatLngTuple = [
      33.891792443690065, -84.0392303466797,
    ];

    const leafletMap = L.map("map").setView(initialLatLng, 10);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 15,
      minZoom: 3,
      attribution: "&copy; OpenStreetMap",
    }).addTo(leafletMap);

    const initialMarkers = [];
    const initialRadiusCircles = [];

    const numBuses = 100;

    for (let i = 0; i < numBuses; i++) {
      const marker = L.circleMarker([0, 0], {
        color: "black",
        fillColor: "orange",
        fillOpacity: 1,
        radius: 8,
      }).addTo(leafletMap);

      const radius = L.circle([0, 0], {
        radius: 100,
        color: "blue",
      }).addTo(leafletMap);

      initialMarkers.push(marker);
      initialRadiusCircles.push(radius);
    }

    setMap(leafletMap);
    setMarkers(initialMarkers);
    setRadiusCircles(initialRadiusCircles);

    // Draw school zones
    drawSchoolZones(leafletMap);

    // Bring bus markers to the front
    initialMarkers.forEach((marker) => marker.bringToFront());

    // Zoom in a little to the map
    leafletMap.zoomIn();

    return () => {
      leafletMap.remove();
    };
  }, []);

  // Fetch and update bus data every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const buses = await fetchAllBusData();
      setBusDataList(buses);

      // Calculate the average speed
      const avgSpeed = calculateAvgSpeed(buses);
      setAvgSpeed(parseFloat(typeof avgSpeed === "string" ? avgSpeed : "0"));

      if (buses && markers.length > 0 && radiusCircles.length > 0) {
        buses.forEach((bus, index) => {
          if (index < markers.length) {
            const latLng = [bus.Latitude, bus.Longitude];

            // Update marker position
            markers[index].setLatLng(latLng);
            markers[index].bindTooltip(`Bus ID: ${bus.BusID}`, {
              permanent: false,
              direction: "top",
              offset: [0, -10],
            });

            // Update the radius circle position
            radiusCircles[index].setLatLng(latLng);

            // Calculate the direction line based on the heading
            const heading = bus.Heading;
            const length = 0.001; // Adjust this value to change the length of the line
            const radian = (heading * Math.PI) / 180;

            // Calculate the endpoint of the line based on heading
            const endLat = bus.Latitude + length * Math.cos(radian);
            const endLng = bus.Longitude + length * Math.sin(radian);

            // Add or update the polyline for direction
            if (markers[index].directionLine) {
              markers[index].directionLine.setLatLngs([
                latLng,
                [endLat, endLng],
              ]);
            } else {
              const directionLine = L.polyline([latLng, [endLat, endLng]], {
                color: "black",
                weight: 2,
              }).addTo(map);
              markers[index].directionLine = directionLine;
            }
          }
        });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [markers, radiusCircles, map]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <div id="map" className="w-full md:w-2/3 h-full z-0 rounded-xl"></div>
      <div className="w-full md:w-1/3 h-full flex flex-col p-4 overflow-y-auto border-l border-border">
        <h1 className="text-2xl font-bold mb-4 text-center text-text">
          Bus Monitoring Info
        </h1>
        <h2 className="text-xl font-semibold text-accent mb-4 text-center">
          Avg Bus Speed: {avgSpeed} mph
        </h2>
        {busDataList.length > 0 ? (
          busDataList.map((bus, index) => (
            <div
              key={index}
              className="p-4 mb-4 bg-primary rounded-lg shadow-md transition-all duration-400 hover:bg-accent hover:text-background"
            >
              <h2 className="text-xl font-semibold text-text">
                Bus ID: {bus.BusID}
              </h2>
              <p className="text-text">Speed: {bus.Speed} mph</p>
              <p className="text-text">Latitude: {bus.Latitude}</p>
              <p className="text-text">Longitude: {bus.Longitude}</p>
              <p className="text-text">Direction: {bus.Heading}°</p>
              <p className="text-text">
                Last Updated: {new Date(bus.LastUpdated).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-accent">No bus data available</p>
        )}
      </div>
    </div>
  );
};

export default DashMap;
