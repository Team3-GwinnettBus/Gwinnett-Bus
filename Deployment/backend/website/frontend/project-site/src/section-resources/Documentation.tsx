import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "kafka", title: "Kafka" },
    { id: "mssql", title: "Microsoft SQL" },
    { id: "producer-simulation", title: "Producer / Simulation" },
    { id: "consumer-webserver", title: "Consumer / Webserver" },
    {
      id: "deployment-containerization",
      title: "Deployment / Containerization",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 border-r bg-background text-text">
        <h2 className="text-xl font-bold mb-4">Documentation</h2>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Button
                  variant={activeSection === section.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full text-left"
                >
                  {section.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-card text-text">
        <h1 className="text-3xl font-bold mb-6">
          {sections.find((s) => s.id === activeSection)?.title}
        </h1>
        <div className="prose prose-invert max-w-none">
          {activeSection === "introduction" && (
            <>
              <h2>Overview</h2>
              <p>
                The GCPS Live Bus Monitoring System is an advanced telemetry
                solution designed to streamline real-time bus tracking for
                Gwinnett County Public Schools (GCPS). This system uses Apache
                Kafka as a high-performance event streaming platform and
                Microsoft SQL Server for reliable data storage and analytics.
              </p>
              <p>
                By replacing the traditional API polling model with a robust
                event-driven architecture, the system enables efficient
                real-time data collection, processing, and visualization. It
                ensures faster responses to changes in bus telemetry, such as
                location, speed, and heading, improving overall system
                performance and scalability.
              </p>
              <hr className="my-6 border-t border-border" />
              <p>Key components include:</p>
              <ul>
                <li>
                  <strong>Producers:</strong> Simulate bus telemetry and send
                  data to Kafka for processing.
                </li>
                <li>
                  <strong>Consumers:</strong> Process Kafka events, validate
                  data, and store it in SQL Server.
                </li>
                <li>
                  <strong>Webserver and APIs:</strong> Provide access to
                  real-time bus data and heatmap visualizations.
                </li>
                <li>
                  <strong>Containerized Deployment:</strong> Ensures seamless
                  scalability and maintainability using Podman.
                </li>
              </ul>
              <br />
              <p>
                This architecture addresses the specific needs of the GCPS bus
                fleet, offering a scalable, maintainable, and high-performance
                solution for real-time telemetry management.
              </p>
            </>
          )}

          {activeSection === "kafka" && (
            <>
              <h2>Kafka Overview</h2>
              <p>
                Apache Kafka is a distributed event streaming platform that
                powers real-time data processing. In this system, buses serve as
                producers, streaming telemetry data (such as location and speed)
                to the "Bus_Data" topic on the Kafka server.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>
                  High throughput and low latency for real-time streaming.
                </li>
                <li>Scalable architecture to support thousands of buses.</li>
                <li>Reliable event storage and replay for data persistence.</li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h2>What is KRaft?</h2>
              <p>
                KRaft (Kafka Raft) is the new consensus mechanism introduced in
                Kafka to replace Apache ZooKeeper. It makes Kafka self-managed
                by using an internal Raft-based protocol for metadata
                management.
              </p>
              <h3>Benefits of KRaft:</h3>
              <ul>
                <li>
                  Simplifies the architecture by removing ZooKeeper
                  dependencies.
                </li>
                <li>
                  Improves scalability and resilience for metadata operations.
                </li>
                <li>Easier deployment and configuration.</li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h2>Installing Kafka</h2>
              <p>Follow these steps to install Kafka:</p>
              <h3>Step 1: Download Kafka</h3>
              <pre>
                <code className="text-yellow-400">
                  wget https://dlcdn.apache.org/kafka/3.8.0/kafka_2.13-3.8.0.tgz
                </code>
              </pre>
              <h3>Step 2: Extract the Downloaded File</h3>
              <pre>
                <code className="text-yellow-400">
                  tar -xzf kafka_2.13-3.8.0.tgz
                  <br />
                  cd kafka_2.13-3.8.0
                </code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h2>Running Kafka with KRaft</h2>
              <h3>Step 1: Initialize Metadata</h3>
              <p>
                Initialize Kafka's metadata storage with a unique cluster ID:
              </p>
              <pre>
                <code className="text-green-400">
                  ./bin/kafka-storage.sh format -t $(uuidgen) -c
                  ./config/kraft/server.properties
                </code>
              </pre>
              <h3>Step 2: Start Kafka</h3>
              <p>Run Kafka using the KRaft configuration:</p>
              <pre>
                <code className="text-green-400">
                  sudo ./bin/kafka-server-start.sh -daemon
                  ./config/kraft/server.properties
                </code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h2>Using Kafka</h2>
              <h3>1. Creating a Topic</h3>
              <p>
                Create a topic named `GCPS_Bus_Monitoring` with 3 partitions:
              </p>
              <pre>
                <code className="text-blue-400">
                  bin/kafka-topics.sh --create --topic GCPS_Bus_Monitoring
                  --partitions 3 --replication-factor 1 --bootstrap-server
                  localhost:9092
                </code>
              </pre>
              <h3>2. Checking Partitions</h3>
              <p>
                View partition details for the `bus-monitoring-group` consumer
                group:
              </p>
              <pre>
                <code className="text-blue-400">
                  bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092
                  --describe --group bus-monitoring-group
                </code>
              </pre>
              <h3>3. Altering a Topic</h3>
              <p>Increase the number of partitions for the topic:</p>
              <pre>
                <code className="text-blue-400">
                  bin/kafka-topics.sh --alter --topic GCPS_Bus_Monitoring
                  --partitions 6 --bootstrap-server localhost:9092
                </code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h2>Additional Resources</h2>
              <p>
                For more detailed instructions on initializing and downloading
                Kafka, refer to the project GitHub repository. Additionally,
                Confluent provides a managed Kafka solution, offering enterprise
                features such as monitoring tools, schema registry, and easier
                scalability. Learn more at{" "}
                <a
                  href="https://www.confluent.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Confluent's official website
                </a>
                .
              </p>
            </>
          )}

          {activeSection === "mssql" && (
            <>
              <h2>What is Microsoft SQL Server?</h2>
              <p>
                Microsoft SQL Server (MSSQL) is a relational database management
                system (RDBMS) developed by Microsoft. It is designed for
                enterprise-grade data storage, processing, and analytics. MSSQL
                supports both structured and semi-structured data and offers
                robust tools for querying, indexing, and securing data.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>
                  **High Performance:** Optimized for large-scale data storage
                  and processing.
                </li>
                <li>
                  **Security:** Built-in tools for encryption, role-based
                  access, and data auditing.
                </li>
                <li>
                  **Cross-Platform:** Available for Windows and Linux
                  environments.
                </li>
              </ul>
              <p>
                In this project, Microsoft SQL Server is used as the backend
                database for storing validated telemetry data from the Kafka
                pipeline.
              </p>

              <hr className="my-6 border-t border-border" />

              <h2>Installing Microsoft SQL Server</h2>
              <h3>Step 1: Add MSSQL Repository</h3>
              <pre>
                <code className="text-yellow-400">
                  sudo curl -o /etc/yum.repos.d/mssql-server.repo
                  https://packages.microsoft.com/config/rhel/8/mssql-server-2019.repo
                </code>
              </pre>
              <h3>Step 2: Install MSSQL Server</h3>
              <pre>
                <code className="text-yellow-400">
                  sudo dnf install -y mssql-server
                </code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h2>Setting Up Microsoft SQL Server</h2>
              <h3>Step 1: Configure the Server</h3>
              <pre>
                <code className="text-green-400">
                  sudo /opt/mssql/bin/mssql-conf setup
                </code>
              </pre>
              <p>During the setup, follow these prompts:</p>
              <ul>
                <li>
                  Select the Developer edition (Option <strong>2</strong>).
                </li>
                <li>
                  Accept the license terms by typing <strong>Yes</strong>.
                </li>
                <li>
                  Set up the system administrator (SA) account with the
                  following credentials:
                  <ul>
                    <li>
                      <strong>Username:</strong> SA
                    </li>
                    <li>
                      <strong>Password:</strong> HootyHoo!
                    </li>
                  </ul>
                </li>
              </ul>
              <h3>Step 2: Manage the MSSQL Server</h3>
              <p>
                Start, stop, or check the server status with these commands:
              </p>
              <pre>
                <code className="text-green-400">
                  sudo systemctl start mssql-server
                  <br />
                  sudo systemctl enable mssql-server
                  <br />
                  sudo systemctl stop mssql-server
                  <br />
                  sudo systemctl status mssql-server
                </code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h2>Using Microsoft SQL Server</h2>
              <h3>Step 1: Install CLI Tools</h3>
              <p>
                Install tools for managing the database via the command line:
              </p>
              <pre>
                <code className="text-blue-400">
                  sudo curl -o /etc/yum.repos.d/msprod.repo
                  https://packages.microsoft.com/config/rhel/8/prod.repo
                  <br />
                  sudo dnf install -y mssql-tools unixODBC-devel
                  <br />
                  echo 'export PATH="$PATH:/opt/mssql-tools/bin"' -- (replace
                  line with angle bracket) ~/.bash_profile
                  <br />
                  source ~/.bash_profile
                </code>
              </pre>
              <h3>Step 2: Connect to the Database</h3>
              <p>
                Use the following command to connect to the server as the SA
                user:
              </p>
              <pre>
                <code className="text-blue-400">
                  sqlcmd -S localhost -U SA -P 'HootyHoo!'
                </code>
              </pre>
              <h3>Step 3: Execute SQL Files</h3>
              <p>
                To create or manage the database, run SQL files using the `-i`
                option:
              </p>
              <pre>
                <code className="text-blue-400">
                  sqlcmd -S localhost -U SA -P 'HootyHoo!' -i dbsetup.sql
                </code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h2>Managing with DBGate</h2>
              <p>
                DBGate is a web-based database management tool that runs on port
                3000. It allows administrators to manage and query the Microsoft
                SQL Server through a user-friendly interface.
              </p>
              <h3>Access DBGate:</h3>
              <p>Navigate to the following URL in your browser:</p>
              <pre>
                <code className="text-blue-400">http://10.96.32.157/:3000</code>
              </pre>
              <h3>Features of DBGate:</h3>
              <ul>
                <li>Execute queries and view results.</li>
                <li>Visualize database schemas and relationships.</li>
                <li>Perform CRUD operations on tables.</li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h2>Database Specifications</h2>
              <p>The project uses the following database version:</p>
              <pre>
                <code className="text-accent">
                  Microsoft SQL Server 2019 (RTM-CU28-GDR) (KB5046060) -
                  15.0.4395.2 (X64)
                  <br />
                  Sep 24 2024 07:38:17
                  <br />
                  Developer Edition (64-bit) on Linux
                </code>
              </pre>
            </>
          )}

          {activeSection === "producer-simulation" && (
            <>
              <h2>Producer / Simulation</h2>

              <h3>Goal</h3>
              <p>
                The goal of the producer in this project is to simulate
                telemetry data from buses and send it to Kafka for real-time
                processing. Each bus generates GPS location, speed, and heading
                data, which is published to the Kafka topic{" "}
                <code>GCPS_Bus_Monitoring</code>. This enables efficient data
                streaming and downstream processing.
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>How This is Accomplished</h3>
              <p>
                The following steps explain how the producer and simulation work
                together:
              </p>

              <h4>1. Kafka Producer Setup</h4>
              <pre>
                <code className="text-blue-400">
                  TOPIC = 'GCPS_Bus_Monitoring'
                  <br />
                  SERVER = 'host.containers.internal:9092'
                  <br />
                  <br />
                  config = {"{"}
                  <br />
                  &nbsp;&nbsp;'bootstrap.servers': SERVER,
                  <br />
                  &nbsp;&nbsp;'client.id': 'Gwinnett-Bus',
                  <br />
                  &nbsp;&nbsp;'linger.ms': 50,
                  <br />
                  &nbsp;&nbsp;'batch.size': 64 * 1024
                  <br />
                  {"}"}
                  <br />
                  <br />
                  producer = Producer(config)
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
              </p>
              <ul>
                <li>
                  <code>bootstrap.servers</code>: Specifies the Kafka server
                  address.
                </li>
                <li>
                  <code>client.id</code>: Identifies the producer instance for
                  tracking.
                </li>
                <li>
                  <code>linger.ms</code>: Configures batching delay to improve
                  throughput.
                </li>
                <li>
                  <code>batch.size</code>: Sets the maximum size of a batch
                  before sending.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h4>2. Sending Data</h4>
              <pre>
                <code className="text-green-400">
                  def send_data(data):
                  <br />
                  &nbsp;&nbsp;value = json.dumps(data).encode('utf-8')
                  <br />
                  &nbsp;&nbsp;producer.produce(TOPIC, value=value)
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
              </p>
              <ul>
                <li>
                  <code>json.dumps(data)</code>: Converts telemetry data into
                  JSON format.
                </li>
                <li>
                  <code>encode('utf-8')</code>: Encodes JSON data for Kafka
                  messaging.
                </li>
                <li>
                  <code>producer.produce</code>: Publishes the data to the Kafka
                  topic.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h4>3. Simulating Bus Movement</h4>
              <p>
                The <code>bussimulation.py</code> file models the behavior of
                buses traveling along predefined routes and updates their
                telemetry data in real-time.
              </p>
              <pre>
                <code className="text-yellow-400">
                  class Bus:
                  <br />
                  &nbsp;&nbsp;def __init__(self, asset_id, update_queue):
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;self.asset_id = {"{"}"id": asset_id
                  {"}"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;self.update_queue = update_queue
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;self.path = self.get_path() # Generate
                  random route
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong> Each bus generates a random path,
                computes its location, and sends updated telemetry data to the
                producer.
              </p>

              <hr className="my-6 border-t border-border" />

              <h4>Map Data Processing</h4>
              <pre>
                <code className="text-blue-400">
                  if not os.path.exists('mapdata/gwinnett.graphml'):
                  <br />
                  &nbsp;&nbsp;print("Fetching graph data")
                  <br />
                  &nbsp;&nbsp;graph = osmnx.graph_from_place("Gwinnett County,
                  Georgia, USA", network_type='drive')
                  <br />
                  <br />
                  &nbsp;&nbsp;largest_component =
                  max(networkx.strongly_connected_components(graph), key=len)
                  <br />
                  &nbsp;&nbsp;network = networkx.subgraph(graph,
                  largest_component)
                  <br />
                  <br />
                  &nbsp;&nbsp;osmnx.save_graphml(network,
                  'mapdata/gwinnett.graphml')
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
              </p>
              <ul>
                <li>
                  The map data is fetched from OpenStreetMap for Gwinnett County
                  and processed into a graph representation using{" "}
                  <code>osmnx</code>.
                </li>
                <li>
                  The largest strongly connected subgraph (representing the
                  largest contiguous drivable area) is extracted and saved as a
                  <code>.graphml</code> file.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h4>Edge Data Processing</h4>
              <pre>
                <code className="text-green-400">
                  for u, v, key, data in network.edges(keys=True, data=True):
                  <br />
                  &nbsp;&nbsp;pos_u = network.nodes[u]
                  <br />
                  &nbsp;&nbsp;pos_v = network.nodes[v]
                  <br />
                  <br />
                  &nbsp;&nbsp;length = haversine_distance(pos_u['y'],
                  pos_u['x'], pos_v['y'], pos_v['x'])
                  <br />
                  <br />
                  &nbsp;&nbsp;dx = pos_v['x'] - pos_u['x']
                  <br />
                  &nbsp;&nbsp;dy = pos_v['y'] - pos_u['y']
                  <br />
                  &nbsp;&nbsp;heading = math.degrees(math.atan2(dy, dx))
                  <br />
                  &nbsp;&nbsp;heading = (heading + 360) % 360
                  <br />
                  <br />
                  &nbsp;&nbsp;edges[(u, v)] = {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"length": length,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"heading": heading,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"start_lat": pos_u['y'],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"start_lon": pos_u['x'],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"end_lat": pos_v['y'],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"end_lon": pos_v['x']
                  <br />
                  &nbsp;&nbsp;{"}"}
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
              </p>
              <ul>
                <li>
                  For each edge in the road network graph, the Haversine formula
                  calculates the distance between nodes (latitudes and
                  longitudes).
                </li>
                <li>
                  The edge's direction (heading) is computed using trigonometry.
                </li>
                <li>
                  Each edge's metadata is stored in a dictionary, which is
                  serialized into the <code>edge_data.pkl</code> file for later
                  use.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h4>Using Map Data in the Simulation</h4>
              <p>
                The bus simulation loads this preprocessed map data to simulate
                routes:
              </p>
              <pre>
                <code className="text-yellow-400">
                  network = osmnx.load_graphml('mapdata/gwinnett.graphml')
                  <br />
                  with open('mapdata/edge_data.pkl', 'rb') as f:
                  <br />
                  &nbsp;&nbsp;edges = pickle.load(f)
                </code>
              </pre>
              <p>
                During runtime, each bus traverses a random route in the
                network, referencing the preprocessed edge data for distances
                and headings.
              </p>

              <hr className="my-6 border-t border-border" />

              <h4>4. Collecting and Sending Data to Kafka</h4>
              <p>
                The <code>DataCollector</code> class processes telemetry updates
                and sends them to Kafka:
              </p>
              <pre>
                <code className="text-blue-400">
                  class DataCollector:
                  <br />
                  &nbsp;&nbsp;@staticmethod
                  <br />
                  &nbsp;&nbsp;def process_updates(updates):
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;for update in updates:
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;send_data(update)
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;flush() # Ensure all data is sent
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
              </p>
              <ul>
                <li>
                  <code>send_data(update)</code>: Sends telemetry data to Kafka.
                </li>
                <li>
                  <code>flush()</code>: Ensures all buffered messages are sent
                  to Kafka.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h4>5. Simulation Execution</h4>
              <p>
                The <code>main</code> function initializes buses, runs the
                simulation, and collects telemetry data:
              </p>
              <pre>
                <code className="text-green-400">
                  async def main():
                  <br />
                  &nbsp;&nbsp;update_queue = asyncio.Queue()
                  <br />
                  &nbsp;&nbsp;num_buses = 100
                  <br />
                  <br />
                  &nbsp;&nbsp;buses = [Bus(i + 1, update_queue) for i in
                  range(num_buses)]
                  <br />
                  &nbsp;&nbsp;bus_tasks = [asyncio.create_task(bus.run()) for
                  bus in buses]
                  <br />
                  <br />
                  &nbsp;&nbsp;collector = DataCollector(update_queue)
                  <br />
                  &nbsp;&nbsp;collector_task =
                  asyncio.create_task(collector.run())
                  <br />
                  <br />
                  &nbsp;&nbsp;await asyncio.gather(*bus_tasks, collector_task)
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                This function orchestrates the simulation by managing the buses
                and sending their updates to Kafka.
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Key Takeaways</h3>
              <ul>
                <li>
                  The producer simulates 100 buses, each sending telemetry data
                  to Kafka.
                </li>
                <li>
                  Real-time updates ensure that data pipelines downstream can
                  process and analyze the data efficiently.
                </li>
                <li>
                  The asynchronous design of the simulation makes it scalable to
                  handle thousands of buses.
                </li>
              </ul>
            </>
          )}

          {activeSection === "consumer-webserver" && (
            <>
              <h2>Consumer / Webserver</h2>
              <p>
                The consumer and webserver components work together to process
                telemetry data from Kafka, store it in the Microsoft SQL Server
                database, and expose it through APIs for frontend use. This
                architecture ensures seamless real-time data streaming,
                processing, and visualization.
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Consumer Loop</h3>
              <p>
                The consumer listens to the Kafka topic{" "}
                <code>GCPS_Bus_Monitoring</code> and processes incoming
                telemetry data.
              </p>
              <pre>
                <code className="text-green-400">
                  from confluent_kafka import Consumer
                  <br />
                  consumer = Consumer({"{"}
                  <br />
                  &nbsp;&nbsp;"bootstrap.servers":
                  "host.containers.internal:9092",
                  <br />
                  &nbsp;&nbsp;"group.id": "bus-monitoring-group",
                  <br />
                  &nbsp;&nbsp;"auto.offset.reset": "latest",
                  <br />
                  {"}"})
                  <br />
                  consumer.subscribe(["GCPS_Bus_Monitoring"])
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                <ul>
                  <li>
                    <code>bootstrap.servers</code>: Specifies the Kafka broker
                    address.
                  </li>
                  <li>
                    <code>group.id</code>: Identifies the consumer group for
                    tracking.
                  </li>
                  <li>
                    <code>auto.offset.reset</code>: Ensures the consumer reads
                    new messages.
                  </li>
                </ul>
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Data Processing</h3>
              <p>
                Incoming messages are parsed, validated, and sent to the
                database using the <code>process_message</code> function.
              </p>
              <pre>
                <code className="text-blue-400">
                  def process_message(message):{"{"}
                  <br />
                  &nbsp;&nbsp;data = json.loads(message.value().decode('utf-8'))
                  <br />
                  &nbsp;&nbsp;db_manager.setBusData({"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"BusID": data["asset"]["id"],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"latitude":
                  data["location"]["latitude"],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"longitude":
                  data["location"]["longitude"],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"speed":
                  data["speed"]["gpsSpeedMetersPerSecond"],
                  <br />
                  {"}"})
                  <br />
                  {"}"}
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                <ul>
                  <li>The data is parsed into JSON format.</li>
                  <li>
                    Each data packet is formatted for insertion into the SQL
                    database.
                  </li>
                  <li>Errors during processing are logged for debugging.</li>
                </ul>
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Database Integration</h3>
              <p>
                The <code>DataManager</code> class is used to insert and query
                data in the Microsoft SQL Server database.
              </p>
              <pre>
                <code className="text-green-400">
                  class DataManager:{"{"}
                  <br />
                  &nbsp;&nbsp;def setBusData(self, data):{"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;self.db_cursor.execute(
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"INSERT INTO
                  CurrentBusLocations (BusID, latitude, longitude, speed) VALUES
                  (?, ?, ?, ?)",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(data["BusID"],
                  data["latitude"], data["longitude"], data["speed"]))
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;self.db_connection.commit()
                  <br />
                  {"}"}
                  <br />
                  {"}"}
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                <ul>
                  <li>
                    <code>setBusData</code>: Inserts or updates telemetry data
                    into the <code>CurrentBusLocations</code> table.
                  </li>
                  <li>Changes are committed after every successful query.</li>
                </ul>
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Webserver and API</h3>
              <p>
                The FastAPI webserver exposes API endpoints for querying bus
                data and visualizing it on the frontend.
              </p>
              <pre>
                <code className="text-yellow-400">
                  @app.get("/bus/int: bus_id ")
                  <br />
                  async def get_bus_location(bus_id: int):{"{"}
                  <br />
                  &nbsp;&nbsp;conn = get_db_connection()
                  <br />
                  &nbsp;&nbsp;cursor = conn.cursor()
                  <br />
                  &nbsp;&nbsp;cursor.execute("SELECT * FROM CurrentBusLocations
                  WHERE BusID = ?", bus_id)
                  <br />
                  &nbsp;&nbsp;row = cursor.fetchone()
                  <br />
                  &nbsp;&nbsp;return {"{"}"BusID": row[0], "Latitude": row[1],
                  "Longitude": row[2], "Speed": row[3]{"}"}
                  <br />
                  {"}"}
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                <ul>
                  <li>
                    The <code>/bus/{"{bus_id}"}</code> endpoint fetches the
                    latest data for a specific bus.
                  </li>
                  <li>
                    SQL queries retrieve data directly from the{" "}
                    <code>CurrentBusLocations</code> table.
                  </li>
                </ul>
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Heatmap Visualization</h3>
              <p>
                A heatmap of all bus locations is generated using the{" "}
                <code>folium</code> library.
              </p>
              <pre>
                <code className="text-blue-400">
                  @app.get("/heatmap")
                  <br />
                  async def get_heatmap():{"{"}
                  <br />
                  &nbsp;&nbsp;m = folium.Map(location=[33.95, -84.07],
                  zoom_start=10)
                  <br />
                  &nbsp;&nbsp;HeatMap([(row[1], row[2]) for row in
                  rows]).add_to(m)
                  <br />
                  &nbsp;&nbsp;return m._repr_html_()
                  <br />
                  {"}"}
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                <ul>
                  <li>
                    The heatmap shows bus locations with intensity based on
                    their proximity.
                  </li>
                  <li>
                    The <code>folium</code> library is used to render an
                    interactive map.
                  </li>
                </ul>
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Kafka Monitoring</h3>
              <p>
                The webserver also provides endpoints to monitor the Kafka
                system's health and consumer performance.
              </p>
              <pre>
                <code className="text-green-400">
                  @app.get("/health")
                  <br />
                  async def kafka_health():{"{"}
                  <br />
                  &nbsp;&nbsp;admin_client =
                  KafkaAdminClient(bootstrap_servers=KAFKA_BROKER)
                  <br />
                  &nbsp;&nbsp;brokers = admin_client.describe_cluster()
                  <br />
                  &nbsp;&nbsp;return {"{"}"status": "healthy", "cluster_id":
                  brokers['cluster_id']{"}"}
                  <br />
                  {"}"}
                </code>
              </pre>
              <p>
                <strong>Explanation:</strong>
                <ul>
                  <li>
                    <code>/health</code>: Confirms the Kafka broker is
                    operational.
                  </li>
                  <li>
                    <code>/api/consumer-lag</code>: Measures lag for consumer
                    groups.
                  </li>
                </ul>
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>Key Takeaways</h3>
              <ul>
                <li>
                  The consumer retrieves telemetry data from Kafka and inserts
                  it into the SQL database.
                </li>
                <li>
                  FastAPI serves as a bridge to expose the database data through
                  APIs for frontend use.
                </li>
                <li>
                  Monitoring tools ensure real-time system performance and
                  reliability.
                </li>
              </ul>
            </>
          )}

          {activeSection === "deployment-containerization" && (
            <>
              <h2>Deployment / Containerization</h2>
              <p>
                The system is deployed as a containerized application using
                Podman. This deployment approach ensures consistent environments
                across development, testing, and production.
              </p>

              <hr className="my-6 border-t border-border" />

              <h3>What is Podman?</h3>
              <p>
                Podman is an open-source, daemonless container management tool
                designed for managing OCI-compliant containers and pods. Unlike
                Docker, Podman doesn’t require a running daemon, and it allows
                users to run containers without root privileges.
              </p>
              <h4>Why Podman is Beneficial:</h4>
              <ul>
                <li>
                  <strong>Security:</strong> Rootless containers reduce security
                  risks.
                </li>
                <li>
                  <strong>Daemonless Architecture:</strong> Reduces resource
                  overhead and simplifies container management.
                </li>
                <li>
                  <strong>Docker Compatibility:</strong> Fully supports Docker
                  images and commands.
                </li>
                <li>
                  <strong>Pod Support:</strong> Simplifies running multiple
                  related containers together.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h3>Producer and Consumer Containers</h3>
              <p> Both containers use RHEL UBI8 Python 3.11 ENV</p>
              <p>
                The system includes two primary containers: one for the producer
                and one for the consumer/webserver.
              </p>
              <h4>Producer Container:</h4>
              <ul>
                <li>
                  Runs the Kafka producer simulation (
                  <code>bussimulation.py</code>).
                </li>
                <li>
                  Sends telemetry data (e.g., GPS, speed, heading) to the Kafka
                  topic <code>GCPS_Bus_Monitoring</code>.
                </li>
                <li>
                  Built using a Red Hat UBI Python 3.11 image for enhanced
                  security and stability.
                </li>
              </ul>
              <h4>Consumer Container:</h4>
              <ul>
                <li>
                  Runs the FastAPI webserver (<code>app.py</code>).
                </li>
                <li>
                  Consumes Kafka data, processes it, and stores it in the SQL
                  Server database.
                </li>
                <li>
                  Exposes APIs for frontend interaction and provides
                  visualization tools like heatmaps.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h3>What is a Pod?</h3>
              <p>
                A pod is a group of one or more containers that share the same
                network namespace. Containers in a pod can communicate as if
                they are on the same machine.
              </p>
              <h4>Pod Contents:</h4>
              <ul>
                <li>
                  Producer Container: Simulates and streams telemetry data to
                  Kafka.
                </li>
                <li>
                  Consumer Container: Processes data from Kafka and serves APIs.
                </li>
                <li>
                  Kafdrop: Provides a web-based UI for managing Kafka topics and
                  brokers.
                </li>
                <li>
                  DBGate: A web-based SQL client for interacting with the
                  database.
                </li>
                <li>
                  Control Center: Monitors Kafka clusters and consumer
                  performance.
                </li>
              </ul>

              <hr className="my-6 border-t border-border" />

              <h3>Start and Stop Scripts</h3>
              <h4>
                Run Script (<code>run_pod.sh</code>):
              </h4>
              <p>
                Automates the process of building and running containers within
                the pod. Key steps include:
              </p>
              <pre>
                <code className="text-green-400">
                  podman build -t localhost/bus-project-producer
                  ./backend/producer
                  <br />
                  podman build -t localhost/bus-project-web ./backend/website
                  <br />
                  podman play kube pod.yml
                </code>
              </pre>
              <p>
                <strong>Permissions:</strong> Ensure the script is executable:
              </p>
              <pre>
                <code className="text-yellow-400">chmod +x run_pod.sh</code>
              </pre>
              <p>Run the script:</p>
              <pre>
                <code className="text-yellow-400">./run_pod.sh</code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h4>
                Stop Script (<code>stop_pod.sh</code>):
              </h4>
              <p>
                Stops and removes all containers and pods, cleaning up unused
                resources. Key steps include:
              </p>
              <pre>
                <code className="text-green-400">
                  podman rm -f -a
                  <br />
                  podman pod rm -f -a
                  <br />
                  podman system prune -f
                </code>
              </pre>
              <p>
                <strong>Permissions:</strong> Ensure the script is executable:
              </p>
              <pre>
                <code className="text-yellow-400">chmod +x stop_pod.sh</code>
              </pre>
              <p>Run the script:</p>
              <pre>
                <code className="text-yellow-400">./stop_pod.sh</code>
              </pre>

              <hr className="my-6 border-t border-border" />

              <h3>Key Takeaways</h3>
              <ul>
                <li>
                  Podman provides a secure, daemonless alternative to Docker for
                  container management.
                </li>
                <li>
                  The producer and consumer containers work in tandem to process
                  and visualize real-time telemetry data.
                </li>
                <li>
                  Scripts automate container lifecycle management for easy
                  deployment and cleanup.
                </li>
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
