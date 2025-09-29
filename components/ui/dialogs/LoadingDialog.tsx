'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface LoadingDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose?: () => void;
}

export function LoadingDialog({ isOpen, title, message, onClose }: LoadingDialogProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={() => {}}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="bg-background-secondary data-closed:transform-[scale(95%)] data-closed:opacity-0 w-full max-w-md rounded-xl border border-white/10 p-6 backdrop-blur-2xl duration-300 ease-out">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-green-500" />
                </div>
                <div className="flex-1">
                  <DialogTitle as="h3" className="text-xl font-bold text-white">
                    {title}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-white/70">{message}</p>
                </div>
              </div>

              {onClose && (
                <div className="flex justify-end">
                  <Button onClick={onClose} variant="secondary" size="md">
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
