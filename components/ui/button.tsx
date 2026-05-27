import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-primary-900 hover:bg-brand-600 shadow-lg shadow-brand-500/25 hover:shadow-brand-600/30',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25',
        outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-primary-900',
        secondary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg',
        ghost: 'text-primary-300 hover:text-white hover:bg-primary-700',
        link: 'text-brand-500 underline-offset-4 hover:underline',
        whatsapp: 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-13 px-8 py-3 text-base',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, suppressHydrationWarning, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        suppressHydrationWarning={true}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
