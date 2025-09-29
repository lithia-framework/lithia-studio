'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LithiaContext } from './LithiaContext';

export interface ServerStats {
  uptime: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  nodeVersion: string;
  platform: string;
  arch: string;
  cpuUsage: number;
  timestamp: Date;
}

export interface MemoryDataPoint {
  timestamp: number;
  rss: number;
  heapUsed: number;
  heapTotal: number;
}

interface ServerStatsContextType {
  stats: ServerStats | null;
  memoryHistory: MemoryDataPoint[];
  isConnected: boolean;
}

const ServerStatsContext = createContext<ServerStatsContextType | undefined>(
  undefined,
);

interface ServerStatsProviderProps {
  children: ReactNode;
}

export function ServerStatsProvider({ children }: ServerStatsProviderProps) {
  const { io } = useContext(LithiaContext);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [memoryHistory, setMemoryHistory] = useState<MemoryDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(io.isConnected);

    if (io.socket) {
      const handleServerStats = (data: ServerStats) => {
        const newStats = {
          ...data,
          timestamp: new Date(data.timestamp),
        };
        setStats(newStats);

        // Add to memory history (keep last 5 minutes)
        const newDataPoint: MemoryDataPoint = {
          timestamp: Date.now(),
          rss: data.memoryUsage.rss,
          heapUsed: data.memoryUsage.heapUsed,
          heapTotal: data.memoryUsage.heapTotal,
        };

        setMemoryHistory((prev) => {
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes in milliseconds
          const updated = [...prev, newDataPoint];
          // Keep only data points from the last 5 minutes
          return updated.filter((point) => point.timestamp > fiveMinutesAgo);
        });
      };

      io.socket.on('server-stats', handleServerStats);

      // Request immediate stats when connected
      if (io.isConnected) {
        io.socket.emit('request-immediate-stats');
      }

      return () => {
        io.socket?.off('server-stats', handleServerStats);
      };
    }
  }, [io.socket, io.isConnected]);

  return (
    <ServerStatsContext.Provider value={{ stats, memoryHistory, isConnected }}>
      {children}
    </ServerStatsContext.Provider>
  );
}

export function useServerStats() {
  const context = useContext(ServerStatsContext);
  if (context === undefined) {
    throw new Error('useServerStats must be used within a ServerStatsProvider');
  }
  return context;
}
