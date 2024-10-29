import { LargeCard } from "@/components/large-card";

export default function Journal() {
  return (
    <div className="flex flex-col justify-center items-center">
      <br />
      <h1 className="text-3xl mb-6">Setup Journal</h1>
      <LargeCard>
        <h1> Server Setup </h1>
        <p>Content goes here...</p>
      </LargeCard>
      <LargeCard>
        <h1> Instructions </h1>
        <p>Content goes here...</p>
      </LargeCard>
      <LargeCard>
        <h1> Other </h1>
        <p>Content goes here...</p>
      </LargeCard>
    </div>
  );
}
