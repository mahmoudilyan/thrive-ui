'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from './button';

export interface LinkButtonProps extends Omit<ButtonProps, 'asChild'> {
	href: string;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
	{ href, ...props },
	ref
) {
	return (
		<Button asChild {...props}>
			<Link ref={ref} href={href} />
		</Button>
	);
});
