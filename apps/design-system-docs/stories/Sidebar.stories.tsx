import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	SideNavigation,
	SidebarProvider,
	DashboardDuotoneIcon,
	CampaignDuotoneIcon,
	ContactsDuotoneIcon,
	SettingsDuotoneIcon,
} from '@thrive/ui';
import type { NavigationItem } from '@thrive/ui';
import {
	MdDashboard,
	MdCampaign,
	MdPeople,
	MdAnalytics,
	MdSettings,
	MdEmail,
	MdAutoAwesome,
	MdFolder,
	MdOutlineDashboard,
	MdOutlineCampaign,
	MdOutlinePeople,
	MdOutlineAnalytics,
	MdOutlineSettings,
	MdOutlineEmail,
	MdOutlineAutoAwesome,
	MdOutlineFolder,
} from 'react-icons/md';

// Mock navigation items for stories
// Using iconDuotone for Material Icons Two Tone style on active state
const mockMainNavItems: NavigationItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		icon: MdDashboard,
		iconOutlined: MdOutlineDashboard,
		iconDuotone: DashboardDuotoneIcon,
		onClick: () => console.log('Dashboard clicked'),
		children: [
			{
				id: 'overview',
				label: 'Overview',
				iconOutlined: MdOutlineDashboard,
				iconFilled: MdDashboard,
				onClick: () => console.log('Overview clicked'),
			},
			{
				id: 'analytics',
				label: 'Analytics',
				iconOutlined: MdOutlineAnalytics,
				iconFilled: MdAnalytics,
				onClick: () => console.log('Analytics clicked'),
			},
		],
	},
	{
		id: 'campaigns',
		label: 'Campaigns',
		icon: MdCampaign,
		iconOutlined: MdOutlineCampaign,
		iconDuotone: CampaignDuotoneIcon,
		onClick: () => console.log('Campaigns clicked'),
		children: [
			{
				id: 'all-campaigns',
				label: 'All Campaigns',
				iconOutlined: MdOutlineCampaign,
				iconFilled: MdCampaign,
				onClick: () => console.log('All Campaigns clicked'),
			},
			{
				id: 'create-campaign',
				label: 'Create Campaign',
				iconOutlined: MdOutlineCampaign,
				iconFilled: MdCampaign,
				onClick: () => console.log('Create Campaign clicked'),
			},
		],
	},
	{
		id: 'contacts',
		label: 'Contacts',
		icon: MdPeople,
		iconOutlined: MdOutlinePeople,
		iconDuotone: ContactsDuotoneIcon,
		onClick: () => console.log('Contacts clicked'),
		children: [
			{
				id: 'all-contacts',
				label: 'All Contacts',
				iconOutlined: MdOutlinePeople,
				iconFilled: MdPeople,
				onClick: () => console.log('All Contacts clicked'),
			},
			{
				id: 'segments',
				label: 'Segments',
				iconOutlined: MdOutlinePeople,
				iconFilled: MdPeople,
				onClick: () => console.log('Segments clicked'),
				subItems: [
					{
						id: 'segment-1',
						label: 'VIP Customers',
						onClick: () => console.log('VIP Customers clicked'),
					},
					{
						id: 'segment-2',
						label: 'New Leads',
						onClick: () => console.log('New Leads clicked'),
					},
				],
			},
		],
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: MdSettings,
		iconOutlined: MdOutlineSettings,
		iconDuotone: SettingsDuotoneIcon,
		onClick: () => console.log('Settings clicked'),
		children: [
			{
				id: 'general',
				label: 'General',
				iconOutlined: MdOutlineSettings,
				iconFilled: MdSettings,
				onClick: () => console.log('General clicked'),
			},
		],
	},
];

const meta = {
	title: 'Layout/Sidebar',
	component: SideNavigation,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
# Sidebar

A comprehensive navigation sidebar component with primary and secondary navigation panels. Provides hierarchical navigation with expandable sections and sub-items.

## Features

- **Primary Navigation**: Main navigation items displayed as icon buttons
- **Secondary Navigation**: Expandable secondary panel with detailed navigation items
- **Sub-navigation**: Support for nested navigation items within secondary items
- **State Management**: Built-in state management via SidebarProvider
- **Animations**: Smooth transitions for panel expand/collapse
- **Responsive**: Adapts to different screen sizes

## Usage

\`\`\`tsx
import { SideNavigation, SidebarProvider, DashboardDuotoneIcon } from '@thrive/ui';
import type { NavigationItem } from '@thrive/ui';
import { MdDashboard, MdOutlineDashboard } from 'react-icons/md';

const navItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: MdDashboard,                // Filled icon (fallback for active)
    iconOutlined: MdOutlineDashboard, // Default state
    iconDuotone: DashboardDuotoneIcon, // Two Tone icon for active state
    onClick: () => {},
    children: [
      {
        id: 'overview',
        label: 'Overview',
        iconOutlined: MdOutlineDashboard,
        iconFilled: MdDashboard,
        onClick: () => {},
      },
    ],
  },
];

<SidebarProvider mainNavItems={navItems}>
  <SideNavigation />
</SidebarProvider>
\`\`\`

## Configuration

The SidebarProvider accepts configuration options:
- \`defaultMainItem\`: Initial active main navigation item
- \`defaultSecondaryOpen\`: Whether secondary panel is open by default
- \`animationDuration\`: Duration of animations in milliseconds
- \`persistState\`: Whether to persist sidebar state
				`,
			},
		},
	},
	tags: ['autodocs'],
	decorators: [
		Story => (
			<SidebarProvider mainNavItems={mockMainNavItems} config={{ defaultSecondaryOpen: true }}>
				<Story />
			</SidebarProvider>
		),
	],
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};

export const SecondaryClosed: Story = {
	decorators: [
		Story => (
			<SidebarProvider mainNavItems={mockMainNavItems} config={{ defaultSecondaryOpen: false }}>
				<Story />
			</SidebarProvider>
		),
	],
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};

export const WithSubItems: Story = {
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};

export const MinimalNavigation: Story = {
	decorators: [
		Story => (
			<SidebarProvider
				mainNavItems={[
					{
						id: 'dashboard',
						label: 'Dashboard',
						icon: MdDashboard,
						iconOutlined: MdOutlineDashboard,
						iconDuotone: DashboardDuotoneIcon,
						onClick: () => console.log('Dashboard clicked'),
						children: [
							{
								id: 'overview',
								label: 'Overview',
								iconOutlined: MdOutlineDashboard,
								iconFilled: MdDashboard,
								onClick: () => console.log('Overview clicked'),
							},
						],
					},
				]}
				config={{ defaultSecondaryOpen: true }}
			>
				<Story />
			</SidebarProvider>
		),
	],
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};

// Extended navigation with more items
const extendedNavItems: NavigationItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		icon: MdDashboard,
		iconOutlined: MdOutlineDashboard,
		iconDuotone: DashboardDuotoneIcon,
		onClick: () => console.log('Dashboard clicked'),
		children: [
			{
				id: 'overview',
				label: 'Overview',
				iconOutlined: MdOutlineDashboard,
				iconFilled: MdDashboard,
				onClick: () => console.log('Overview clicked'),
			},
			{
				id: 'analytics',
				label: 'Analytics',
				iconOutlined: MdOutlineAnalytics,
				iconFilled: MdAnalytics,
				onClick: () => console.log('Analytics clicked'),
			},
		],
	},
	{
		id: 'campaigns',
		label: 'Campaigns',
		icon: MdCampaign,
		iconOutlined: MdOutlineCampaign,
		iconDuotone: CampaignDuotoneIcon,
		onClick: () => console.log('Campaigns clicked'),
		children: [
			{
				id: 'all-campaigns',
				label: 'All Campaigns',
				iconOutlined: MdOutlineCampaign,
				iconFilled: MdCampaign,
				onClick: () => console.log('All Campaigns clicked'),
			},
			{
				id: 'email-campaigns',
				label: 'Email Campaigns',
				iconOutlined: MdOutlineEmail,
				iconFilled: MdEmail,
				onClick: () => console.log('Email Campaigns clicked'),
				subItems: [
					{
						id: 'drafts',
						label: 'Drafts',
						onClick: () => console.log('Drafts clicked'),
					},
					{
						id: 'scheduled',
						label: 'Scheduled',
						onClick: () => console.log('Scheduled clicked'),
					},
					{
						id: 'sent',
						label: 'Sent',
						onClick: () => console.log('Sent clicked'),
					},
				],
			},
			{
				id: 'automations',
				label: 'Automations',
				iconOutlined: MdOutlineAutoAwesome,
				iconFilled: MdAutoAwesome,
				onClick: () => console.log('Automations clicked'),
			},
		],
	},
	{
		id: 'contacts',
		label: 'Contacts',
		icon: MdPeople,
		iconOutlined: MdOutlinePeople,
		iconDuotone: ContactsDuotoneIcon,
		onClick: () => console.log('Contacts clicked'),
		children: [
			{
				id: 'all-contacts',
				label: 'All Contacts',
				iconOutlined: MdOutlinePeople,
				iconFilled: MdPeople,
				onClick: () => console.log('All Contacts clicked'),
			},
			{
				id: 'segments',
				label: 'Segments',
				iconOutlined: MdOutlinePeople,
				iconFilled: MdPeople,
				onClick: () => console.log('Segments clicked'),
				subItems: [
					{
						id: 'segment-1',
						label: 'VIP Customers',
						onClick: () => console.log('VIP Customers clicked'),
					},
					{
						id: 'segment-2',
						label: 'New Leads',
						onClick: () => console.log('New Leads clicked'),
					},
					{
						id: 'segment-3',
						label: 'Inactive Users',
						onClick: () => console.log('Inactive Users clicked'),
					},
				],
			},
		],
	},
	{
		id: 'content',
		label: 'Content',
		icon: MdFolder,
		iconOutlined: MdOutlineFolder,
		// No duotone icon for Content - will fall back to filled icon
		onClick: () => console.log('Content clicked'),
		children: [
			{
				id: 'templates',
				label: 'Templates',
				iconOutlined: MdOutlineFolder,
				iconFilled: MdFolder,
				onClick: () => console.log('Templates clicked'),
			},
		],
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: MdSettings,
		iconOutlined: MdOutlineSettings,
		iconDuotone: SettingsDuotoneIcon,
		onClick: () => console.log('Settings clicked'),
		children: [
			{
				id: 'general',
				label: 'General',
				iconOutlined: MdOutlineSettings,
				iconFilled: MdSettings,
				onClick: () => console.log('General clicked'),
			},
		],
	},
];

export const ExtendedNavigation: Story = {
	decorators: [
		Story => (
			<SidebarProvider mainNavItems={extendedNavItems} config={{ defaultSecondaryOpen: true }}>
				<Story />
			</SidebarProvider>
		),
	],
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};

export const PrimaryOnlyCollapsed: Story = {
	decorators: [
		Story => (
			<SidebarProvider mainNavItems={mockMainNavItems} config={{ defaultSecondaryOpen: false }}>
				<Story />
			</SidebarProvider>
		),
	],
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};

export const WithMultipleSubItems: Story = {
	decorators: [
		Story => (
			<SidebarProvider mainNavItems={extendedNavItems} config={{ defaultSecondaryOpen: true }}>
				<Story />
			</SidebarProvider>
		),
	],
	render: () => (
		<div className="bg-bg min-h-screen">
			<SideNavigation />
		</div>
	),
};
