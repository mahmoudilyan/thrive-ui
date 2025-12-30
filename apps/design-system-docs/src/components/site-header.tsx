'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MdDarkMode, MdLightMode, MdSearch } from 'react-icons/md';
import { useTheme } from 'next-themes';
import { Button, Icon } from '@thrive/ui';
import siteConfig from '@/../site.config';
import { GitHub } from '@/components/icons/github-icon';
import { Storybook } from '@/components/icons/storybook-icon';
import { Figma } from '@/components/icons/figma-icon';
import { useSearch } from '@/components/search/search-provider';

export function SiteHeader() {
	const { open } = useSearch();
	const { theme, setTheme } = useTheme();
	const isDark = theme === 'dark';
	const handleThemeToggle = () => {
		setTheme(isDark ? 'light' : 'dark');
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border-secondary bg-panel backdrop-blur px-8">
			<div className="flex h-[var(--header-height,64px)] items-center px-4 md:px-6">
				<div className="mr-4 flex">
					<Link href="/docs" className="mr-6 flex items-center space-x-2">
						<Image src="/thrive-ui-logo.svg" alt="Thrive Design System" width={95} height={36} />
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-end">
					<div className="w-full md:w-auto md:flex-none">
						<Button
							onClick={open}
							variant="secondary"
							className="relative w-64 justify-start text-sm sm:pr-12 hover:bg-bg text-ink-light"
						>
							<MdSearch className="mr-2 h-4 w-4" />
							<span className="inline-flex">Search documentation...</span>
							<kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
								<span className="text-xs">⌘</span>K
							</kbd>
						</Button>
					</div>
					<nav className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="gap-2"
							leftIcon={isDark ? <MdLightMode /> : <MdDarkMode />}
							onClick={handleThemeToggle}
							aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
						/>
						<Button variant="ghost" size="sm" className="gap-2" asChild>
							<a href={siteConfig.storybookUrl} target="_blank" rel="noreferrer">
								<Icon icon={<Storybook />} />
								<span className="hidden sm:inline">Storybook</span>
							</a>
						</Button>
						<Button variant="ghost" size="sm" className="gap-2" asChild>
							<a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
								<Icon icon={<GitHub />} />
								<span className="hidden sm:inline">GitHub</span>
							</a>
						</Button>
						<Button variant="ghost" size="sm" className="gap-2" asChild>
							<a href={siteConfig.figmaUrl} target="_blank" rel="noreferrer">
								<Icon icon={<Figma />} />
								<span className="hidden sm:inline">Figma</span>
							</a>
						</Button>
					</nav>
				</div>
			</div>
		</header>
	);
}
