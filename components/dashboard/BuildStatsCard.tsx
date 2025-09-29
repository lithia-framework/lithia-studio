'use client';

import { Clock, Package } from 'lucide-react';
import { useBuildStats } from '@/components/contexts/BuildStatsContext';
import { BuildStatsSkeleton } from './BuildStatsSkeleton';

// Helper function to format time
const formatTime = (ms: number) => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

export function BuildStatsCard() {
  const { buildStats, isConnected } = useBuildStats();

  if (!isConnected || !buildStats) {
    return <BuildStatsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Build Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total Builds */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Package className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Total Builds</p>
          </div>
          <p className="text-primary text-sm font-bold">
            {buildStats.totalBuilds}
          </p>
        </div>

        {/* Average Build Time */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Clock className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Avg Build Time</p>
          </div>
          <p className="text-primary text-sm font-bold">
            {formatTime(buildStats.averageBuildTime)}
          </p>
        </div>
      </div>
    </div>
  );
}
