'use client';

import { Route } from '@/types';
import { createContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface LithiaConfig {
  debug: boolean;
  srcDir: string;
  routesDir: string;
  outputDir: string;
  router: {
    globalPrefix: string;
  };
  server: {
    port: number;
    host: string;
    request: {
      queryParser: {
        array: {
          enabled: boolean;
          delimiter: string;
        };
        number: {
          enabled: boolean;
        };
        boolean: {
          enabled: boolean;
        };
      };
      maxBodySize: number;
    };
  };
  logger: {
    colors: boolean;
    timestamp: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  build: {
    mode: 'no-bundle' | 'full-bundle';
    externalPackages: string[];
  };
  studio: {
    enabled: boolean;
  };
  globalMiddlewares: string[];
  hooks: Record<string, string[]>;
}

interface LithiaContextType {
  io: {
    socket: Socket | null;
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  };
  app: {
    routes: Route[];
    config: LithiaConfig | null;
  };
}

interface LithiaProviderProps {
  children: React.ReactNode;
}

export const LithiaContext = createContext<LithiaContextType>({
  io: {
    socket: null,
    connectionStatus: 'disconnected',
    isConnected: false,
  },
  app: {
    routes: [],
    config: null,
  },
});

export const LithiaProvider = ({ children }: LithiaProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected');
  const [routes] = useState<Route[]>([]);
  const [config, setConfig] = useState<LithiaConfig | null>(null);

  useEffect(() => {
    const connection = io('http://localhost:8473', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    setSocket(connection);
    setIsConnected(connection.connected);
    setConnectionStatus(connection.connected ? 'connected' : 'disconnected');

    connection.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
    });

    connection.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    connection.on('error', () => {
      setIsConnected(false);
      setConnectionStatus('error');
    });

    connection.on('lithia-config', (data: { config: LithiaConfig }) => {
      setConfig(data.config);
    });

    // Request initial configuration when connected
    connection.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      // Request current configuration
      connection.emit('get-lithia-config');
    });

    return () => {
      connection.off('connect');
      connection.off('disconnect');
      connection.off('error');
      connection.off('update-manifest');
      connection.off('lithia-config');
      connection.disconnect();
    };
  }, []);

  return (
    <LithiaContext.Provider
      value={{
        io: { socket, isConnected, connectionStatus },
        app: { routes, config },
      }}
    >
      {children}
    </LithiaContext.Provider>
  );
};
