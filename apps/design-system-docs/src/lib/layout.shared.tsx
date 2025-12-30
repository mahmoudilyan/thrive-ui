import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookIcon } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: 'Thrive Design System',
		},
		links: [
			{
				text: 'Storybook',
				url: 'http://localhost:6006',
				icon: <BookIcon />,
				secondary: true,
			},
		],
	};
}
