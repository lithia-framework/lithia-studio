import { Activity, Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';

export function ServerStatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* System Information Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Uptime */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Activity className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Uptime</p>
          </div>
          <div className="h-5 w-16 animate-pulse rounded bg-gray-700"></div>
        </div>

        {/* Node Version */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Monitor className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Node Version</p>
          </div>
          <div className="h-5 w-20 animate-pulse rounded bg-gray-700"></div>
        </div>

        {/* Platform */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <HardDrive className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Platform</p>
          </div>
          <div className="h-5 w-24 animate-pulse rounded bg-gray-700"></div>
        </div>

        {/* CPU Usage */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Cpu className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">CPU Usage</p>
          </div>
          <div className="h-5 w-16 animate-pulse rounded bg-gray-700"></div>
        </div>
      </div>

      {/* Memory Usage Skeleton */}
      <div className="bg-background-secondary rounded-lg border border-white/10 p-6">
        <div className="mb-4 flex items-center space-x-2">
          <MemoryStick className="text-primary h-4 w-4" />
          <h3 className="text-lg font-semibold text-white">Memory Usage</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Resident Set Size (RSS)</span>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Heap Total</span>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Heap Used</span>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">External</span>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Array Buffers</span>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
