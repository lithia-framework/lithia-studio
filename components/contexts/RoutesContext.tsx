'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { LithiaContext } from './LithiaContext';
import { Route } from '@/types';

interface RoutesContextType {
  routes: Route[];
  isLoading: boolean;
  isConnected: boolean;
  refreshRoutes: () => void;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

interface RoutesProviderProps {
  children: ReactNode;
}

export function RoutesProvider({ children }: RoutesProviderProps) {
  const { io } = useContext(LithiaContext);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    setIsConnected(io.isConnected);

    if (io.socket) {
      // Request initial routes
      io.socket.emit('get-manifest');

      // Listen for route updates
      const handleUpdateManifest = (data: { routes: Route[] }) => {
        setRoutes(data.routes);
      };

      const handleManifestUpdate = () => {
        // Refresh routes when manifest is updated
        io.socket?.emit('get-manifest');
      };

      io.socket.on('update-manifest', handleUpdateManifest);
      io.socket.on('manifest-update', handleManifestUpdate);

      return () => {
        io.socket?.off('update-manifest', handleUpdateManifest);
        io.socket?.off('manifest-update', handleManifestUpdate);
      };
    }
  }, [io.socket, io.isConnected]);

  const refreshRoutes = () => {
    if (io.socket) {
      io.socket.emit('get-manifest');
    }
  };

  const value: RoutesContextType = {
    routes,
    isLoading,
    isConnected,
    refreshRoutes,
  };

  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  );
}

export function useRoutes() {
  const context = useContext(RoutesContext);
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
}
