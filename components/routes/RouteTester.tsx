'use client';

import { ArrowLeft, RefreshCw, Send, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog';
import { Select } from '@/components/ui/Select';
import type { Route } from '@/types';
import { extractDynamicParams } from '@/utils/route-params';
import { RequestConfigSections } from './RequestConfigSections';
import { ResponsePanel } from './ResponsePanel';
import type { BodyData } from './tabs/BodyTab';

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

interface RouteTesterProps {
  selectedRoute: RouteWithStatus | null;
  apiResponse: ApiResponse | null;
  isTesting: boolean;
  onExecuteTest: (formData: ApiTestForm) => void;
  onGoBack: () => void;
}

export const RouteTester: React.FC<RouteTesterProps> = ({
  selectedRoute,
  apiResponse,
  isTesting,
  onExecuteTest,
  onGoBack,
}) => {
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

  const [hasDuplicateParams, setHasDuplicateParams] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const onSubmit = (data: ApiTestForm) => {
    onExecuteTest(data);
  };

  const handleDuplicateParamsDetected = () => {
    setHasDuplicateParams(true);
  };

  const handleDuplicateDialogConfirm = () => {
    onGoBack(); // Return to routes list
  };

  const handleClear = () => {
    setShowClearDialog(true);
  };

  const confirmClear = () => {
    reset();
    setShowClearDialog(false);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={onGoBack}
              className="mb-2 flex cursor-pointer items-center space-x-2 text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Routes</span>
            </button>
            <h1 className="text-foreground text-3xl font-bold">
              {selectedRoute ? (
                <span className="flex items-baseline gap-3">
                  <span className="text-primary font-mono text-3xl">
                    {(selectedRoute.method || 'ALL').toUpperCase()}
                  </span>
                  <span className="font-mono text-xl">
                    {selectedRoute.path}
                  </span>
                </span>
              ) : (
                'Route Tester'
              )}
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
              disabled={isTesting}
              variant="primary"
              size="sm"
            >
              {isTesting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isTesting ? 'Testing...' : 'Send Request'}</span>
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
                {selectedRoute?.method ? (
                  <div className="bg-background-secondary rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300">
                    {selectedRoute.method.toUpperCase()}
                  </div>
                ) : (
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
                  />
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Path
                </label>
                <div className="bg-background-secondary rounded-lg border border-white/10 px-4 py-2 font-mono text-sm text-gray-300">
                  {selectedRoute?.path || ''}
                </div>
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
        onClose={() => {}} // Prevent closing by clicking outside
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
};
