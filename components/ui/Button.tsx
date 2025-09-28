'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
      case 'danger':
        return 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30';
      case 'outline':
        return 'bg-transparent text-gray-300 border-white/20 hover:bg-white/5';
      case 'secondary':
      default:
        return 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex cursor-pointer items-center justify-center space-x-2 rounded-lg border font-medium backdrop-blur-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${getVariantClasses()} ${getSizeClasses()} ${className} `}
    >
      {children}
    </button>
  );
}
