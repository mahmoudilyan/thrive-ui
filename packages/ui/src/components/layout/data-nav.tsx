'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../button';
import { MdMoreHoriz } from 'react-icons/md';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '../dropdown-menu';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../breadcrumbs';

interface BreadcrumbItemType {
	label: string;
	href?: string;
	preserveQuery?: boolean;
	onClick?: () => void;
	actions?: Array<{
		label: string;
		onClick: () => void;
		isDelete?: boolean;
	}>;
}

interface ActionItem {
	label: string;
	onClick: () => void;
}

interface DataNavProps {
	breadcrumbs?: BreadcrumbItemType[];
	actions?: ActionItem[];
	primaryAction?: {
		label: string;
		href?: string;
		onClick?: () => void;
	};
}

export function DataNav({ breadcrumbs, actions, primaryAction }: DataNavProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handleBreadcrumbClick = (item: BreadcrumbItemType, e: React.MouseEvent) => {
		if (!item.href) return;

		e.preventDefault();

		if (item.onClick) item.onClick();

		// If we want to preserve query parameters, use the provided href
		if (item.preserveQuery) {
			router.push(item.href);
			return;
		}

		// For root paths or specific paths without IDs
		if (item.href === '/' || !item.href.includes('[id]')) {
			router.push(item.href);
			return;
		}

		// Extract the base path without ID
		const currentPathParts = pathname.split('/');
		const targetPathParts = item.href.split('/');
		const newPathParts = currentPathParts.slice(0, targetPathParts.length);
		const newPath = newPathParts.join('/');

		router.push(newPath);
	};

	return (
		<div className="flex justify-between items-center mb-8">
			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;

							return (
								<BreadcrumbItem key={item.label}>
									{!isLast ? (
										<>
											<BreadcrumbLink
												onClick={e => handleBreadcrumbClick(item, e)}
												href={item.href || '#'}
											>
												{item.label}
											</BreadcrumbLink>
											<BreadcrumbSeparator />
										</>
									) : (
										<div className="flex items-center gap-2">
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
											{item.actions && item.actions.length > 0 && (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm" aria-label="More options">
															<MdMoreHoriz className="w-4 h-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														{item.actions.map(action => (
															<DropdownMenuItem
																key={action.label}
																onClick={action.onClick}
																className={
																	action.isDelete ? 'text-destructive hover:text-destructive' : ''
																}
															>
																{action.label}
															</DropdownMenuItem>
														))}
													</DropdownMenuContent>
												</DropdownMenu>
											)}
										</div>
									)}
								</BreadcrumbItem>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}

			<div className="flex items-center gap-2">
				{actions && actions.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" aria-label="More options">
								<MdMoreHoriz className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{actions.map(action => (
								<DropdownMenuItem key={action.label} onClick={action.onClick}>
									{action.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				{primaryAction && (
					<Button variant="primary" onClick={primaryAction.onClick} asChild={!!primaryAction.href}>
						{primaryAction.href ? (
							<Link href={primaryAction.href}>{primaryAction.label}</Link>
						) : (
							<span>{primaryAction.label}</span>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
