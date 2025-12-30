'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { source } from '@/lib/source';

// Pages that should show "New" badge
const PAGES_NEW: string[] = [
	// Add new page URLs here
];

interface DocsSidebarProps {
	tree: typeof source.pageTree;
}

function SidebarItem({
	item,
	pathname,
	level = 0,
}: {
	item: any;
	pathname: string;
	level?: number;
}) {
	if (item.type === 'separator') {
		return <li className="h-1 w-full bg-border-secondary my-2" />;
	}

	if (item.type === 'page') {
		return (
			<li>
				<Link
					href={item.url}
					className={cn(
						'flex items-center justify-between rounded-md px-4 py-1.5 text-sm transition-colors hover:bg-bg hover:text-ink-dark',
						pathname === item.url &&
							'bg-primary-muted text-ink-primary font-medium hover:bg-primary-muted hover:text-ink-primary',
						level > 0 && 'ml-4'
					)}
				>
					<span>{item.name}</span>
					{/* 
					For Future use to add badge to specific pages
					{PAGES_NEW.includes(item.url) && (
						<Badge variant="secondary" className="ml-auto text-xs">
							New
						</Badge>
					)} */}
				</Link>
			</li>
		);
	}

	if (item.type === 'folder') {
		return (
			<li className={cn('space-y-1', level > 0 && 'ml-4')}>
				{item.name && (
					<div
						className={cn(
							'px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
							level > 0 && 'text-sm font-medium normal-case'
						)}
					>
						{item.name}
					</div>
				)}
				{item.children && item.children.length > 0 && (
					<ul className="space-y-1">
						{item.children.map((child: any) => (
							<SidebarItem
								key={child.$id || child.url || Math.random()}
								item={child}
								pathname={pathname}
								level={level + 1}
							/>
						))}
					</ul>
				)}
			</li>
		);
	}

	return null;
}

export function DocsSidebar({ tree }: DocsSidebarProps) {
	const pathname = usePathname();

	return (
		<aside className="sticky top-[var(--header-height,64px)] hidden h-[calc(100vh-var(--header-height,64px))] w-64 shrink-0 md:block border-r border-border">
			<div className="no-scrollbar h-full overflow-auto py-6 px-6 lg:py-8 custom-scrollbar">
				<nav className="space-y-6">
					{tree.children.map((item: any) => (
						<div key={item.$id} className="space-y-2">
							<h4 className="text-sm font-semibold px-[2px]">{item.name}</h4>
							{item.type === 'folder' && item.children && (
								<ul className="space-y-1">
									{item.children.map((child: any) => (
										<SidebarItem
											key={child.$id || child.url || Math.random()}
											item={child}
											pathname={pathname}
										/>
									))}
								</ul>
							)}
						</div>
					))}
				</nav>
			</div>
		</aside>
	);
}
