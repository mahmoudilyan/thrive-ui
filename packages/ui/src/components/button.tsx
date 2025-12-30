import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';
import { buttonVariants, buttonSizeVariants } from './button-variants';
import { LoaderCircleIcon } from 'lucide-react';
import { Icon } from './icon';

export interface ButtonProps
	extends React.ComponentProps<'button'>,
		VariantProps<typeof buttonVariants>,
		VariantProps<typeof buttonSizeVariants> {
	/**
	 * Render as child component using Radix Slot
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * Show loading state with spinner icon
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Custom text to display during loading state
	 */
	loadingText?: React.ReactNode;
	/**
	 * Icon to display on the left side of the button
	 */
	leftIcon?: React.ReactNode;
	/**
	 * Icon to display on the right side of the button
	 */
	rightIcon?: React.ReactNode;
}

function Button({
	className,
	variant = 'primary',
	size = 'md',
	asChild = false,
	children,
	loading,
	loadingText,
	leftIcon,
	rightIcon,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button';
	if (asChild) {
		return (
			<Comp
				data-slot="button"
				className={cn(buttonVariants({ variant }), buttonSizeVariants({ size }), className)}
				{...props}
			>
				{children}
			</Comp>
		);
	}
	// const leftIconSpacing =
	// 	size === 'xs'
	// 		? 'mr-0.5 [&_svg]:p-[1px]' // 2px = 0.125rem
	// 		: size === 'sm'
	// 			? 'mr-1 [&_svg]:p-[1px]' // 4px = 0.25rem
	// 			: size === 'md'
	// 				? 'mr-1.5 [&_svg]:p-[2px]' // 6px = 0.375rem
	// 				: 'mr-2 [&_svg]:p-[2px]'; // 8px = 0.5rem for lg
	// const rightIconSpacing =
	// 	size === 'xs'
	// 		? 'ml-0.5 [&_svg]:p-[1px]' // 2px = 0.125rem
	// 		: size === 'sm'
	// 			? 'ml-1 [&_svg]:p-[1px]' // 4px = 0.25rem
	// 			: size === 'md'
	// 				? 'ml-1.5 [&_svg]:p-[2px]' // 6px = 0.375rem
	// 				: 'ml-2 [&_svg]:p-[2px]'; // 8px = 0.5rem for lg

	const hasLeftIcon = !!(leftIcon && !loading);
	const hasRightIcon = !!(rightIcon && !loading);

	return (
		<Comp
			data-slot="button"
			data-left-icon={hasLeftIcon ? '' : undefined}
			data-right-icon={hasRightIcon ? '' : undefined}
			className={cn(buttonVariants({ variant }), buttonSizeVariants({ size }), className)}
			{...props}
		>
			{hasLeftIcon && (
				<Icon
					icon={leftIcon as React.ReactElement}
					size={size}
					className={cn('icon icon-left')}
					fill="inherit"
				/>
			)}
			{loading ? (
				<>
					<LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
					{loadingText && <span className="ml-2">{loadingText}</span>}
				</>
			) : (
				children
			)}
			{hasRightIcon && (
				<Icon
					icon={rightIcon as React.ReactElement}
					size={size}
					className={cn('icon icon-right')}
					fill="inherit"
				/>
			)}
		</Comp>
	);
}

export { Button };
