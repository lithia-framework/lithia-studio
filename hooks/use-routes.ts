import { useContext } from 'react';
import { LithiaContext } from '@/components/contexts/LithiaContext';

export const useRoutes = () => {
  const { io, app } = useContext(LithiaContext);

  return [app.routes, io.isConnected];
};
