import { Clock, Package } from 'lucide-react';

export function BuildStatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Build Overview Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total Builds */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Package className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Total Builds</p>
          </div>
          <div className="h-5 w-8 animate-pulse rounded bg-gray-700"></div>
        </div>

        {/* Average Build Time */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Clock className="text-primary h-4 w-4" />
            <p className="text-sm font-medium text-white">Avg Build Time</p>
          </div>
          <div className="h-5 w-12 animate-pulse rounded bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
