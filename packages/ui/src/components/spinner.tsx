import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const spinnerVariants = cva('animate-spin text-muted-foreground inline-block', {
	variants: {
		size: {
			xs: 'size-3',
			sm: 'size-4',
			md: 'size-5',
			lg: 'size-6',
			xl: 'size-8',
		},
		variant: {
			primary: 'border-primary border-t-primary-contrast',
			secondary: 'border-secondary border-t-ink-dark',
			ghost: 'border-secondary border-t-ink-dark',
			'ghost-body': 'border-secondary border-t-ink-dark',
			destructive: 'border-secondary border-t-white',
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'primary',
	},
});

export interface SpinnerProps
	extends Omit<React.ComponentProps<'span'>, 'size'>,
		VariantProps<typeof spinnerVariants> {
	/**
	 * Optional label for accessibility
	 */
	label?: string;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
	({ className, size, variant, label = 'Loading...', ...props }, ref) => {
		return (
			<div className="w-7 h-7 border-[3px] border-secondary border-t-primary rounded-full animate-spin" />
		);
	}
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
