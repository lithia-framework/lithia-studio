'use client';

import type React from 'react';

export const RouteEntrySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse px-6 py-4 font-mono">
      <div className="flex items-start space-x-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center space-x-2">
            {/* Method badge skeleton */}
            <div className="h-6 w-12 rounded bg-gray-700"></div>
            <div className="h-1 w-1 rounded-full bg-gray-600"></div>
            {/* Path skeleton */}
            <div className="h-4 w-32 rounded bg-gray-700"></div>
            {/* Dynamic badge skeleton */}
            <div className="h-1 w-1 rounded-full bg-gray-600"></div>
            <div className="h-4 w-16 rounded bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs">
              {/* File path skeleton */}
              <div className="h-3 w-48 rounded bg-gray-700"></div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="h-3 w-20 rounded bg-gray-700"></div>
              <div className="h-2 w-2 rounded-full bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
