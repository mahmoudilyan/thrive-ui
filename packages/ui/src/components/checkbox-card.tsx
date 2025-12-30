'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cn } from '../lib/utils';
import { Label } from './label';

const CheckboxCardGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return <div className={cn('grid gap-2', className)} {...props} ref={ref} />;
	}
);
CheckboxCardGroup.displayName = 'CheckboxCardGroup';

export interface CheckboxCardItemProps
	extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
	rootRef?: React.Ref<HTMLDivElement>;
	icon?: React.ReactElement;
	label?: React.ReactNode;
	description?: React.ReactNode;
	addon?: React.ReactNode;
	indicator?: React.ReactNode | null;
	indicatorPlacement?: 'start' | 'end' | 'inside';
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const CheckboxCardItem = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	CheckboxCardItemProps
>(
	(
		{ className, icon, label, description, addon, children, rootRef, inputProps, ...props },
		ref
	) => {
		return (
			<div
				ref={rootRef}
				className={cn(
					'relative flex w-full items-start gap-2 rounded-md border border-border bg-panel p-4 shadow-xs outline-none has-data-[state=checked]:border-border-primary has-data-[state=checked]:border-2',
					className
				)}
			>
				<CheckboxPrimitive.Root
					ref={ref}
					className="order-1 after:absolute after:inset-0 after:cursor-pointer"
					{...props}
				>
					<CheckboxPrimitive.Indicator />
				</CheckboxPrimitive.Root>
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
								className="text-muted-foreground text-xs"
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
CheckboxCardItem.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxCardLabel = Label;

// Alias for consistency
const CheckboxCard = CheckboxCardGroup;

export { CheckboxCard, CheckboxCardGroup, CheckboxCardItem, CheckboxCardLabel };
