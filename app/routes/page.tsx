'use client';

import { Plus } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LithiaContext } from '@/components/contexts/LithiaContext';
import { useRoutes } from '@/components/contexts/RoutesContext';
import { RouteFilters } from '@/components/routes/RouteFilters';
import { RouteList } from '@/components/routes/RouteList';
import { RoutesSkeleton } from '@/components/routes/RoutesSkeleton';
import { RouteTester } from '@/components/routes/RouteTester';
import type { BodyData } from '@/components/routes/tabs/BodyTab';
import { Button } from '@/components/ui/Button';
import type { Route } from '@/types';
import { replaceDynamicParams } from '@/utils/route-params';

interface RouteWithStatus extends Route {
  env?: string;
  status?: 'active' | 'inactive' | 'error';
  lastAccessed?: Date;
  responseTime?: number;
}

interface FilterForm {
  searchTerm: string;
  methodFilter: string;
}

interface ApiTestForm {
  method: string;
  dynamicParams: Record<string, string>;
  queryParams: Array<{ key: string; value: string }>;
  headers: Array<{ key: string; value: string }>;
  authType: 'none' | 'bearer' | 'basic' | 'api-key';
  authToken: string;
  authUsername: string;
  authPassword: string;
  authApiKey: string;
  authApiKeyHeader: string;
  bodyData: BodyData;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  responseTime: number;
  size: number;
}

export default function RoutesPage() {
  const { routes, isLoading } = useRoutes();
  const { app } = useContext(LithiaContext);

  // API Testing states
  const [currentView, setCurrentView] = useState<'list' | 'tester'>('list');
  const [selectedRoute, setSelectedRoute] = useState<RouteWithStatus | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Form for filters
  const { watch: watchFilters, setValue: setFilterValue } = useForm<FilterForm>({
    defaultValues: {
      searchTerm: '',
      methodFilter: 'all',
    },
  });

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
          route.path.toLowerCase().includes(filterValues.searchTerm.toLowerCase()) ||
          (route.method || '').toLowerCase().includes(filterValues.searchTerm.toLowerCase()),
      );
    }

    // Method filter
    if (filterValues.methodFilter !== 'all') {
      filtered = filtered.filter((route) => (route.method || 'ALL') === filterValues.methodFilter);
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
    return [{ value: 'all', label: 'All Methods', count: routes.length }, ...methods];
  }, [routes]);

  // Handle route selection for API testing
  const handleRouteSelect = (route: RouteWithStatus) => {
    setSelectedRoute(route);
    setCurrentView('tester');
    setApiResponse(null);
  };

  // Handle back to route list
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedRoute(null);
    setApiResponse(null);
  };

  // Handle API test submission

  const handleApiTest = async (data: ApiTestForm) => {
    if (!selectedRoute) return;

    setIsTesting(true);
    setApiResponse(null);

    try {
      const startTime = Date.now();

      // Build headers from form configuration
      const headers: Record<string, string> = {};

      // Add custom headers from form
      if (data.headers && Array.isArray(data.headers)) {
        data.headers.forEach((header) => {
          if (header.key && header.value) {
            headers[header.key.trim()] = header.value.trim();
          }
        });
      }

      // Add authentication headers (these will override custom headers if same key)
      if (data.authType === 'bearer' && data.authToken) {
        headers.Authorization = `Bearer ${data.authToken}`;
      } else if (data.authType === 'basic' && data.authUsername && data.authPassword) {
        const credentials = btoa(`${data.authUsername}:${data.authPassword}`);
        headers.Authorization = `Basic ${credentials}`;
      } else if (data.authType === 'api-key' && data.authApiKey && data.authApiKeyHeader) {
        headers[data.authApiKeyHeader] = data.authApiKey;
      }

      // Parse query parameters
      const queryParams = new URLSearchParams();
      if (data.queryParams && Array.isArray(data.queryParams)) {
        data.queryParams.forEach((param) => {
          if (param.key && param.value) {
            queryParams.append(param.key.trim(), param.value.trim());
          }
        });
      }

      // Build URL using Lithia config
      const config = app.config;
      const host = config?.server?.host || 'localhost';
      const port = config?.server?.port || 3000;
      const baseUrl = `http://${host}:${port}`;

      // Replace dynamic parameters in route path
      const finalPath = replaceDynamicParams(selectedRoute.path, data.dynamicParams);
      const url = new URL(finalPath, baseUrl);

      queryParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });

      // Make request
      const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

      // Use method from form if route method is undefined, otherwise use route method
      const methodToUse = selectedRoute.method || data.method || 'GET';
      const method = validMethods.includes(methodToUse?.toUpperCase() || '') ? methodToUse.toUpperCase() : 'GET';

      // Process body based on type
      let requestBody: string | FormData | undefined;
      let contentType: string | undefined;

      if (data.bodyData.type === 'none') {
        requestBody = undefined;
        contentType = undefined;
      } else if (data.bodyData.type === 'raw') {
        requestBody = data.bodyData.rawContent;
        // Set Content-Type based on raw format
        switch (data.bodyData.rawFormat) {
          case 'json':
            contentType = 'application/json';
            break;
          case 'xml':
            contentType = 'application/xml';
            break;
          case 'plaintext':
            contentType = 'text/plain';
            break;
          default:
            contentType = 'application/json';
        }
      } else if (data.bodyData.type === 'form-data') {
        const formData = new FormData();
        data.bodyData.formData.forEach((field) => {
          if (field.key && field.value) {
            if (field.type === 'file') {
              // For file uploads, we'd need to handle the actual file
              // For now, we'll just send the filename as text
              formData.append(field.key, field.value);
            } else {
              formData.append(field.key, field.value);
            }
          }
        });
        requestBody = formData;
        contentType = undefined; // Let browser set Content-Type for FormData
      } else if (data.bodyData.type === 'x-www-form-urlencoded') {
        const urlEncoded = new URLSearchParams();
        data.bodyData.urlEncoded.forEach((field) => {
          if (field.key && field.value) {
            urlEncoded.append(field.key, field.value);
          }
        });
        requestBody = urlEncoded.toString();
        contentType = 'application/x-www-form-urlencoded';
      } else if (data.bodyData.type === 'binary') {
        // For binary files, we'd need to handle the actual file
        // For now, we'll just send an empty body
        requestBody = undefined;
        contentType = undefined;
      }

      // Prepare headers - remove Content-Type if it's FormData (let browser handle it)
      const requestHeaders: Record<string, string> = { ...headers };

      // Only set Content-Type if we have a specific one and it's not FormData
      if (contentType && data.bodyData.type !== 'form-data') {
        requestHeaders['Content-Type'] = contentType;
      }

      const response = await fetch(url.toString(), {
        method: method,
        headers: requestHeaders,
        body: requestBody,
      });

      const responseTime = Date.now() - startTime;

      // Capture all available headers first
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Detect content type and process response accordingly
      const responseContentType = responseHeaders['content-type'] || responseHeaders['Content-Type'] || '';
      let responseData: unknown;
      let responseSize: number;

      try {
        if (responseContentType.includes('application/json')) {
          responseData = await response.json();
          responseSize = JSON.stringify(responseData).length;
        } else if (responseContentType.includes('text/')) {
          responseData = await response.text();
          responseSize = String(responseData).length;
        } else if (
          responseContentType.includes('application/pdf') ||
          responseContentType.includes('application/zip') ||
          responseContentType.includes('image/') ||
          responseContentType.includes('video/') ||
          responseContentType.includes('audio/')
        ) {
          // For binary files, get as blob
          const blob = await response.blob();
          responseData = blob;
          responseSize = blob.size;
        } else {
          // Default: try as text
          responseData = await response.text();
          responseSize = String(responseData).length;
        }
      } catch {
        // If parsing fails, get as text
        responseData = await response.text();
        responseSize = String(responseData).length;
      }

      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        responseTime,
        size: responseSize,
      });
    } catch (error) {
      console.error('API test failed:', error);

      // Determine error type and message
      let errorMessage = 'Unknown error';
      let errorType = 'Unable to fetch';

      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          errorType = 'Unable to fetch';
          errorMessage = 'Check the browser console for detailed error information.';
        } else if (error.message.includes('NetworkError')) {
          errorType = 'Unable to fetch';
          errorMessage = 'Network connection failed. Check if server is running.';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setApiResponse({
        status: 0,
        statusText: errorType,
        headers: {},
        data: {
          error: errorMessage,
          type: errorType,
          details: error instanceof Error ? error.stack : undefined,
        },
        responseTime: 0,
        size: 0,
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/10 p-8 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground mb-2 text-3xl font-bold">Server Routes</h1>
              <p className="text-gray-400">Manage and test your API routes in real-time</p>
            </div>
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              <span>Create Route</span>
            </Button>
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

  if (currentView === 'tester' && selectedRoute) {
    return (
      <RouteTester
        selectedRoute={selectedRoute}
        apiResponse={apiResponse}
        isTesting={isTesting}
        onExecuteTest={handleApiTest}
        onGoBack={handleBackToList}
      />
    );
  }

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">Server Routes</h1>
            <p className="text-gray-400">Manage and test your API routes in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                // TODO: Implement create route functionality
                console.log('Create route clicked');
              }}
              variant="primary"
              size="sm">
              <Plus className="h-4 w-4" />
              <span>Create Route</span>
            </Button>
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
        onRouteClick={handleRouteSelect}
        getMethodColor={(method) => {
          const colors = {
            GET: 'bg-green-500/20 text-green-400 border-green-500/30',
            POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
            PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            HEAD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            OPTIONS: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          };
          return colors[method as keyof typeof colors] || colors.GET;
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
