'use client';

import type React from 'react';
import type { Route } from '@/types';

interface RouteWithStatus extends Route {
  status?: 'active' | 'inactive' | 'error';
  lastAccessed?: Date;
  responseTime?: number;
}

interface RouteEntryProps {
  route: RouteWithStatus;
  getMethodColor: (method: string | undefined) => string;
  getDisplayFilePath: (route: RouteWithStatus) => string;
}

export const RouteEntry: React.FC<RouteEntryProps> = ({ route, getMethodColor, getDisplayFilePath }) => {
  return (
    <div className="hover:bg-background-secondary group px-6 py-4 font-mono transition-all">
      <div className="flex items-start space-x-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center space-x-2">
            <span className={`rounded px-2 py-1 text-xs font-medium uppercase ${getMethodColor(route.method)}`}>
              {route.method || 'ALL'}
            </span>
            <span className="text-gray-500">•</span>
            <code className="font-mono text-sm text-gray-300">{route.path || 'No path'}</code>
            {route.dynamic && (
              <>
                <span className="text-gray-500">•</span>
                <span className="rounded text-xs text-yellow-400">Dynamic</span>
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className="font-mono text-gray-500">{getDisplayFilePath(route)}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">
              <span>Click to test</span>
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
