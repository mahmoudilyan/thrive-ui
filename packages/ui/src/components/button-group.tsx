import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const buttonGroupVariants = cva('inline-flex items-center', {
	variants: {
		attached: {
			true: '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0 [&>*]:focus:z-10 [&>*]:hover:z-10',
			false: 'gap-2',
		},
		orientation: {
			horizontal: 'flex-row',
			vertical:
				'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
		},
		size: {
			md: '[&>*]:h-9 [&>*]:text-sm',
			sm: '[&>*]:h-8 [&>*]:text-sm',
			xs: '[&>*]:h-7 [&>*]:text-xs',
			lg: '[&>*]:h-12 [&>*]:text-base',
		},
	},
	compoundVariants: [
		{
			attached: true,
			orientation: 'vertical',
			class:
				'[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:first-child)]:border-l [&>*]:focus:z-10 [&>*]:hover:z-10',
		},
	],
	defaultVariants: {
		attached: true,
		orientation: 'horizontal',
		size: 'md',
	},
});

export interface ButtonGroupProps
	extends React.ComponentProps<'div'>,
		VariantProps<typeof buttonGroupVariants> {
	children: React.ReactNode;
}

function ButtonGroup({
	className,
	attached = true,
	orientation = 'horizontal',
	size = 'md',
	children,
	...props
}: ButtonGroupProps) {
	return (
		<div
			data-slot="button-group"
			className={cn(buttonGroupVariants({ attached, orientation, size, className }))}
			role="group"
			{...props}
		>
			{children}
		</div>
	);
}

export { ButtonGroup, buttonGroupVariants };
