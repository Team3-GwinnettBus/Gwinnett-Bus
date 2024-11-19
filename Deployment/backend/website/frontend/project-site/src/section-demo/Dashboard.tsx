import DashMap from "./DashMap";
import Heatmap from "./Heatmap";
import KafkaStatus from "./KafkaStatus";

export default function Dashboard() {
  return (
    <div className="m-3">
      <DashMap />
      <br />
      <hr className="border-t border-border mt-4 mb-4" />
      <br />
      <Heatmap />
      <br />
      <hr className="border-t border-border mt-4 mb-4" />
      <KafkaStatus />
      <br />
      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.open("http://10.96.32.157:9021/", "_blank")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Confluent Dashboard
        </button>

        <button
          onClick={() => window.open("http://10.96.32.157:9000/", "_blank")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Simple Kafka Dashboard
        </button>

        <button
          onClick={() => window.open("http://10.96.32.157:3000/", "_blank")}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          Database View
        </button>
      </div>
    </div>
  );
}
