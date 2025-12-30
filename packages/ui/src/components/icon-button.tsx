import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { LoaderCircleIcon } from 'lucide-react';

import { cn } from '../lib/utils';
import { buttonVariants, iconButtonSizeVariants } from './button-variants';

export interface IconButtonProps
	extends React.ComponentProps<'button'>,
		VariantProps<typeof buttonVariants>,
		VariantProps<typeof iconButtonSizeVariants> {
	/**
	 * Render as child component using Radix Slot
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * Show loading state with spinning refresh icon
	 * @default false
	 */
	loading?: boolean;
	/**
	 * The icon element to display (typically from react-icons/md)
	 */
	icon?: React.ReactNode;
}

function IconButton({
	className,
	variant = 'primary',
	size = 'md',
	asChild = false,
	icon,
	loading,
	...props
}: IconButtonProps) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot="icon-button"
			className={cn(buttonVariants({ variant }), iconButtonSizeVariants({ size }), className)}
			{...props}
		>
			{loading ? <LoaderCircleIcon className="animate-spin" /> : icon}
		</Comp>
	);
}

export { IconButton };
