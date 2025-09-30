'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LithiaContext } from './LithiaContext';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level:
    | 'info'
    | 'warn'
    | 'error'
    | 'debug'
    | 'success'
    | 'ready'
    | 'wait'
    | 'event'
    | 'trace';
  message: string;
  args?: unknown[];
  source?: string;
  metadata?: Record<string, unknown>;
  callerInfo?: {
    file: string;
  };
}

interface LogFilters {
  searchTerm: string;
  levelFilter:
    | 'all'
    | 'info'
    | 'warn'
    | 'error'
    | 'debug'
    | 'success'
    | 'ready'
    | 'wait'
    | 'event'
    | 'trace';
  timeFilter: 'all' | '15m' | '30m' | '1h' | '6h' | '24h' | '7d';
  sourceFilter: 'all' | 'user' | 'lithia';
}

interface LogsContextType {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  filters: LogFilters;
  isLoading: boolean;
  isConnected: boolean;
  setFilters: (filters: LogFilters) => void;
  exportLogs: () => void;
  clearLogs: () => void;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

interface LogsProviderProps {
  children: ReactNode;
}

export function LogsProvider({ children }: LogsProviderProps) {
  const { io } = useContext(LithiaContext);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const [filters, setFilters] = useState<LogFilters>({
    searchTerm: '',
    levelFilter: 'all',
    timeFilter: 'all',
    sourceFilter: 'all',
  });

  useEffect(() => {
    setIsLoading(false);
    setIsConnected(io.isConnected);

    if (io.socket) {
      const handleLogEntry = (entry: LogEntry) => {
        setLogs((prevLogs) => {
          const newLogs = [entry, ...prevLogs];
          return newLogs.slice(0, 1000); // Keep only last 1000 logs
        });
      };

      io.socket.on('log-entry', handleLogEntry);

      return () => {
        io.socket?.off('log-entry', handleLogEntry);
      };
    }
  }, [io.socket, io.isConnected]);

  useEffect(() => {
    let filtered = logs;
    const now = new Date();

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          log.source?.toLowerCase().includes(filters.searchTerm.toLowerCase()),
      );
    }

    // Level filter
    if (filters.levelFilter !== 'all') {
      filtered = filtered.filter((log) => log.level === filters.levelFilter);
    }

    // Time filter
    if (filters.timeFilter !== 'all') {
      const timeMap = {
        '15m': 15 * 60 * 1000,
        '30m': 30 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
      };

      const cutoffTime = timeMap[filters.timeFilter as keyof typeof timeMap];
      const cutoff = new Date(now.getTime() - cutoffTime);

      filtered = filtered.filter((log) => {
        // Ensure timestamp is a Date object
        const logTime =
          log.timestamp instanceof Date
            ? log.timestamp
            : new Date(log.timestamp);
        return logTime >= cutoff;
      });
    }

    // Source filter
    if (filters.sourceFilter !== 'all') {
      filtered = filtered.filter((log) => log.source === filters.sourceFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, filters]);

  const exportLogs = () => {
    const logText = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp.toLocaleString()}] ${log.level.toUpperCase()}: ${log.message}`,
      )
      .join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lithia-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const value: LogsContextType = {
    logs,
    filteredLogs,
    filters,
    isLoading,
    isConnected,
    setFilters,
    exportLogs,
    clearLogs,
  };

  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
}

export function useLogs() {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
}
