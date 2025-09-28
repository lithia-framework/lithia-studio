'use client';

import { LogEntry } from './LogEntry';

interface Log {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
  source?: string;
  callerInfo?: {
    file: string;
  };
  args?: unknown[];
}

interface LogsListProps {
  logs: Log[];
}

export function LogsList({ logs }: LogsListProps) {
  return (
    <div className="">
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-8 py-16">
          {/* Animated Icon */}
          <div className="relative">
            <div className="from-primary/20 to-primary/10 h-16 w-16 rounded-full bg-gradient-to-r p-4">
              <div className="from-primary to-primary/60 h-8 w-8 animate-pulse rounded-full bg-gradient-to-r"></div>
            </div>
            <div className="border-primary/20 absolute -inset-2 animate-ping rounded-full border"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium text-white">Waiting for Server Logs</h3>
            <p className="text-sm text-gray-400">New logs will appear here in real-time as they are generated</p>
          </div>

          {/* Progress Dots */}
          <div className="flex space-x-2">
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="max-h-[600px] divide-y divide-white/10">
          {logs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
