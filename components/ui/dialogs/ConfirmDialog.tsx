'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50 focus:outline-none"
      onClose={onClose}
    >
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
            className="bg-background-secondary w-full max-w-md rounded-xl border border-white/10 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <DialogTitle as="h3" className="text-xl font-bold text-white">
                  {title}
                </DialogTitle>
                {description && (
                  <p className="text-sm text-white/70">{description}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                {cancelText && (
                  <Button onClick={onClose} variant="secondary" size="md">
                    {cancelText}
                  </Button>
                )}
                <Button
                  onClick={onConfirm}
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  size="md"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
