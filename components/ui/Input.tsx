'use client';

import type React from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50';

    const variantClasses = {
      default:
        'border-white/10 bg-background-secondary text-white placeholder-gray-500 focus:border-primary focus:ring-primary/50',
      filled:
        'border-transparent bg-background-secondary text-white placeholder-gray-500 focus:bg-background-secondary focus:ring-primary/50',
      outlined:
        'border-white/10 bg-transparent text-white placeholder-gray-500 focus:border-primary focus:ring-primary/50',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
      className,
    );

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400',
                disabled && 'opacity-50',
              )}>
              {leftIcon}
            </div>
          )}

          <input type={type} className={inputClasses} disabled={disabled} ref={ref} {...props} />

          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400',
                disabled && 'opacity-50',
              )}>
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-1 text-xs">
            {error && <p className="text-red-400">{error}</p>}
            {!error && helperText && <p className="text-gray-400">{helperText}</p>}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
