'use client';

import type React from 'react';
import { AuthTab } from './tabs/AuthTab';
import { type BodyData, BodyTab } from './tabs/BodyTab';
import { DynamicParamsTab } from './tabs/DynamicParamsTab';
import { HeadersTab } from './tabs/HeadersTab';
import { ParamsTab } from './tabs/ParamsTab';

interface RequestConfigSectionsProps {
  routePath: string;
  routeMethod?: string;
  selectedMethod?: string;
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
  onDynamicParamsChange: (params: Record<string, string>) => void;
  onQueryParamsChange: (params: Array<{ key: string; value: string }>) => void;
  onHeadersChange: (headers: Array<{ key: string; value: string }>) => void;
  onAuthTypeChange: (type: 'none' | 'bearer' | 'basic' | 'api-key') => void;
  onAuthTokenChange: (token: string) => void;
  onAuthUsernameChange: (username: string) => void;
  onAuthPasswordChange: (password: string) => void;
  onAuthApiKeyChange: (apiKey: string) => void;
  onAuthApiKeyHeaderChange: (header: string) => void;
  onBodyDataChange: (bodyData: BodyData) => void;
  onDuplicateParamsDetected?: () => void;
  showValidation?: boolean;
}

export const RequestConfigSections: React.FC<RequestConfigSectionsProps> = ({
  routePath,
  routeMethod,
  selectedMethod,
  dynamicParams,
  queryParams,
  headers,
  authType,
  authToken,
  authUsername,
  authPassword,
  authApiKey,
  authApiKeyHeader,
  bodyData,
  onDynamicParamsChange,
  onQueryParamsChange,
  onHeadersChange,
  onAuthTypeChange,
  onAuthTokenChange,
  onAuthUsernameChange,
  onAuthPasswordChange,
  onAuthApiKeyChange,
  onAuthApiKeyHeaderChange,
  onBodyDataChange,
  onDuplicateParamsDetected,
  showValidation = false,
}) => {
  // Check if route has dynamic parameters
  const hasDynamicParams = routePath.includes(':');

  // Check if method allows body
  const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
  const currentMethod = routeMethod || selectedMethod;
  const allowsBody = !currentMethod || methodsWithBody.includes(currentMethod.toUpperCase());

  return (
    <div className="divide-y divide-white/10">
      {/* Route Parameters (if dynamic) */}
      {hasDynamicParams && (
        <div className="p-6 pb-8">
          <DynamicParamsTab
            routePath={routePath}
            dynamicParams={dynamicParams}
            onChange={onDynamicParamsChange}
            onDuplicateParamsDetected={onDuplicateParamsDetected}
            showValidation={showValidation}
          />
        </div>
      )}

      {/* Query Parameters */}
      <div className="p-6 pb-8">
        <ParamsTab params={queryParams} onChange={onQueryParamsChange} />
      </div>

      {/* Headers */}
      <div className="p-6 pb-8">
        <HeadersTab headers={headers} onChange={onHeadersChange} />
      </div>

      {/* Authentication */}
      <div className="p-6 pb-8">
        <AuthTab
          authType={authType}
          authToken={authToken}
          authUsername={authUsername}
          authPassword={authPassword}
          authApiKey={authApiKey}
          authApiKeyHeader={authApiKeyHeader}
          onAuthTypeChange={onAuthTypeChange}
          onAuthTokenChange={onAuthTokenChange}
          onAuthUsernameChange={onAuthUsernameChange}
          onAuthPasswordChange={onAuthPasswordChange}
          onAuthApiKeyChange={onAuthApiKeyChange}
          onAuthApiKeyHeaderChange={onAuthApiKeyHeaderChange}
        />
      </div>

      {/* Body (if method allows) */}
      {allowsBody && (
        <div className="p-6 pb-8">
          <BodyTab bodyData={bodyData} onChange={onBodyDataChange} />
        </div>
      )}
    </div>
  );
};
