'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useContext } from 'react';
import { LithiaContext } from '@/components/contexts/LithiaContext';

export function DisconnectionOverlay() {
  const { io } = useContext(LithiaContext);

  return (
    <AnimatePresence>
      {!io.isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-background-secondary relative z-10 flex flex-col space-y-4 rounded-xl border border-white/10 p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/20"
                >
                  <WifiOff className="h-4 w-4 text-gray-400" />
                </motion.div>
                <h2 className="text-xl font-bold text-white">
                  Server Disconnected
                </h2>
              </div>
              <p className="max-w-md text-sm text-white/70">
                The connection to the Lithia development server has been lost.
                Please wait while we attempt to reconnect...
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-yellow-400/30 border-t-yellow-400" />
              <span className="text-sm text-yellow-400">Reconnecting...</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
