'use client';

import { Plus, X } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/Button';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export type BodyType =
  | 'none'
  | 'form-data'
  | 'x-www-form-urlencoded'
  | 'raw'
  | 'binary';

export interface BodyData {
  type: BodyType;
  rawContent: string;
  rawFormat: 'json' | 'xml' | 'plaintext' | 'html';
  formData: Array<{ key: string; value: string; type: 'text' | 'file' }>;
  urlEncoded: Array<{ key: string; value: string }>;
  binaryFile?: File;
}

interface BodyTabProps {
  bodyData: BodyData;
  onChange: (bodyData: BodyData) => void;
}

export const BodyTab: React.FC<BodyTabProps> = ({ bodyData, onChange }) => {
  const updateBodyData = (updates: Partial<BodyData>) => {
    onChange({ ...bodyData, ...updates });
  };

  const addFormDataField = () => {
    const newFormData = [
      ...bodyData.formData,
      { key: '', value: '', type: 'text' as const },
    ];
    updateBodyData({ formData: newFormData });
  };

  const removeFormDataField = (index: number) => {
    const newFormData = bodyData.formData.filter((_, i) => i !== index);
    updateBodyData({ formData: newFormData });
  };

  const updateFormDataField = (
    index: number,
    field: 'key' | 'value' | 'type',
    value: string,
  ) => {
    const newFormData = [...bodyData.formData];
    newFormData[index] = { ...newFormData[index], [field]: value };
    updateBodyData({ formData: newFormData });
  };

  const addUrlEncodedField = () => {
    const newUrlEncoded = [...bodyData.urlEncoded, { key: '', value: '' }];
    updateBodyData({ urlEncoded: newUrlEncoded });
  };

  const removeUrlEncodedField = (index: number) => {
    const newUrlEncoded = bodyData.urlEncoded.filter((_, i) => i !== index);
    updateBodyData({ urlEncoded: newUrlEncoded });
  };

  const updateUrlEncodedField = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newUrlEncoded = [...bodyData.urlEncoded];
    newUrlEncoded[index] = { ...newUrlEncoded[index], [field]: value };
    updateBodyData({ urlEncoded: newUrlEncoded });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateBodyData({ binaryFile: file });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Body</h3>
        {bodyData.type === 'form-data' && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addFormDataField}
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        )}
        {bodyData.type === 'x-www-form-urlencoded' && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addUrlEncodedField}
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        )}
      </div>
      <div>
        <Select
          value={bodyData.type}
          onChange={(value) => updateBodyData({ type: value as BodyType })}
          options={[
            { value: 'none', label: 'None' },
            { value: 'form-data', label: 'Form Data' },
            { value: 'x-www-form-urlencoded', label: 'x-www-form-urlencoded' },
            { value: 'raw', label: 'Raw' },
            { value: 'binary', label: 'Binary' },
          ]}
          variant="default"
          size="md"
        />
      </div>
      {bodyData.type === 'raw' && (
        <>
          <div>
            <Select
              value={bodyData.rawFormat}
              onChange={(value) =>
                updateBodyData({
                  rawFormat: value as 'json' | 'xml' | 'plaintext' | 'html',
                })
              }
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'xml', label: 'XML' },
                { value: 'html', label: 'HTML' },
                { value: 'plaintext', label: 'Text' },
              ]}
              variant="default"
              size="md"
            />
          </div>

          <div>
            <CodeEditor
              className="overflow-hidden rounded-lg border border-white/10"
              key={`raw-editor-${bodyData.rawFormat}`}
              value={bodyData.rawContent}
              onChange={(value) => updateBodyData({ rawContent: value })}
              language={bodyData.rawFormat}
              height="300px"
              placeholder="Start typing to dismiss."
              showLineNumbers={false}
              showMinimap={false}
              wordWrap="on"
              fontSize={14}
              tabSize={2}
              insertSpaces={true}
              formatOnPaste={true}
              formatOnType={true}
              quickSuggestions={false}
              showSuggestions={false}
              contextMenu={false}
            />
          </div>
        </>
      )}

      {bodyData.type === 'form-data' && (
        <div>
          <div className="space-y-3">
            {bodyData.formData.map((field, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? 'Key' : undefined}
                    value={field.key}
                    onChange={(e) =>
                      updateFormDataField(index, 'key', e.target.value)
                    }
                    placeholder="Key"
                    variant="default"
                    size="md"
                  />
                </div>
                <div className="min-w-[100px]">
                  <Select
                    value={field.type}
                    onChange={(value) =>
                      updateFormDataField(index, 'type', value)
                    }
                    options={[
                      { value: 'text', label: 'Text' },
                      { value: 'file', label: 'File' },
                    ]}
                    variant="default"
                    size="md"
                  />
                </div>
                {field.type === 'text' ? (
                  <div className="flex-1">
                    <Input
                      label={index === 0 ? 'Value' : undefined}
                      value={field.value}
                      onChange={(e) =>
                        updateFormDataField(index, 'value', e.target.value)
                      }
                      placeholder="Value"
                      variant="default"
                      size="md"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateFormDataField(index, 'value', file.name);
                        }
                      }}
                      className="bg-background-secondary focus:border-primary focus:ring-primary/50 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2"
                    />
                  </div>
                )}
                <div>
                  <Button
                    type="button"
                    variant={
                      bodyData.formData.length === 1 ? 'secondary' : 'danger'
                    }
                    size="md"
                    onClick={() => removeFormDataField(index)}
                    disabled={bodyData.formData.length === 1}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bodyData.type === 'x-www-form-urlencoded' && (
        <div>
          <div className="space-y-2">
            {bodyData.urlEncoded.map((field, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? 'Key' : undefined}
                    value={field.key}
                    onChange={(e) =>
                      updateUrlEncodedField(index, 'key', e.target.value)
                    }
                    placeholder="Key"
                    variant="default"
                    size="md"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={index === 0 ? 'Value' : undefined}
                    value={field.value}
                    onChange={(e) =>
                      updateUrlEncodedField(index, 'value', e.target.value)
                    }
                    placeholder="Value"
                    variant="default"
                    size="md"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant={
                      bodyData.urlEncoded.length === 1 ? 'secondary' : 'danger'
                    }
                    size="md"
                    onClick={() => removeUrlEncodedField(index)}
                    disabled={bodyData.urlEncoded.length === 1}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bodyData.type === 'binary' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Binary File
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="bg-background-secondary focus:border-primary focus:ring-primary/50 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2"
          />
          {bodyData.binaryFile && (
            <div className="mt-2 text-sm text-gray-400">
              Selected: {bodyData.binaryFile.name} (
              {Math.round(bodyData.binaryFile.size / 1024)} KB)
            </div>
          )}
        </div>
      )}
    </div>
  );
};
