import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-500/20 text-brand-500 border border-brand-500/30',
        secondary: 'bg-primary-700 text-primary-200',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/30',
        outline: 'text-primary-300 border border-primary-600',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
