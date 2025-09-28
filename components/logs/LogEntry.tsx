'use client';

import toast from 'react-hot-toast';

interface LogEntryProps {
  log: {
    id: string;
    level: string;
    message: string;
    timestamp: Date;
    source?: string;
    callerInfo?: {
      file: string;
    };
    args?: unknown[];
  };
}

export function LogEntry({ log }: LogEntryProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      info: 'text-blue-400',
      warn: 'text-yellow-400',
      error: 'text-red-400',
      debug: 'text-gray-400',
      success: 'text-green-400',
      ready: 'text-purple-400',
      wait: 'text-orange-400',
      event: 'text-emerald-400',
      trace: 'text-indigo-400',
    };
    return colors[level as keyof typeof colors] || colors.debug;
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(log.message);
      toast.success('Log copied to clipboard!');
    } catch {
      toast.error('Failed to copy log');
    }
  };

  return (
    <div
      className="hover:bg-background-secondary group cursor-pointer px-6 py-4 font-mono transition-all"
      onClick={copyToClipboard}>
      <div className="flex items-start space-x-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center space-x-2">
            <span className="text-xs text-gray-400">{formatTimestamp(log.timestamp)}</span>
            <span className="text-gray-500">•</span>
            <span className={`rounded text-xs font-medium uppercase ${getLevelColor(log.level)}`}>{log.level}</span>
            {log.callerInfo && (
              <>
                <span className="text-gray-500">•</span>
                <div className="text-xs">
                  <span className="group-hover:text-primary text-gray-600 transition-colors">
                    {log.callerInfo.file}
                  </span>
                </div>
              </>
            )}
          </div>
          <p className="text-sm text-white">{log.message}</p>
        </div>
      </div>
    </div>
  );
}
