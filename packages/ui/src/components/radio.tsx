'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { MdRadioButtonUnchecked, MdCircle } from 'react-icons/md';
import { cn } from '../lib/utils';

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
	rootRef?: React.Ref<HTMLDivElement>;
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Radio = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadioProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className="flex items-center space-x-2">
				<RadioGroupPrimitive.Item
					ref={ref}
					className={cn(
						'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						className
					)}
					{...props}
				>
					<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
						<MdCircle className="h-2.5 w-2.5 fill-current text-current" />
					</RadioGroupPrimitive.Indicator>
				</RadioGroupPrimitive.Item>
				{children && (
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{children}
					</label>
				)}
			</div>
		);
	}
);
Radio.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, Radio };
