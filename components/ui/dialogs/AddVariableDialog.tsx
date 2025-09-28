'use client';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AddVariableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function AddVariableDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Add',
  cancelText = 'Cancel',
  icon,
  children,
}: AddVariableDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogPanel className="bg-background-secondary w-full max-w-md rounded-xl border border-white/10 p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center space-x-3">
                  {icon && <div className="flex-shrink-0">{icon}</div>}
                  <div className="flex-1">
                    <DialogTitle className="text-lg font-semibold text-white">
                      {title}
                    </DialogTitle>
                    {description && (
                      <p className="mt-1 text-sm text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                {children && <div className="mb-6">{children}</div>}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <Button onClick={onClose} variant="outline" size="sm">
                    {cancelText}
                  </Button>
                  <Button onClick={onConfirm} variant="primary" size="sm">
                    {confirmText}
                  </Button>
                </div>
              </DialogPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
