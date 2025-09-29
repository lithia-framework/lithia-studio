'use client';

import { Trash2 } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ParamsTabProps {
  params: Array<{ key: string; value: string }>;
  onChange: (params: Array<{ key: string; value: string }>) => void;
}

export const ParamsTab: React.FC<ParamsTabProps> = ({ params, onChange }) => {
  const updateParam = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    onChange(newParams);
  };

  const removeParam = (index: number) => {
    const newParams = params.filter((_, i) => i !== index);
    onChange(newParams);
  };

  const addParam = () => {
    const newParams = [...params, { key: '', value: '' }];
    onChange(newParams);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Params</h3>
        <Button type="button" variant="secondary" size="sm" onClick={addParam}>
          Add Parameter
        </Button>
      </div>
      <div>
        <div className="space-y-2">
          {params.map((param, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={index === 0 ? 'Key' : undefined}
                  value={param.key}
                  onChange={(e) => updateParam(index, 'key', e.target.value)}
                  placeholder="Key"
                  variant="default"
                  size="md"
                />
              </div>
              <div className="flex-1">
                <Input
                  label={index === 0 ? 'Value' : undefined}
                  value={param.value}
                  onChange={(e) => updateParam(index, 'value', e.target.value)}
                  placeholder="Value"
                  variant="default"
                  size="md"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant={params.length === 1 ? 'secondary' : 'danger'}
                  size="md"
                  onClick={() => removeParam(index)}
                  disabled={params.length === 1}
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
