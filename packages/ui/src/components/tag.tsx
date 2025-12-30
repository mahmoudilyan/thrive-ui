import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { MdClose } from 'react-icons/md';

const tagVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
				outline: 'text-foreground border-border',
				success: 'border-transparent bg-green-500 text-white hover:bg-green-500/80',
				warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80',
				info: 'border-transparent bg-blue-500 text-white hover:bg-blue-500/80',
			},
			size: {
				default: 'px-2.5 py-0.5 text-xs',
				sm: 'px-2 py-0.5 text-xs',
				lg: 'px-3 py-1 text-sm',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface TagProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof tagVariants> {
	startElement?: React.ReactNode;
	endElement?: React.ReactNode;
	onClose?: VoidFunction;
	closable?: boolean;
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(function Tag(props, ref) {
	const {
		className,
		variant,
		size,
		startElement,
		endElement,
		onClose,
		closable = !!onClose,
		children,
		...rest
	} = props;

	return (
		<div ref={ref} className={cn(tagVariants({ variant, size }), className)} {...rest}>
			{startElement && <span className="mr-1">{startElement}</span>}
			<span>{children}</span>
			{endElement && <span className="ml-1">{endElement}</span>}
			{closable && (
				<button
					type="button"
					className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					onClick={onClose}
				>
					<MdClose className="h-3 w-3" />
					<span className="sr-only">Close</span>
				</button>
			)}
		</div>
	);
});

export { tagVariants };
