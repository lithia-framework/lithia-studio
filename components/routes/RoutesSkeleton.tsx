'use client';

import React from 'react';
import { RouteEntrySkeleton } from './RouteEntrySkeleton';

export const RoutesSkeleton: React.FC = () => {
  return (
    <div className="space-y-0">
      {Array.from({ length: 3 }).map((_, index) => (
        <RouteEntrySkeleton key={index} />
      ))}
    </div>
  );
};
