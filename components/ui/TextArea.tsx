import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, variant = 'default', size = 'md', error, helperText, className = '', disabled, ...props }, ref) => {
    const baseClasses =
      'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical';

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

    const textAreaClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
      className,
    );

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}

        <textarea ref={ref} className={textAreaClasses} disabled={disabled} {...props} />

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

TextArea.displayName = 'TextArea';
