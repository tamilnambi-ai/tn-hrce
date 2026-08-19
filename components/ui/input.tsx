import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-lg border border-[--color-search-border] bg-[--color-search-bg] px-4 py-3 text-sm text-[--color-text-primary] placeholder:text-[--color-text-secondary] transition-shadow duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[--color-search-focus] focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
