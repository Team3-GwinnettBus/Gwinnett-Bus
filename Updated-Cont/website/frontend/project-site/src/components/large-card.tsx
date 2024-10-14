"'use client'";

import { Card } from "@/components/ui/card";

interface LargeCardProps {
  children: React.ReactNode;
}

export function LargeCard({ children }: LargeCardProps = { children: null }) {
  return (
    <Card className="w-full max-w-[95%] mx-auto my-6 p-6 bg-white shadow-lg dark:bg-black">
      {children}
    </Card>
  );
}
