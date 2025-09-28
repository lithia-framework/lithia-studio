'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { extractDynamicParamsWithKeys } from '@/utils/route-params';

interface DynamicParamsTabProps {
  routePath: string;
  dynamicParams: Record<string, string>;
  onChange: (params: Record<string, string>) => void;
  onDuplicateParamsDetected?: () => void;
}

export const DynamicParamsTab: React.FC<DynamicParamsTabProps> = ({
  routePath,
  dynamicParams,
  onChange,
  onDuplicateParamsDetected,
}) => {
  const dynamicParamInfo = extractDynamicParamsWithKeys(routePath);

  const updateParam = (paramName: string, value: string) => {
    const newParams = { ...dynamicParams, [paramName]: value };
    onChange(newParams);
  };

  const hasDuplicateParams = dynamicParamInfo.some(
    (p) => dynamicParamInfo.filter((pi) => pi.name === p.name).length > 1,
  );

  // Detect duplicates when component mounts
  useEffect(() => {
    if (hasDuplicateParams && onDuplicateParamsDetected) {
      onDuplicateParamsDetected();
    }
  }, [hasDuplicateParams, onDuplicateParamsDetected]);

  if (dynamicParamInfo.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-400">
          <p>This route has no dynamic parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Dynamic Parameters</h3>
      <div>
        <div className="space-y-3">
          {dynamicParamInfo.map((paramInfo) => (
            <Input
              key={paramInfo.key}
              label={`${paramInfo.name} ${
                dynamicParamInfo.filter((p) => p.name === paramInfo.name)
                  .length > 1
                  ? `(${paramInfo.position + 1})`
                  : ''
              }`}
              value={dynamicParams[paramInfo.name] || ''}
              onChange={(e) => updateParam(paramInfo.name, e.target.value)}
              placeholder={`Enter ${paramInfo.name} value`}
              variant="default"
              size="md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
