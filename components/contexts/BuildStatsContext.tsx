'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { LithiaContext } from './LithiaContext';

export interface BuildStats {
  totalBuilds: number;
  successfulBuilds: number;
  failedBuilds: number;
  averageBuildTime: number;
  lastBuildTime?: number;
  lastBuildDuration?: number;
  lastBuildSuccess?: boolean;
  lastBuildError?: string;
  timestamp: Date;
}

interface BuildStatsContextType {
  buildStats: BuildStats | null;
  isConnected: boolean;
}

const BuildStatsContext = createContext<BuildStatsContextType | undefined>(undefined);

interface BuildStatsProviderProps {
  children: ReactNode;
}

export function BuildStatsProvider({ children }: BuildStatsProviderProps) {
  const { io } = useContext(LithiaContext);
  const [buildStats, setBuildStats] = useState<BuildStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(io.isConnected);

    if (io.socket) {
      const handleBuildStats = (data: BuildStats) => {
        setBuildStats({
          ...data,
          timestamp: new Date(data.timestamp), // Ensure timestamp is a Date object
        });
      };

      io.socket.on('build-stats', handleBuildStats);

      // Request immediate stats when connected
      if (io.isConnected) {
        io.socket.emit('request-immediate-stats');
      }

      return () => {
        io.socket?.off('build-stats', handleBuildStats);
      };
    }
  }, [io.socket, io.isConnected]);

  return <BuildStatsContext.Provider value={{ buildStats, isConnected }}>{children}</BuildStatsContext.Provider>;
}

export function useBuildStats() {
  const context = useContext(BuildStatsContext);
  if (context === undefined) {
    throw new Error('useBuildStats must be used within a BuildStatsProvider');
  }
  return context;
}
