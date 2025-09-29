'use client';

import { RefreshCw, Send, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LithiaContext } from '@/components/contexts/LithiaContext';
import { useRoutes } from '@/components/contexts/RoutesContext';
import { RequestConfigSections } from '@/components/routes/RequestConfigSections';
import { ResponsePanel } from '@/components/routes/ResponsePanel';
import type { BodyData } from '@/components/routes/tabs/BodyTab';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Route } from '@/types';
import {
  extractDynamicParams,
  replaceDynamicParams,
} from '@/utils/route-params';

interface RouteWithStatus extends Route {
  status?: 'active' | 'inactive' | 'error';
  lastAccessed?: Date;
  responseTime?: number;
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

export default function RouteTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { routes } = useRoutes();
  const { app } = useContext(LithiaContext);

  const [selectedRoute, setSelectedRoute] = useState<RouteWithStatus | null>(
    null,
  );
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [hasDuplicateParams, setHasDuplicateParams] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Get route path from query params
  const routePath = searchParams.get('path');

  // Find the route based on path
  useEffect(() => {
    if (routePath && routes.length > 0) {
      const route = routes.find((r) => r.path === routePath);
      if (route) {
        setSelectedRoute({
          ...route,
          status: 'active' as const,
        });
      } else {
        toast.error(`Route not found: ${routePath}`);
        router.push('/routes');
      }
    } else if (!routePath) {
      toast.error('No route path specified');
      router.push('/routes');
    }
  }, [routePath, routes, router]);

  const { handleSubmit, reset, watch, setValue } = useForm<ApiTestForm>({
    defaultValues: {
      method: selectedRoute?.method || 'GET',
      dynamicParams: selectedRoute?.path
        ? extractDynamicParams(selectedRoute.path).reduce(
            (acc, param) => {
              acc[param] = '';
              return acc;
            },
            {} as Record<string, string>,
          )
        : {},
      queryParams: [{ key: '', value: '' }],
      headers: [{ key: '', value: '' }],
      authType: 'none',
      authToken: '',
      authUsername: '',
      authPassword: '',
      authApiKey: '',
      authApiKeyHeader: 'X-API-Key',
      bodyData: {
        type: 'none',
        rawContent: '',
        rawFormat: 'json',
        formData: [{ key: '', value: '', type: 'text' }],
        urlEncoded: [{ key: '', value: '' }],
      },
    },
  });

  // Update form when route changes
  useEffect(() => {
    if (selectedRoute) {
      setValue('method', selectedRoute.method || 'GET');
      setValue(
        'dynamicParams',
        selectedRoute.path
          ? extractDynamicParams(selectedRoute.path).reduce(
              (acc, param) => {
                acc[param] = '';
                return acc;
              },
              {} as Record<string, string>,
            )
          : {},
      );
    }
  }, [selectedRoute, setValue]);

  const onSubmit = async (data: ApiTestForm) => {
    if (!selectedRoute) return;

    // Validate dynamic parameters before proceeding
    if (!isFormValid) {
      toast.error('Please fill in all required dynamic parameters');
      return;
    }

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

      // Add authentication headers
      if (data.authType === 'bearer' && data.authToken) {
        headers.Authorization = `Bearer ${data.authToken}`;
      } else if (
        data.authType === 'basic' &&
        data.authUsername &&
        data.authPassword
      ) {
        const credentials = btoa(`${data.authUsername}:${data.authPassword}`);
        headers.Authorization = `Basic ${credentials}`;
      } else if (
        data.authType === 'api-key' &&
        data.authApiKey &&
        data.authApiKeyHeader
      ) {
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
      const finalPath = replaceDynamicParams(
        selectedRoute.path,
        data.dynamicParams,
      );
      const url = new URL(finalPath, baseUrl);

      queryParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });

      // Make request
      const validMethods = [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'HEAD',
        'OPTIONS',
      ];

      const methodToUse = selectedRoute.method || data.method || 'GET';
      const method = validMethods.includes(methodToUse?.toUpperCase() || '')
        ? methodToUse.toUpperCase()
        : 'GET';

      // Process body based on type
      let requestBody: string | FormData | undefined;
      let contentType: string | undefined;

      if (data.bodyData.type === 'none') {
        requestBody = undefined;
        contentType = undefined;
      } else if (data.bodyData.type === 'raw') {
        requestBody = data.bodyData.rawContent;
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
              formData.append(field.key, field.value);
            } else {
              formData.append(field.key, field.value);
            }
          }
        });
        requestBody = formData;
        contentType = undefined;
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
        requestBody = undefined;
        contentType = undefined;
      }

      // Prepare headers
      const requestHeaders: Record<string, string> = { ...headers };
      if (contentType && data.bodyData.type !== 'form-data') {
        requestHeaders['Content-Type'] = contentType;
      }

      const response = await fetch(url.toString(), {
        method: method,
        headers: requestHeaders,
        body: requestBody,
      });

      const responseTime = Date.now() - startTime;

      // Capture response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Detect content type and process response
      const responseContentType =
        responseHeaders['content-type'] ||
        responseHeaders['Content-Type'] ||
        '';
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
          const blob = await response.blob();
          responseData = blob;
          responseSize = blob.size;
        } else {
          responseData = await response.text();
          responseSize = String(responseData).length;
        }
      } catch {
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

      let errorMessage = 'Unknown error';
      let errorType = 'Unable to fetch';

      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          errorType = 'Unable to fetch';
          errorMessage =
            'Check the browser console for detailed error information.';
        } else if (error.message.includes('NetworkError')) {
          errorType = 'Unable to fetch';
          errorMessage =
            'Network connection failed. Check if server is running.';
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

  const handleDuplicateParamsDetected = () => {
    setHasDuplicateParams(true);
  };

  const handleDuplicateDialogConfirm = () => {
    router.push('/routes');
  };

  const handleClear = () => {
    setShowClearDialog(true);
  };

  const confirmClear = () => {
    reset();
    setShowClearDialog(false);
  };

  // Validate if all dynamic parameters are filled
  const validateDynamicParams = () => {
    if (!selectedRoute?.path) return true;

    const dynamicParams = extractDynamicParams(selectedRoute.path);
    const currentParams = watch('dynamicParams') || {};

    return dynamicParams.every((param) => {
      const value = currentParams[param];
      return value && value.trim() !== '';
    });
  };

  const isFormValid = validateDynamicParams();

  if (!selectedRoute) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Loading...</h1>
          <p className="text-gray-400">Finding route...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <BackButton href="/routes">Back to Routes</BackButton>
            <h1 className="text-foreground text-3xl font-bold">
              <span className="flex items-baseline gap-3">
                <span className="text-primary font-mono text-3xl">
                  {(selectedRoute.method || 'ALL').toUpperCase()}
                </span>
                <span className="font-mono text-xl">{selectedRoute.path}</span>
              </span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              onClick={handleClear}
              variant="danger"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isTesting || !isFormValid}
              variant="primary"
              size="sm"
            >
              {isTesting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>
                {isTesting
                  ? 'Testing...'
                  : !isFormValid
                    ? 'Fill Required Parameters'
                    : 'Send Request'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-0 flex-1">
        {/* Request Panel */}
        <div className="flex-1 overflow-y-auto border-r border-white/10">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Request Configuration
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Fixed Method and URL */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/10 px-6 pb-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Method
                </label>
                <Select
                  value={watch('method') || 'GET'}
                  onChange={(value) => setValue('method', value)}
                  options={[
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'DELETE', label: 'DELETE' },
                    { value: 'PATCH', label: 'PATCH' },
                    { value: 'HEAD', label: 'HEAD' },
                    { value: 'OPTIONS', label: 'OPTIONS' },
                  ]}
                  variant="default"
                  size="md"
                  disabled={selectedRoute?.method !== undefined}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Path
                </label>
                <Input
                  value={selectedRoute?.path || ''}
                  disabled={true}
                  className="font-mono"
                />
              </div>
            </div>

            {/* Request Configuration Sections */}
            <RequestConfigSections
              routePath={selectedRoute?.path || ''}
              routeMethod={selectedRoute?.method}
              selectedMethod={watch('method')}
              dynamicParams={watch('dynamicParams') || {}}
              queryParams={watch('queryParams') || []}
              headers={watch('headers') || [{ key: '', value: '' }]}
              authType={watch('authType') || 'none'}
              authToken={watch('authToken') || ''}
              authUsername={watch('authUsername') || ''}
              authPassword={watch('authPassword') || ''}
              authApiKey={watch('authApiKey') || ''}
              authApiKeyHeader={watch('authApiKeyHeader') || 'X-API-Key'}
              bodyData={
                watch('bodyData') || {
                  type: 'none',
                  rawContent: '',
                  rawFormat: 'json',
                  formData: [{ key: '', value: '', type: 'text' }],
                  urlEncoded: [{ key: '', value: '' }],
                }
              }
              onDynamicParamsChange={(params) =>
                setValue('dynamicParams', params)
              }
              onQueryParamsChange={(params) => setValue('queryParams', params)}
              onHeadersChange={(headers) => setValue('headers', headers)}
              onAuthTypeChange={(type) => setValue('authType', type)}
              onAuthTokenChange={(token) => setValue('authToken', token)}
              onAuthUsernameChange={(username) =>
                setValue('authUsername', username)
              }
              onAuthPasswordChange={(password) =>
                setValue('authPassword', password)
              }
              onAuthApiKeyChange={(apiKey) => setValue('authApiKey', apiKey)}
              onAuthApiKeyHeaderChange={(header) =>
                setValue('authApiKeyHeader', header)
              }
              onBodyDataChange={(bodyData) => setValue('bodyData', bodyData)}
              onDuplicateParamsDetected={handleDuplicateParamsDetected}
              showValidation={!isFormValid}
            />
          </form>
        </div>

        {/* Response Panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Response</h2>
          </div>
          <div className="px-6">
            <ResponsePanel response={apiResponse} isTesting={isTesting} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={hasDuplicateParams}
        onClose={() => {}}
        title="Duplicate Route Parameters"
        description="This route has duplicate parameter names. Please rename the parameters in your route file to make them unique before testing."
        confirmText="Back to Routes"
        onConfirm={handleDuplicateDialogConfirm}
        cancelText=""
      />

      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        title="Clear Request Configuration"
        description="Are you sure you want to clear all request configuration? This action cannot be undone."
        confirmText="Clear"
        onConfirm={confirmClear}
        cancelText="Cancel"
      />
    </div>
  );
}
