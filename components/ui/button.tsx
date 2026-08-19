import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[--color-btn-primary-bg] text-[--color-btn-primary-text] hover:bg-[--color-btn-primary-hover] focus-visible:ring-[--color-btn-primary-bg] active:scale-95',
        outline:
          'border border-[--color-btn-outline-border] text-[--color-btn-outline-text] bg-transparent hover:bg-neutral-50 focus-visible:ring-neutral-400',
        ghost:
          'text-[--color-nav-link] hover:text-[--color-nav-link-hover] hover:bg-neutral-100 focus-visible:ring-neutral-400',
        link:
          'text-[--color-section-link] underline-offset-4 hover:underline focus-visible:ring-[--color-section-link] p-0 h-auto',
      },
      size: {
        sm:   'h-8  px-3 text-xs',
        md:   'h-10 px-4 text-sm',
        lg:   'h-12 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
