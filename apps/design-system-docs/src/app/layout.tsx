import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@thrive/ui/style.css';
import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { SiteHeader } from '@/components/site-header';
import { SearchWrapper } from '@/components/search/search-wrapper';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

export const metadata: Metadata = {
	title: 'Thrive UI',
	description: 'Modern, accessible, and composable UI library for Thrive Cart',
	keywords: ['design system', 'react', 'components', 'ui', 'thrive'],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<RootProvider
					theme={{
						defaultTheme: 'light',
					}}
				>
					<SearchWrapper>
						<SiteHeader />
						{children}
					</SearchWrapper>
				</RootProvider>
			</body>
		</html>
	);
}
