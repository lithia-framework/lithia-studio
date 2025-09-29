'use client';

import Link from 'next/link';
import type React from 'react';
import type { Route } from '@/types';
import { RouteEntry } from './RouteEntry';

interface RouteWithStatus extends Route {
  status?: 'active' | 'inactive' | 'error';
  lastAccessed?: Date;
  responseTime?: number;
}

interface RouteListProps {
  routes: RouteWithStatus[];
  getMethodColor: (method: string | undefined) => string;
  getDisplayFilePath: (route: RouteWithStatus) => string;
}

export const RouteList: React.FC<RouteListProps> = ({
  routes,
  getMethodColor,
  getDisplayFilePath,
}) => {
  return (
    <div className="">
      {routes.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <h3 className="mx-auto mb-2 flex w-fit items-center space-x-3 rounded-full">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span className="text-lg font-medium text-white">
              Waiting for routes...
            </span>
          </h3>
          <p className="text-gray-500">
            Routes will appear here when available
          </p>
        </div>
      ) : (
        <div className="max-h-[600px] divide-y divide-white/10">
          {routes.map((route, index) => (
            <Link
              key={`${route.method}-${route.path}-${index}`}
              href={`/routes/test?path=${encodeURIComponent(route.path)}`}
            >
              <RouteEntry
                route={route}
                getMethodColor={getMethodColor}
                getDisplayFilePath={getDisplayFilePath}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
