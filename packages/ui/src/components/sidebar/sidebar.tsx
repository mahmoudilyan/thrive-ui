'use client';
import React, { useState } from 'react';
import type { ElementType } from 'react';
import { useSidebar } from './sidebar-provider';
import type { NavigationItem, SecondaryNavigationItem, SubNavigationItem } from './types';
import {
	MdNotificationsNone,
	MdOutlineSettings,
	MdOutlineAddBusiness,
	MdOutlineChromeReaderMode,
	MdChromeReaderMode,
} from 'react-icons/md';

import ThriveIcon from '../icons/thrive-icon-logo';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Tooltip } from '../tooltip';
import { IconButton } from '../icon-button';
import { Button } from '../button';
import { cn } from '../../lib/utils';

interface MainNavigationButtonProps {
	item: NavigationItem;
	isActive: boolean;
	icon: string | ElementType;
	onClick: () => void;
}

function MainNavigationButton({ item, isActive, onClick }: MainNavigationButtonProps) {
	// Normalize icon types for JSX usage
	const IconFilled = typeof item.icon === 'string' ? null : (item.icon as ElementType);
	const IconOutlined =
		typeof item.iconOutlined === 'string' ? null : (item.iconOutlined as ElementType);
	const IconDuotone =
		typeof item.iconDuotone === 'string' ? null : (item.iconDuotone as ElementType);

	// Active icon: use duotone if available, otherwise filled
	const ActiveIcon = IconDuotone || IconFilled;

	return (
		<Tooltip content={item.label} side="right" delayDuration={200}>
			<button
				className={`
					group relative flex items-center justify-center flex-shrink-0
					w-[40px] h-[40px] rounded-[8px] transition-all duration-200 cursor-pointer
					${isActive ? 'bg-panel shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]' : 'hover:bg-panel/50'}
				`}
				onClick={onClick}
				data-name={`main-navigation-${item.id}`}
				aria-label={`Navigate to ${item.label}`}
			>
				<div className="relative w-6 h-6 flex items-center justify-center">
					{typeof item.icon === 'string' ? (
						<img alt={item.label} className="w-6 h-6 object-contain" src={item.icon} />
					) : (
						<>
							{/* Active State Icon (Duotone or Filled, Teal) */}
							{ActiveIcon && (
								<ActiveIcon
									className={`
										w-6 h-6 transition-opacity duration-150 absolute
										${isActive ? 'opacity-100 text-ink-primary' : 'opacity-0'}
									`}
								/>
							)}
							{/* Inactive State Icon (Outlined, Dark Gray) */}
							{(IconOutlined || IconFilled) && (
								<>
									{IconOutlined ? (
										<IconOutlined
											className={`
												w-6 h-6 transition-opacity duration-150
												${isActive ? 'opacity-0' : 'opacity-100 text-ink-dark group-hover:text-ink-primary'}
											`}
										/>
									) : IconFilled ? (
										<IconFilled
											className={`
												w-6 h-6 transition-opacity duration-150
												${isActive ? 'opacity-0' : 'opacity-100 text-ink-dark group-hover:text-ink-primary'}
											`}
										/>
									) : null}
								</>
							)}
						</>
					)}
				</div>
			</button>
		</Tooltip>
	);
}

export interface SidebarSubItemProps {
	label: string;
	isActive?: boolean;
	onClick?: () => void;
	className?: string;
	showTopLine?: boolean; // First child connector
	showArrow?: boolean; // Active item connector
	showVerticalLine?: boolean; // Items before active
}

// Connector SVG Components
const TopLineConnector = () => (
	<svg
		width="2"
		height="4"
		viewBox="0 0 2 4"
		fill="none"
		className="absolute left-4 -top-1"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M0 0H1.5V4H0V0Z" fill="var(--color-muted)" />
	</svg>
);

const ArrowConnector = () => (
	<svg
		width="12"
		height="19"
		viewBox="0 0 12 19"
		fill="none"
		className="absolute left-4 top-0"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.01353e-07 0H1.5V9.95C1.5 10.8025 1.50058 11.3967 1.53838 11.8593C1.57547 12.3132 1.6446 12.574 1.74524 12.7715C1.96095 13.1948 2.30516 13.539 2.72852 13.7548C2.92604 13.8554 3.18681 13.9245 3.64068 13.9616C4.10331 13.9994 4.69755 14 5.55 14H8.93934L7.21967 12.2803C6.92678 11.9874 6.92678 11.5126 7.21967 11.2197C7.51256 10.9268 7.98744 10.9268 8.28033 11.2197L11.2803 14.2197C11.5732 14.5126 11.5732 14.9874 11.2803 15.2803L8.28033 18.2803C7.98744 18.5732 7.51256 18.5732 7.21967 18.2803C6.92678 17.9874 6.92678 17.5126 7.21967 17.2197L8.93934 15.5H5.51788C4.70505 15.5 4.04944 15.5 3.51853 15.4566C2.9719 15.412 2.49175 15.3176 2.04754 15.0913C1.34193 14.7317 0.768252 14.1581 0.408726 13.4525C0.182386 13.0082 0.0880253 12.5281 0.0433638 11.9815C-1.31503e-05 11.4506 -7.42804e-06 10.795 2.01353e-07 9.98212V0Z"
			fill="var(--color-muted)"
		/>
	</svg>
);

const VerticalLineConnector = () => (
	<svg
		width="2"
		height="100%"
		viewBox="0 0 2 33"
		preserveAspectRatio="none"
		fill="none"
		className="absolute left-4 top-0 h-full"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M0 0H1.5V33H0V0Z" fill="var(--color-muted)" />
	</svg>
);

export function SidebarSubItem({
	label,
	isActive,
	onClick,
	className = '',
	showTopLine,
	showArrow,
	showVerticalLine,
}: SidebarSubItemProps) {
	return (
		<button
			className={cn(
				'group flex items-center w-full text-left py-2 pl-8 pr-2 relative h-8',
				'text-sm leading-5 rounded-md transition-all duration-150 cursor-pointer',
				isActive ? 'text-ink-dark font-medium' : 'text-ink-light font-normal hover:text-ink-dark',
				className
			)}
			onClick={onClick}
			aria-label={`Navigate to ${label}`}
		>
			{/* Connectors */}
			{showTopLine && <TopLineConnector />}
			{showArrow && <ArrowConnector />}
			{showVerticalLine && <VerticalLineConnector />}

			<span className="h-4 flex items-center">{label}</span>
		</button>
	);
}

export interface SidebarItemProps {
	label: string;
	/** Outlined icon - shown by default */
	iconOutlined?: React.ElementType | string;
	/** Filled icon - shown on hover and active state. If not provided, iconOutlined stays visible */
	iconFilled?: React.ElementType | string;
	isActive?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
	className?: string;
}

export function SidebarItem({
	label,
	iconOutlined,
	iconFilled,
	isActive,
	onClick,
	children,
	className = '',
}: SidebarItemProps) {
	const [isHovered, setIsHovered] = React.useState(false);
	const hasChildren = React.Children.count(children) > 0;

	// Determine which icon to show
	const showFilledIcon = (isActive || isHovered) && iconFilled;

	// Check if icons are image URLs or components
	const isOutlinedImageUrl = typeof iconOutlined === 'string';
	const isFilledImageUrl = typeof iconFilled === 'string';

	// Get the current icon to display
	const currentIcon = showFilledIcon ? iconFilled : iconOutlined;
	const isImageUrl = showFilledIcon ? isFilledImageUrl : isOutlinedImageUrl;
	const IconComponent = !isImageUrl ? (currentIcon as ElementType | undefined) : null;

	return (
		<div className={`w-full ${className}`}>
			<button
				className={cn(
					'w-full flex items-center p-2 rounded-md transition-all duration-150 cursor-pointer',
					isActive ? 'bg-primary-muted' : 'bg-transparent hover:bg-panel'
				)}
				onClick={onClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				aria-label={label}
			>
				<div className="flex items-center gap-1.5 min-w-0">
					{/* Icon - only render if icon is provided */}
					{currentIcon && (
						<div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
							{isImageUrl ? (
								<img alt={label} className="w-5 h-5 object-contain" src={currentIcon as string} />
							) : (
								IconComponent && (
									<IconComponent
										className={cn(
											'w-4 h-4 text-icon',
											isActive && 'text-primary-solid hover:text-primary-solid-hover'
										)}
									/>
								)
							)}
						</div>
					)}

					{/* Label */}
					<span
						className={cn(
							'text-sm leading-4 truncate transition-colors duration-150',
							isActive
								? 'text-primary-solid font-medium'
								: isHovered
									? 'text-ink-dark font-normal'
									: 'text-ink font-normal'
						)}
					>
						{label}
					</span>
				</div>
			</button>

			{/* Sub-Items - visible when parent is active */}
			{hasChildren && isActive && (
				<div className="flex flex-col mt-1">
					{React.Children.map(children, (child, index) => {
						if (!React.isValidElement<SidebarSubItemProps>(child)) return child;

						const childrenArray = React.Children.toArray(children);
						const isFirst = index === 0;

						// Find the first active child index
						let activeIndex = -1;
						childrenArray.forEach((c, i) => {
							if (React.isValidElement<SidebarSubItemProps>(c) && c.props.isActive) {
								activeIndex = i;
							}
						});

						const isChildActive = child.props.isActive;
						const isBeforeActive = activeIndex !== -1 && index < activeIndex;

						// Determine connector props
						const connectorProps: Partial<SidebarSubItemProps> = {
							showTopLine: isFirst, // First child always has top line
							showArrow: isChildActive, // Active child has arrow
							showVerticalLine: isBeforeActive, // Items before active have vertical line
						};

						return React.cloneElement(child, connectorProps);
					})}
				</div>
			)}
		</div>
	);
}

// ============================================================================
// SidebarPanel - Reusable secondary navigation panel component
// ============================================================================

export interface SidebarPanelProps {
	/** Panel title displayed in the header */
	title?: string;
	/** Whether the panel is open/visible */
	isOpen?: boolean;
	/** Callback when toggle button is clicked */
	onToggle?: () => void;
	/** Animation duration in ms */
	animationDuration?: number;
	/** Custom className for the panel */
	className?: string;
	/** Children to render in the navigation area */
	children?: React.ReactNode;
}

export function SidebarPanel({
	title = 'Navigation',
	isOpen = true,
	onToggle,
	animationDuration = 300,
	className = '',
	children,
}: SidebarPanelProps) {
	return (
		<div
			className={`
				bg-bg h-full relative flex-shrink-0 transition-all ease-in-out overflow-hidden border-r border-border-secondary z-10
				${isOpen ? 'w-[224px]' : 'w-0 border-r-0'}
				${className}
			`}
			style={{ transitionDuration: `${animationDuration}ms` }}
		>
			<div
				className={`
					flex flex-col h-full overflow-hidden transition-opacity w-full px-4 py-5
					${isOpen ? 'opacity-100' : 'opacity-0'}
				`}
				style={{ transitionDuration: `${animationDuration}ms` }}
			>
				{/* Header */}
				<div className="flex items-center justify-between pl-[10px] py-2 w-full">
					<h2 className="text-xl font-medium text-ink-dark">{title}</h2>
					{onToggle && (
						<Tooltip content={isOpen ? 'Collapse sidebar' : 'Expand sidebar'} side="bottom">
							<IconButton
								variant="ghost-body"
								size="xs"
								icon={isOpen ? <MdOutlineChromeReaderMode /> : <MdChromeReaderMode />}
								onClick={onToggle}
								aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
							/>
						</Tooltip>
					)}
				</div>

				{/* Navigation Items */}
				<nav
					className="flex flex-col flex-1 overflow-y-auto gap-1 scrollbar-custom mt-1"
					role="navigation"
					aria-label="Secondary navigation"
				>
					{children}
				</nav>
			</div>
		</div>
	);
}

// ============================================================================
// SideNavigation - Full sidebar with primary rail and secondary panel
// ============================================================================

interface SideNavigationProps {
	className?: string;
}

export function SideNavigation({ className = '' }: SideNavigationProps) {
	const {
		secondaryIsOpen,
		toggleSecondary,
		activeMainItem,
		setActiveMainItem,
		activeSecondaryItem,
		setActiveSecondaryItem,
		activeSubItem,
		setActiveSubItem,
		mainNavItems,
		config,
		setSecondaryIsOpen,
	} = useSidebar();

	// Handle main navigation click
	const handleMainNavClick = (item: NavigationItem) => {
		setActiveMainItem(item.id);
		item.onClick();

		// If clicking on the same active item, toggle secondary panel
		if (activeMainItem === item.id) {
			toggleSecondary();
		} else if (!secondaryIsOpen) {
			// If secondary is closed and we click a different item, open it
			setSecondaryIsOpen(true);
		}
	};

	// Handle secondary navigation item click wrapper
	const createHandleSecondaryItemClick = (item: SecondaryNavigationItem) => () => {
		const hasSubItems = item.subItems && item.subItems.length > 0;

		// Set the item as active
		setActiveSecondaryItem(item.id);

		if (hasSubItems) {
			// Auto-navigate to first sub-item
			const firstSubItem = item.subItems?.[0];
			if (firstSubItem) {
				setActiveSubItem(firstSubItem.id);
				firstSubItem.onClick();
			}
		} else {
			// Clear sub-item selection when clicking an item without children
			setActiveSubItem(null);
			item.onClick();
		}
	};

	const handleSubItemClick = (subItem: SubNavigationItem) => {
		setActiveSubItem(subItem.id);
		subItem.onClick();
	};

	// Get current secondary navigation items
	const getCurrentSecondaryItems = (): SecondaryNavigationItem[] => {
		const activeMainNavItem = mainNavItems.find(item => item.id === activeMainItem);
		return activeMainNavItem?.children || [];
	};

	const currentSecondaryItems = getCurrentSecondaryItems();
	const animationDuration = config.animationDuration || 300;
	const activeMainNavItem = mainNavItems.find(item => item.id === activeMainItem);

	return (
		<div className={`flex sticky top-0 left-0 h-screen overflow-hidden ${className}`}>
			{/* Primary Navigation Rail */}
			<div className="bg-bg flex flex-col items-center justify-between py-[12px] px-[16px] w-[64px] border-r border-border-secondary h-full z-20">
				{/* Top Section */}
				<div className="flex flex-col items-center gap-[12px] w-full">
					{/* Logo */}
					<div className="flex flex-col items-center justify-center pb-[32px] w-full">
						<div className="w-[36px] h-[36px] flex items-center justify-center">
							<ThriveIcon />
						</div>
					</div>

					{/* Main Navigation Items */}
					<nav
						className="flex flex-col gap-[12px] w-full items-center"
						role="navigation"
						aria-label="Main navigation"
					>
						{mainNavItems.map(item => (
							<MainNavigationButton
								key={item.id}
								item={item}
								icon={item.icon}
								isActive={activeMainItem === item.id}
								onClick={() => handleMainNavClick(item)}
							/>
						))}
					</nav>
				</div>

				{/* Bottom Section - Utilities */}
				<div className="flex flex-col items-center gap-[12px] w-full">
					<div className="flex flex-col gap-[12px] items-center">
						<Tooltip content="Add Business" side="right" delayDuration={200}>
							<button
								className="w-[24px] h-[24px] flex items-center justify-center text-ink-dark hover:text-ink-primary transition-colors duration-200 cursor-pointer"
								aria-label="Add Business"
							>
								<MdOutlineAddBusiness className="w-[20px] h-[20px]" />
							</button>
						</Tooltip>

						<Tooltip content="Settings" side="right" delayDuration={200}>
							<button
								className="w-[24px] h-[24px] flex items-center justify-center text-ink-dark hover:text-ink-primary transition-colors duration-200 cursor-pointer"
								aria-label="Settings"
							>
								<MdOutlineSettings className="w-[20px] h-[20px]" />
							</button>
						</Tooltip>

						<Tooltip content="Notifications" side="right" delayDuration={200}>
							<button
								className="relative w-[24px] h-[24px] flex items-center justify-center text-ink-dark hover:text-ink-primary transition-colors duration-200 cursor-pointer"
								aria-label="Notifications"
							>
								<MdNotificationsNone className="w-[20px] h-[20px]" />
								{/* Notification badge */}
								<span className="absolute top-[2px] right-[2px] w-[6px] h-[6px] bg-destructive-solid rounded-full border border-bg" />
							</button>
						</Tooltip>
					</div>

					{/* User Avatar */}
					<Popover>
						<PopoverTrigger asChild>
							<Button aria-label="User Profile" variant="ghost">
								<Avatar size="xs">
									<AvatarImage src="/avatar-placeholder.svg" alt="User" />
									<AvatarFallback variant="normal">U</AvatarFallback>
								</Avatar>
							</Button>
						</PopoverTrigger>
						<PopoverContent side="right" sideOffset={12} className="w-48">
							<div className="flex flex-col gap-1">
								<p className="text-sm font-medium text-ink-primary">User Account</p>
								<p className="text-xs text-ink-light">user@example.com</p>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* Secondary Navigation Panel - using SidebarPanel */}
			<SidebarPanel
				title={activeMainNavItem?.label || 'Dashboard'}
				isOpen={secondaryIsOpen}
				onToggle={toggleSecondary}
				animationDuration={animationDuration}
			>
				{/* SidebarItem auto-calculates connectorType for children based on isActive */}
				{currentSecondaryItems.map(item => (
					<SidebarItem
						key={item.id}
						label={item.label}
						iconOutlined={item.iconOutlined}
						iconFilled={item.iconFilled}
						isActive={activeSecondaryItem === item.id}
						onClick={createHandleSecondaryItemClick(item)}
					>
						{item.subItems?.map(subItem => (
							<SidebarSubItem
								key={subItem.id}
								label={subItem.label}
								isActive={activeSubItem === subItem.id}
								onClick={() => handleSubItemClick(subItem)}
							/>
						))}
					</SidebarItem>
				))}
			</SidebarPanel>
		</div>
	);
}
