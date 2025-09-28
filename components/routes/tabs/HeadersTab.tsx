'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2 } from 'lucide-react';

interface HeadersTabProps {
  headers: Array<{ key: string; value: string }>;
  onChange: (headers: Array<{ key: string; value: string }>) => void;
}

export const HeadersTab: React.FC<HeadersTabProps> = ({
  headers,
  onChange,
}) => {
  const updateHeader = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onChange(newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    onChange(newHeaders);
  };

  const addHeader = () => {
    const newHeaders = [...headers, { key: '', value: '' }];
    onChange(newHeaders);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Headers</h3>
        <Button type="button" variant="secondary" size="sm" onClick={addHeader}>
          Add Header
        </Button>
      </div>
      <div>
        <div className="space-y-2">
          {headers.map((header, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={index === 0 ? 'Key' : undefined}
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Key"
                  variant="default"
                  size="md"
                />
              </div>
              <div className="flex-1">
                <Input
                  label={index === 0 ? 'Value' : undefined}
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Value"
                  variant="default"
                  size="md"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant={headers.length === 1 ? 'secondary' : 'danger'}
                  size="md"
                  onClick={() => removeHeader(index)}
                  disabled={headers.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
