import type { Metadata } from 'next';
import { BuildStatsCard } from '@/components/dashboard/BuildStatsCard';
import { ServerStatsCard } from '@/components/dashboard/ServerStatsCard';

export const metadata: Metadata = {
  title: 'Overview | Lithia Studio',
};

export default function Home() {
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Overview
            </h1>
            <p className="text-gray-400">
              Control panel to manage your Lithia server
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-8">
        <ServerStatsCard />
        <BuildStatsCard />
      </div>
    </>
  );
}
