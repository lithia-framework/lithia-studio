'use client';

import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface CustomToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  icon?: string;
}

export function CustomToast({ type, message, icon }: CustomToastProps) {
  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          bgColor: 'bg-green-500/20 border-green-500/30',
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-400" />,
          bgColor: 'bg-red-500/20 border-red-500/30',
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
          bgColor: 'bg-yellow-500/20 border-yellow-500/30',
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-400" />,
          bgColor: 'bg-blue-500/20 border-blue-500/30',
        };
    }
  };

  const config = getToastConfig();

  return (
    <div className="relative flex items-center space-x-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${config.bgColor}`}>
        {icon ? <span className="text-lg">{icon}</span> : config.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
    </div>
  );
}
