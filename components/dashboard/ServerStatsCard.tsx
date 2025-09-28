'use client';

import { useServerStats } from '@/components/contexts/ServerStatsContext';
import { Activity, Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';
import { MemoryChart } from './MemoryChart';
import { ServerStatsSkeleton } from './ServerStatsSkeleton';

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function ServerStatsCard() {
  const { stats, memoryHistory, isConnected } = useServerStats();

  if (!isConnected || !stats) {
    return <ServerStatsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* System Information */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Uptime */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Activity className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Uptime</p>
          </div>
          <p className="text-primary text-sm font-bold">
            {formatUptime(stats.uptime)}
          </p>
        </div>

        {/* Node Version */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Monitor className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Node Version</p>
          </div>
          <p className="text-primary text-sm font-bold">{stats.nodeVersion}</p>
        </div>

        {/* Platform */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <HardDrive className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Platform</p>
          </div>
          <p className="text-primary text-sm font-bold">
            {stats.platform} ({stats.arch})
          </p>
        </div>

        {/* CPU Usage */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Cpu className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">CPU Usage</p>
          </div>
          <p className="text-primary text-sm font-bold">
            {stats.cpuUsage.toFixed(2)}ms
          </p>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="bg-background-secondary rounded-lg border border-white/10 p-6">
        <div className="mb-4 flex items-center space-x-2">
          <MemoryStick className="text-primary h-4 w-4" />
          <h3 className="text-lg font-semibold text-white">Memory Usage</h3>
        </div>

        {/* Memory Chart */}
        <MemoryChart data={memoryHistory} />
      </div>
    </div>
  );
}
