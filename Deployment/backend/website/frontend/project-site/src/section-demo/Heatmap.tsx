import React, { useEffect, useState } from "react";

const Heatmap = () => {
  const [mapHtml, setMapHtml] = useState("");

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch("http://10.96.32.157:8000/heatmap");
        const data = await response.text(); // Get HTML as text
        setMapHtml(data);
      } catch (error) {
        console.error("Error fetching heatmap:", error);
      }
    };

    fetchMap();
    const intervalId = setInterval(fetchMap, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="m-8 max-w-lg">
      <h1>Heatmap</h1>
      <div
        className="heatmap-container"
        dangerouslySetInnerHTML={{ __html: mapHtml }}
      />
    </div>
  );
};

export default Heatmap;
