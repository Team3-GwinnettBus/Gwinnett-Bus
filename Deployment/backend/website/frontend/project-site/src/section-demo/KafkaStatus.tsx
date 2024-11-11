// purpose: build a module to monitor health of Kafka on the backend
// imports
import React, { useEffect, useState } from "react";

export default function KafkaStatus() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [topics, setTopics] = useState([]);
  const [consumerLag, setConsumerLag] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [consumerGroups, setConsumerGroups] = useState([]);
  const [graphImage, setGraphImage] = useState(null);

  const BASE_URL = "http://10.96.32.157:8000";

  // Fetch Kafka health status
  async function getKafkaHealth() {
    const response = await fetch(`${BASE_URL}/health`);
    return response.json();
  }

  // Fetch Kafka topics
  async function getKafkaTopics() {
    const response = await fetch(`${BASE_URL}/topics`);
    return response.json();
  }

  // Fetch Kafka health status
  useEffect(() => {
    const fetchHealth = async () => {
      const healthData = await getKafkaHealth();
      setHealthStatus(healthData);
    };
    fetchHealth();
  }, []);

  // Fetch Kafka topics
  useEffect(() => {
    const fetchTopics = async () => {
      const topicsData = await getKafkaTopics();
      setTopics(topicsData.topics || []);
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchConsumerGroups = async () => {
      try {
        const response = await fetch(`${BASE_URL}/consumer-groups`);
        if (!response.ok) throw new Error("Failed to fetch consumer groups");

        const data = await response.json();
        setConsumerGroups(data.consumer_groups || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumerGroups();
  }, []);

  useEffect(() => {
    const fetchLagGraph = async () => {
      try {
        const response = await fetch(
          "http://10.96.32.157:8000/consumer-lag-graph?topic=GCPS_Bus_Monitoring&group_id=bus-monitoring-group",
        );
        const data = await response.json();
        setGraphImage(data.image);
      } catch (error) {
        console.error("Error fetching consumer lag graph:", error);
      }
    };

    // Fetch the graph initially and then every 1 minute
    fetchLagGraph();
    const intervalId = setInterval(fetchLagGraph, 60000); // 60000ms = 1 minute
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 bg-background text-text rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">Kafka Health Monitor</h1>

      {/* Kafka Health Status */}
      <div className="p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Kafka Health</h2>
        {healthStatus ? (
          <div className="flex items-center space-x-3">
            <span
              className={`w-4 h-4 rounded-full ${
                healthStatus.status === "healthy"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            <p className="text-lg font-medium">
              {healthStatus.status === "healthy" ? "Healthy" : "Unhealthy"}
            </p>
          </div>
        ) : (
          <p className="text-accent">Loading health status...</p>
        )}
      </div>

      {/* Kafka Topics Table */}
      <div className="p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Topics</h2>
        {topics.length > 0 ? (
          <table className="min-w-full bg-background text-text border border-border shadow-md rounded-md">
            <thead className="bg-primary text-accent">
              <tr>
                <th className="py-3 px-6 text-left border-b border-border">
                  Topic Name
                </th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr key={index} className="even:bg-card">
                  <td className="py-3 px-6 border-b border-border">{topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-accent">Loading topics...</p>
        )}
      </div>

      {/* Kafka Groups Table */}
      <div className="p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Consumer Group ID</h2>
        {consumerGroups.length > 0 ? (
          <table className="min-w-full bg-background text-text border border-border shadow-md rounded-md">
            <thead className="bg-primary text-accent">
              <tr>
                <th className="py-3 px-6 text-left border-b border-border">
                  Consumer Group ID
                </th>
              </tr>
            </thead>
            <tbody>
              {consumerGroups.map((id, index) => (
                <tr key={index} className="even:bg-card">
                  <td className="py-3 px-6 border-b border-border">{id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-accent">Loading ids...</p>
        )}
      </div>

      {/* here i want to add the api that returns a graph */}
      <div className="p-6 bg-background text-text rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Kafka Consumer Lag Graph
        </h1>
        {graphImage ? (
          <img
            src={graphImage}
            alt="Kafka Consumer Lag"
            className="mx-auto border border-border rounded-md"
          />
        ) : (
          <p className="text-center text-accent">Loading graph...</p>
        )}
      </div>
    </div>
  );
}
