'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRoutes } from '@/components/contexts/RoutesContext';
import { RouteFilters } from '@/components/routes/RouteFilters';
import { RouteList } from '@/components/routes/RouteList';
import { RoutesSkeleton } from '@/components/routes/RoutesSkeleton';
import { Button } from '@/components/ui/Button';
import type { Route } from '@/types';

interface RouteWithStatus extends Route {
  status?: 'active' | 'inactive' | 'error';
  lastAccessed?: Date;
  responseTime?: number;
}

interface FilterForm {
  searchTerm: string;
  methodFilter: string;
}

export default function RoutesPage() {
  const { routes, isLoading } = useRoutes();

  // Form for filters
  const { watch: watchFilters, setValue: setFilterValue } = useForm<FilterForm>(
    {
      defaultValues: {
        searchTerm: '',
        methodFilter: 'all',
      },
    },
  );

  const filterValues = watchFilters();
  const searchTerm = filterValues.searchTerm;
  const methodFilter = filterValues.methodFilter;

  // Convert routes to RouteWithStatus and apply filters
  const filteredRoutes = useMemo(() => {
    let filtered: RouteWithStatus[] = routes.map((route) => ({
      ...route,
      status: 'active' as const,
    })) as RouteWithStatus[];

    // Search filter
    if (filterValues.searchTerm) {
      filtered = filtered.filter(
        (route) =>
          route.path
            .toLowerCase()
            .includes(filterValues.searchTerm.toLowerCase()) ||
          (route.method || '')
            .toLowerCase()
            .includes(filterValues.searchTerm.toLowerCase()),
      );
    }

    // Method filter
    if (filterValues.methodFilter !== 'all') {
      filtered = filtered.filter(
        (route) => (route.method || 'ALL') === filterValues.methodFilter,
      );
    }

    return filtered;
  }, [routes, filterValues]);

  // Get available methods from routes
  const availableMethods = useMemo(() => {
    const methodCounts = routes.reduce(
      (acc, route) => {
        const method = route.method || 'ALL';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const methods = Object.entries(methodCounts)
      .map(([method, count]) => ({ value: method, label: method, count }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Add "All Methods" option at the beginning
    return [
      { value: 'all', label: 'All Methods', count: routes.length },
      ...methods,
    ];
  }, [routes]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/10 p-8 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground mb-2 text-3xl font-bold">
                Server Routes
              </h1>
              <p className="text-gray-400">
                Manage and test your API routes in real-time
              </p>
            </div>
            <Link href="/routes/new">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                <span>Create Route</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 border-b border-white/10 p-6">
          <RouteFilters
            searchTerm={searchTerm}
            methodFilter={methodFilter}
            availableMethods={availableMethods}
            onSearchChange={(value) => setFilterValue('searchTerm', value)}
            onMethodChange={(value) => setFilterValue('methodFilter', value)}
          />
        </div>

        {/* Skeleton Content */}
        <div className="flex-1 overflow-hidden">
          <RoutesSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Server Routes
            </h1>
            <p className="text-gray-400">
              Manage and test your API routes in real-time
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/routes/new">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                <span>Create Route</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <RouteFilters
            searchTerm={filterValues.searchTerm}
            methodFilter={filterValues.methodFilter}
            availableMethods={availableMethods}
            onSearchChange={(value) => setFilterValue('searchTerm', value)}
            onMethodChange={(value) => setFilterValue('methodFilter', value)}
          />
        </div>
      </div>

      <RouteList
        routes={filteredRoutes}
        getMethodColor={(method) => {
          const colors = {
            GET: 'bg-green-500/20 text-green-400 border-green-500/30',
            POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
            PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            HEAD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            OPTIONS: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            ALL: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
          };
          return colors[method as keyof typeof colors] || colors.ALL;
        }}
        getDisplayFilePath={(route) => {
          const filePath = route.sourceFilePath || route.filePath;
          if (!filePath) return 'No file path';

          // Extract path relative to src
          const srcIndex = filePath.indexOf('/src/');
          if (srcIndex !== -1) {
            return filePath.substring(srcIndex + 1); // +1 to keep '/src/'
          }

          // If no src folder found, return the full path
          return filePath;
        }}
      />
    </>
  );
}
