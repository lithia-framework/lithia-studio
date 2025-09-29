'use client';

import { AlertCircle, CheckCircle, Download, XCircle } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/Button';
import { CodeEditor } from '@/components/ui/CodeEditor';

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  responseTime: number;
  size: number;
}

interface ResponsePanelProps {
  response: ApiResponse | null;
  isTesting: boolean;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({
  response,
  isTesting,
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    if (status >= 400 && status < 500) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300)
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (status >= 300 && status < 400)
      return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    if (status >= 400 && status < 500)
      return <AlertCircle className="h-4 w-4 text-orange-400" />;
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const detectContentType = (headers: Record<string, string>) => {
    const contentType =
      headers['content-type'] || headers['Content-Type'] || '';

    if (contentType.includes('application/json')) return 'json';
    if (contentType.includes('text/html')) return 'html';
    if (
      contentType.includes('text/xml') ||
      contentType.includes('application/xml')
    )
      return 'xml';
    if (contentType.includes('text/plain')) return 'plaintext';
    if (
      contentType.includes('application/javascript') ||
      contentType.includes('text/javascript')
    )
      return 'javascript';
    if (contentType.includes('text/css')) return 'css';
    if (contentType.includes('text/markdown')) return 'markdown';

    return 'plaintext'; // Default fallback
  };

  const isFileResponse = (headers: Record<string, string>) => {
    const contentType =
      headers['content-type'] || headers['Content-Type'] || '';
    const contentDisposition =
      headers['content-disposition'] || headers['Content-Disposition'] || '';

    // Check if it's a file based on content-disposition header
    if (
      contentDisposition.includes('attachment') ||
      contentDisposition.includes('filename=')
    ) {
      return true;
    }

    // Check if it's a binary file type
    const binaryTypes = [
      'application/pdf',
      'application/zip',
      'application/octet-stream',
      'image/',
      'video/',
      'audio/',
      'application/msword',
      'application/vnd.openxmlformats-officedocument',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
    ];

    return binaryTypes.some((type) => contentType.includes(type));
  };

  const getFileName = (headers: Record<string, string>) => {
    const contentDisposition =
      headers['content-disposition'] || headers['Content-Disposition'] || '';

    // Extract filename from content-disposition header
    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
    );
    if (filenameMatch?.[1]) {
      return filenameMatch[1].replace(/['"]/g, '');
    }

    // Fallback filename based on content type
    const contentType =
      headers['content-type'] || headers['Content-Type'] || '';
    if (contentType.includes('application/pdf')) return 'document.pdf';
    if (contentType.includes('image/')) return 'image.jpg';
    if (contentType.includes('video/')) return 'video.mp4';
    if (contentType.includes('audio/')) return 'audio.mp3';

    return 'download';
  };

  const downloadFile = (data: unknown, headers: Record<string, string>) => {
    try {
      const fileName = getFileName(headers);
      const contentType =
        headers['content-type'] ||
        headers['Content-Type'] ||
        'application/octet-stream';

      // Create blob from data
      let blob: Blob;
      if (data instanceof Blob) {
        blob = data;
      } else if (typeof data === 'string') {
        // Convert string to blob
        blob = new Blob([data], { type: contentType });
      } else {
        // Convert other data types to blob
        const jsonString = JSON.stringify(data);
        blob = new Blob([jsonString], { type: contentType });
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatResponseData = (data: unknown, contentType: string) => {
    // For non-JSON content types, return as string immediately
    if (contentType !== 'json') {
      return String(data);
    }

    // Only try JSON parsing for JSON content type
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      // If JSON parsing fails, return as string
      return String(data);
    }
  };

  const calculateResponseHeight = (data: unknown, contentType: string) => {
    const formattedData = formatResponseData(data, contentType);
    const lines = formattedData.split('\n').length;

    // Base height: 20px per line + padding
    const baseHeight = Math.max(lines * 20 + 40, 100); // Minimum 100px
    const maxHeight = 400; // Maximum 400px

    return `${Math.min(baseHeight, maxHeight)}px`;
  };

  if (isTesting) {
    return (
      <div className="space-y-4 pb-6">
        {/* Loading Animation */}
        <div className="bg-background-secondary rounded-lg border border-white/10 p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Loading Text */}
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-medium text-white">
                Processing Request
              </h3>
              <p className="text-sm text-gray-400">
                Please wait while we test your route...
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex space-x-2">
              <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
              <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
              <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-background-secondary rounded-lg border border-white/10 p-6">
        <div className="text-center text-gray-400">
          <p>
            No response yet. Click &quot;Send Request&quot; to test the route.
          </p>
        </div>
      </div>
    );
  }

  // Check if this is a network error (no response received)
  const isNetworkError = response.status === 0;
  // Check if this is an HTTP error (but we still received a response)

  return (
    <div className="space-y-4 pb-6">
      {/* Response Status */}
      <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(response.status)}
            <span
              className={`text-lg font-semibold ${getStatusColor(response.status)}`}
            >
              {response.status === 0
                ? response.statusText
                : `${response.status} ${response.statusText}`}
            </span>
            {isNetworkError && (
              <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
                ERROR
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400">
            {response.responseTime}ms • {response.size} bytes
          </div>
        </div>

        {/* Error Details - Only show for network errors */}
        {isNetworkError &&
        response.data &&
        typeof response.data === 'object' &&
        'error' in response.data ? (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <div className="text-sm">
              <p className="font-medium text-red-400">
                {String((response.data as { error: string }).error)}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Response Headers - Only show if we have headers and it's not a network error */}
      {!isNetworkError && Object.keys(response.headers).length > 0 ? (
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <h3 className="mb-3 text-sm font-medium text-gray-300">
            Response Headers
          </h3>
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-mono text-gray-400">{key}:</span>
                <span className="font-mono text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Response Body - Only show if we have valid data and it's not a network error */}
      {!isNetworkError && response.data ? (
        <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Response Body</h3>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-gray-500">
                {detectContentType(response.headers).toUpperCase()}
              </span>
              {isFileResponse(response.headers) && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadFile(response.data, response.headers)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </div>

          {isFileResponse(response.headers) ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="space-y-2">
                <div className="text-gray-400">
                  <Download className="mx-auto mb-2 h-8 w-8" />
                </div>
                <p className="text-sm text-gray-400">File response detected</p>
                <p className="text-xs text-gray-500">
                  Click &quot;Download&quot; to save the file
                </p>
                <p className="font-mono text-xs text-gray-500">
                  {getFileName(response.headers)}
                </p>
              </div>
            </div>
          ) : (
            <CodeEditor
              value={formatResponseData(
                response.data,
                detectContentType(response.headers),
              )}
              onChange={() => {}} // No-op since it's read-only
              language={detectContentType(response.headers)}
              height={calculateResponseHeight(
                response.data,
                detectContentType(response.headers),
              )}
              readOnly={true}
              stickyScroll={false}
              showLineNumbers={false}
              contextMenu={false}
              glyphMargin={false}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
