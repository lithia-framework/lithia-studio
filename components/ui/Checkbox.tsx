'use client';

import React, { forwardRef } from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      variant = 'default',
      size = 'md',
      disabled = false,
      checked,
      onChange,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'relative inline-flex items-center transition-all duration-200';

    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const checkboxSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const iconSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const getCheckboxClasses = () => {
      const base =
        'rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

      if (disabled) {
        return `${base} border-gray-600 bg-gray-700 cursor-not-allowed opacity-50`;
      }

      if (checked) {
        const checkedClasses = {
          default: 'border-gray-500 bg-gray-600 focus:ring-gray-500',
          primary: 'border-primary bg-primary focus:ring-primary',
          success: 'border-green-500 bg-green-500 focus:ring-green-500',
          warning: 'border-yellow-500 bg-yellow-500 focus:ring-yellow-500',
          error: 'border-red-500 bg-red-500 focus:ring-red-500',
        };
        return `${base} ${checkedClasses[variant]}`;
      }

      const uncheckedClasses = {
        default:
          'border-gray-600 bg-gray-800 hover:border-gray-500 focus:ring-gray-500',
        primary:
          'border-gray-600 bg-gray-800 hover:border-primary focus:ring-primary',
        success:
          'border-gray-600 bg-gray-800 hover:border-green-500 focus:ring-green-500',
        warning:
          'border-gray-600 bg-gray-800 hover:border-yellow-500 focus:ring-yellow-500',
        error:
          'border-gray-600 bg-gray-800 hover:border-red-500 focus:ring-red-500',
      };

      return `${base} ${uncheckedClasses[variant]}`;
    };

    const getLabelClasses = () => {
      const base = 'font-medium transition-colors duration-200';
      const colorClasses = {
        default: disabled ? 'text-gray-500' : 'text-gray-300',
        primary: disabled ? 'text-gray-500' : 'text-primary',
        success: disabled ? 'text-gray-500' : 'text-green-400',
        warning: disabled ? 'text-gray-500' : 'text-yellow-400',
        error: disabled ? 'text-gray-500' : 'text-red-400',
      };

      return `${base} ${colorClasses[variant]}`;
    };

    return (
      <div className={cn(baseClasses, sizeClasses[size], className)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          <div
            className={cn(
              checkboxSizeClasses[size],
              getCheckboxClasses(),
              'flex cursor-pointer items-center justify-center',
              !disabled && 'hover:scale-105',
            )}
            onClick={() => {
              if (!disabled && onChange) {
                const syntheticEvent = {
                  target: { checked: !checked },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }
            }}
          >
            {checked && (
              <CheckIcon
                className={cn(
                  iconSizeClasses[size],
                  'text-white transition-all duration-200',
                  checked && 'animate-in zoom-in-50',
                )}
              />
            )}
          </div>

          {(label || description) && (
            <div className="ml-3">
              {label && (
                <label
                  className={cn(
                    getLabelClasses(),
                    !disabled && 'cursor-pointer',
                  )}
                  onClick={() => {
                    if (!disabled && onChange) {
                      const syntheticEvent = {
                        target: { checked: !checked },
                      } as React.ChangeEvent<HTMLInputElement>;
                      onChange(syntheticEvent);
                    }
                  }}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  className={cn(
                    'text-xs transition-colors duration-200',
                    disabled ? 'text-gray-600' : 'text-gray-400',
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
