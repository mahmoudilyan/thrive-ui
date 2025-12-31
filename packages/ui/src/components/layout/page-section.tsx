'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { MdMoreHoriz, MdOutlineChromeReaderMode } from 'react-icons/md';

import { Button } from '../button';
import { IconButton } from '../icon-button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../dropdown-menu';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '../breadcrumbs';
import { Tooltip } from '../tooltip';
import { useSidebar } from '../sidebar/sidebar-provider';
import { Icon } from '../icon';

interface BreadcrumbActionItem {
	label: string;
	onClick?: () => void;
	isDelete?: boolean;
	icon?: React.ReactElement;
}

export interface PageSectionBreadcrumbItem {
	label: string;
	href?: string;
	preserveQuery?: boolean;
	onClick?: () => void;
	actions?: BreadcrumbActionItem[];
}

export interface PageSectionActionItem {
	label: string;
	href?: string;
	onClick?: () => void;
	icon?: React.ReactNode;
	isDelete?: boolean;
}

export interface PageSectionSecondaryActionItem {
	label: string;
	href?: string;
	onClick?: () => void;
	icon?: React.ReactNode;
}

export interface PageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
	// Breadcrumbs or a single page title
	breadcrumbs?: PageSectionBreadcrumbItem[];
	pageTitle?: string;

	// Primary CTA on the right
	primaryAction?: PageSectionActionItem;

	// Visible secondary buttons on the right (left of primary)
	secondaryActions?: PageSectionSecondaryActionItem[];

	// Overflow actions in a menu button
	otherActions?: PageSectionActionItem[];

	// Whether to show the secondary sidebar toggle button
	showSidebarToggle?: boolean;
}

export default function PageSection({
	breadcrumbs,
	pageTitle,
	primaryAction,
	secondaryActions,
	otherActions,
	showSidebarToggle = false,
	className,
	...props
}: PageSectionProps) {
	const handleBreadcrumbClick = (item: PageSectionBreadcrumbItem, e: React.MouseEvent) => {
		// If a custom handler is provided, use it and prevent default navigation
		if (item.onClick) {
			e.preventDefault();
			item.onClick();
		}
	};

	const { secondaryIsOpen, toggleSecondary } = (() => {
		try {
			return useSidebar();
		} catch (e) {
			// Not within a SidebarProvider; gracefully no-op
			return { secondaryIsOpen: undefined as unknown as boolean, toggleSecondary: () => {} } as any;
		}
	})();

	const lastCrumb =
		breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : undefined;
	const prevCrumbs = breadcrumbs && breadcrumbs.length > 1 ? breadcrumbs.slice(0, -1) : [];

	// if (variant === 'create-wizard') {
	// 	return (
	// 		<div
	// 			className={cn(
	// 				'flex items-center justify-between mb-8',
	// 				'-ml-2xl -mr-2xl pl-space-2xl pr-space-2xl w-[calc(100% + 2xl * 2)] border-b border-border-secondary',
	// 				className
	// 			)}
	// 			{...props}
	// 		>
	// 			<div className="flex items-center gap-2">
	// 				<div className="flex min-w-0 flex-col gap-1">
	// 					{showSidebarToggle && !secondaryIsOpen && (
	// 						<>
	// 							<div className="flex items-center gap-2">
	// 								<Tooltip
	// 									content={secondaryIsOpen ? 'Hide sidebar' : 'Open sidebar'}
	// 									side="bottom"
	// 								>
	// 									<IconButton
	// 										variant="ghost"
	// 										size="xs"
	// 										aria-label={secondaryIsOpen ? 'Hide sidebar' : 'Open sidebar'}
	// 										icon={<MdOutlineChromeReaderMode />}
	// 										onClick={toggleSecondary}
	// 									/>
	// 								</Tooltip>
	// 							</div>
	// 						</>
	// 					)}
	// 					<h1 className="text-xl font-medium">{pageTitle}</h1>
	// 				</div>
	// 			</div>
	// 			{steps}
	// 		</div>
	// 	);
	// }

	return (
		<div
			className={cn('flex items-center justify-between px-space-2xl py-space-xl', className)}
			{...props}
		>
			<div className="flex items-center gap-space-2xs">
				{showSidebarToggle && !secondaryIsOpen && (
					<Tooltip content={secondaryIsOpen ? 'Hide sidebar' : 'Open sidebar'} side="bottom">
						<IconButton
							variant="ghost"
							size="xs"
							aria-label={secondaryIsOpen ? 'Hide sidebar' : 'Open sidebar'}
							icon={<MdOutlineChromeReaderMode />}
							onClick={toggleSecondary}
						/>
					</Tooltip>
				)}
				<div className="min-w-0 flex flex-col gap-space-2xs">
					{breadcrumbs && breadcrumbs.length > 0 ? (
						<div className="-mx-1.5">
							{prevCrumbs.length > 0 && (
								<Breadcrumb>
									<BreadcrumbList>
										{prevCrumbs.map(item => (
											<BreadcrumbItem key={item.label}>
												<BreadcrumbLink
													onClick={e => handleBreadcrumbClick(item, e)}
													href={item.href || '#'}
												>
													{item.label}
												</BreadcrumbLink>
												<BreadcrumbSeparator />
											</BreadcrumbItem>
										))}
									</BreadcrumbList>
								</Breadcrumb>
							)}

							{lastCrumb && (
								<div className="flex items-center gap-space-xs">
									<h1 className="text-xl font-medium text-foreground truncate">
										{lastCrumb.label}
									</h1>
									{breadcrumbs && breadcrumbs.length > 1 && (
										<>
											{lastCrumb.actions && lastCrumb.actions.length > 0 ? (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<IconButton
															aria-label="More options"
															variant="ghost"
															size="xs"
															icon={<MdMoreHoriz className="size-4" />}
														/>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="start" className="min-w-48">
														{lastCrumb.actions.map((action, index) => (
															<DropdownMenuItem
																key={action.label || index}
																variant={action.isDelete ? 'destructive' : undefined}
																onClick={action.onClick}
															>
																{action.icon}
																{action.label}
															</DropdownMenuItem>
														))}
													</DropdownMenuContent>
												</DropdownMenu>
											) : null}
										</>
									)}
								</div>
							)}
						</div>
					) : (
						<h2 className="text-xl font-medium text-ink-dark">{pageTitle}</h2>
					)}
				</div>
			</div>

			<div className="flex items-center gap-space-xs min-h-9">
				{secondaryActions?.map(action => (
					<Button key={action.label} variant="secondary" onClick={action.onClick} asChild>
						<a href={action.href}>{action.label}</a>
					</Button>
				))}

				{primaryAction && (
					<Button
						variant="primary"
						onClick={primaryAction.onClick}
						leftIcon={primaryAction.icon || undefined}
					>
						{primaryAction.label}
					</Button>
				)}
				{otherActions && otherActions.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<IconButton
								aria-label="More options"
								variant="secondary"
								icon={<MdMoreHoriz className="size-4" />}
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-48">
							{otherActions.map(action => (
								<DropdownMenuItem
									key={action.label}
									onClick={action.onClick}
									variant={action.isDelete ? 'destructive' : undefined}
								>
									{action.icon}
									{action.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
}
