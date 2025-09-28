'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import type React from 'react';
import { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  name?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      variant = 'default',
      size = 'md',
      leftIcon,
      disabled,
      required,
      value = '',
      onChange,
      name,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const previousOpenRef = useRef(false);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Se não há espaço suficiente abaixo (menos de 200px) e há mais espaço acima
        setOpenUpward(spaceBelow < 200 && spaceAbove > spaceBelow);
      }
    }, [isOpen]);

    const baseClasses =
      'relative w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50';

    const variantClasses = {
      default: 'border-white/10 bg-background-secondary text-white focus:border-primary focus:ring-primary/50',
      filled:
        'border-transparent bg-background-secondary text-white focus:bg-background-secondary focus:ring-primary/50',
      outlined: 'border-white/10 bg-transparent text-white focus:border-primary focus:ring-primary/50',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      leftIcon && 'pl-10',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
      className,
    );

    return (
      <div className="w-full" ref={ref}>
        {label && (
          <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-300">
            {label}
            {required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}

        <Listbox value={value} onChange={onChange} name={name} disabled={disabled}>
          {({ open }) => {
            // Update state only when it actually changes and we haven't already processed this change
            if (open !== previousOpenRef.current) {
              previousOpenRef.current = open;
              // Use setTimeout to defer the state update to avoid setState during render
              setTimeout(() => setIsOpen(open), 0);
            }

            return (
              <div className="relative">
                <ListboxButton ref={buttonRef} className={buttonClasses}>
                  {leftIcon && (
                    <div
                      className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400',
                        disabled && 'opacity-50',
                      )}>
                      {leftIcon}
                    </div>
                  )}

                  <span className="block truncate text-left">
                    {selectedOption ? (
                      <span className="text-white">{selectedOption.label}</span>
                    ) : (
                      <span className="text-gray-400">{placeholder}</span>
                    )}
                  </span>

                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDownIcon
                      className={cn(
                        iconSizeClasses[size],
                        'ui-open:rotate-180 text-gray-400 transition-transform duration-200',
                        disabled && 'opacity-50',
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </ListboxButton>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom={openUpward ? 'opacity-0 -translate-y-1' : 'opacity-0 translate-y-1'}
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo={openUpward ? 'opacity-0 -translate-y-1' : 'opacity-0 translate-y-1'}>
                  <ListboxOptions
                    className={cn(
                      'bg-background-secondary absolute z-10 max-h-60 w-full overflow-auto rounded-lg border border-white/10',
                      'py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none',
                      openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
                    )}>
                    {options.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={cn(
                          'relative cursor-pointer select-none px-4 py-3 transition-colors duration-150',
                          'ui-active:bg-white/5 ui-selected:bg-primary/20 ui-selected:text-primary hover:bg-white/5',
                          option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                          !option.value && value === option.value ? 'bg-primary/20 text-primary' : 'text-white',
                        )}>
                        {({ selected }: { selected: boolean }) => (
                          <>
                            <span className={cn('block truncate', selected ? 'font-semibold' : 'font-normal')}>
                              {option.label}
                            </span>

                            {selected && (
                              <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-4">
                                <CheckIcon className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            );
          }}
        </Listbox>

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

Select.displayName = 'Select';

export { Select };
