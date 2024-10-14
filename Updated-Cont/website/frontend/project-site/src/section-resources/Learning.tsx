import { LargeCard } from "@/components/large-card";

export default function Learning() {
  return (
    <div className="flex flex-col justify-center items-center">
      <br />
      <h1 className="text-3xl mb-6">Learning Resources</h1>
      <LargeCard>
        <h1> Apache Kafka </h1>
        <p>Content goes here...</p>
      </LargeCard>
      <LargeCard>
        <h1> Microsoft SQL </h1>
        <p>Content goes here...</p>
      </LargeCard>
      <LargeCard>
        <h1> Red Hat </h1>
        <p>Content goes here...</p>
      </LargeCard>
    </div>
  );
}
