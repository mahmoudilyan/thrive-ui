'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '../lib/utils';
import { Label } from './label';

const RadioCard = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioCard.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioCardItemProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
	rootRef?: React.Ref<HTMLDivElement>;
	icon?: React.ReactElement;
	label?: React.ReactNode;
	description?: React.ReactNode;
	addon?: React.ReactNode;
	indicator?: React.ReactNode | null;
	indicatorPlacement?: 'start' | 'end' | 'inside';
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const RadioCardItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	RadioCardItemProps
>(
	(
		{ className, icon, label, description, addon, children, rootRef, inputProps, ...props },
		ref
	) => {
		return (
			<div
				ref={rootRef}
				className={cn(
					'relative flex w-full items-start gap-2 rounded-md border border-border bg-panel p-4 shadow-xs outline-none has-data-[state=checked]:border-border-primary has-data-[state=checked]:outline-2-primary-solid',
					className
				)}
			>
				<RadioGroupPrimitive.Item
					ref={ref}
					className="order-1 after:absolute after:inset-0 after:cursor-pointer"
					{...props}
				>
					<RadioGroupPrimitive.Indicator />
				</RadioGroupPrimitive.Item>
				<div className="pointer-events-none flex grow items-start gap-3 [&_button]:pointer-events-auto [&_button]:relative [&_button]:z-10 [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10 [&_input]:pointer-events-auto [&_input]:relative [&_input]:z-10">
					{icon && <div className="shrink-0">{icon}</div>}
					<div className="flex grow flex-col gap-2">
						{label && (
							<Label
								htmlFor={props.id}
								className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{label}
							</Label>
						)}
						{description && (
							<p
								id={props.id ? `${props.id}-description` : undefined}
								className="text-ink-light text-xs"
							>
								{description}
							</p>
						)}
						{children}
						{addon && <div className="mt-1">{addon}</div>}
					</div>
				</div>
			</div>
		);
	}
);
RadioCardItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioCardLabel = Label;

export { RadioCard, RadioCardItem, RadioCardLabel };
