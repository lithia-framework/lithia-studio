'use client';

import type React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AuthTabProps {
  authType: 'none' | 'bearer' | 'basic' | 'api-key';
  authToken: string;
  authUsername: string;
  authPassword: string;
  authApiKey: string;
  authApiKeyHeader: string;
  onAuthTypeChange: (type: 'none' | 'bearer' | 'basic' | 'api-key') => void;
  onAuthTokenChange: (token: string) => void;
  onAuthUsernameChange: (username: string) => void;
  onAuthPasswordChange: (password: string) => void;
  onAuthApiKeyChange: (apiKey: string) => void;
  onAuthApiKeyHeaderChange: (header: string) => void;
}

export const AuthTab: React.FC<AuthTabProps> = ({
  authType,
  authToken,
  authUsername,
  authPassword,
  authApiKey,
  authApiKeyHeader,
  onAuthTypeChange,
  onAuthTokenChange,
  onAuthUsernameChange,
  onAuthPasswordChange,
  onAuthApiKeyChange,
  onAuthApiKeyHeaderChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Auth</h3>
      <div>
        <Select
          value={authType}
          onChange={(value) => onAuthTypeChange(value as 'none' | 'bearer' | 'basic' | 'api-key')}
          options={[
            { value: 'none', label: 'None' },
            { value: 'bearer', label: 'Bearer Token' },
            { value: 'basic', label: 'Basic Auth' },
            { value: 'api-key', label: 'API Key' },
          ]}
          variant="default"
          size="md"
        />
      </div>

      {authType === 'bearer' && (
        <Input
          label="Bearer Token"
          value={authToken}
          onChange={(e) => onAuthTokenChange(e.target.value)}
          placeholder="Enter your bearer token"
          variant="default"
          size="md"
        />
      )}

      {authType === 'basic' && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Username"
            value={authUsername}
            onChange={(e) => onAuthUsernameChange(e.target.value)}
            placeholder="Username"
            variant="default"
            size="md"
          />
          <Input
            label="Password"
            value={authPassword}
            onChange={(e) => onAuthPasswordChange(e.target.value)}
            type="password"
            placeholder="Password"
            variant="default"
            size="md"
          />
        </div>
      )}

      {authType === 'api-key' && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="API Key"
            value={authApiKey}
            onChange={(e) => onAuthApiKeyChange(e.target.value)}
            placeholder="Enter your API key"
            variant="default"
            size="md"
          />
          <Input
            label="Header Name"
            value={authApiKeyHeader}
            onChange={(e) => onAuthApiKeyHeaderChange(e.target.value)}
            placeholder="X-API-Key"
            variant="default"
            size="md"
          />
        </div>
      )}
    </div>
  );
};
