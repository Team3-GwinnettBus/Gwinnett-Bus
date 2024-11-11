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
    </div>
  );
}
