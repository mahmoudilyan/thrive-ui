'use client';

import { SidebarProvider, SideNavigation } from '@thrive/ui';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
	MdDashboard,
	MdOutlineDashboard,
	MdCampaign,
	MdOutlineCampaign,
	MdAutorenew,
	MdOutlineAutorenew,
	MdContacts,
	MdOutlineContacts,
	MdAnalytics,
	MdOutlineAnalytics,
	MdEmail,
	MdOutlineEmail,
} from 'react-icons/md';

export function AppLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	// Memoize navigation items to prevent unnecessary re-renders
	const mainNavItems = useMemo(
		() => [
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: MdDashboard,
				iconOutlined: MdOutlineDashboard,
				onClick: () => {
					router.push('/dashboard');
				},
				children: [
					{
						id: 'analytics',
						label: 'Analytics',
						iconOutlined: MdOutlineAnalytics,
						iconFilled: MdAnalytics,
						onClick: () => {
							router.push('/dashboard/analytics');
						},
						subItems: [
							{
								id: 'overview',
								label: 'Overview',
								onClick: () => {
									router.push('/dashboard/overview');
								},
							},
							{
								id: 'reports',
								label: 'Reports',
								onClick: () => {
									router.push('/dashboard/reports');
								},
							},
						],
					},
				],
			},
			{
				id: 'campaigns',
				label: 'Campaigns',
				icon: MdCampaign,
				iconOutlined: MdOutlineCampaign,
				onClick: () => {
					router.push('/campaigns');
				},
				children: [
					{
						id: 'all-campaigns',
						label: 'All Campaigns',
						iconOutlined: MdOutlineCampaign,
						iconFilled: MdCampaign,
						onClick: () => {
							router.push('/campaigns');
						},
						subItems: [
							{
								id: 'email-campaigns',
								label: 'Email Campaigns',
								onClick: () => {
									router.push('/campaigns/email');
								},
							},
							{
								id: 'templates',
								label: 'Templates',
								onClick: () => {
									router.push('/campaigns/templates');
								},
							},
						],
					},
					{
						id: 'email',
						label: 'Email',
						iconOutlined: MdOutlineEmail,
						iconFilled: MdEmail,
						onClick: () => {
							router.push('/campaigns/email');
						},
					},
				],
			},
			{
				id: 'automations',
				label: 'Automations',
				icon: MdAutorenew,
				iconOutlined: MdOutlineAutorenew,
				onClick: () => {
					router.push('/automations');
				},
				children: [
					{
						id: 'all-automations',
						label: 'All Automations',
						iconOutlined: MdOutlineAutorenew,
						iconFilled: MdAutorenew,
						onClick: () => {
							router.push('/automations');
						},
						subItems: [
							{
								id: 'workflows',
								label: 'Workflows',
								onClick: () => {
									router.push('/automations/workflows');
								},
							},
							{
								id: 'triggers',
								label: 'Triggers',
								onClick: () => {
									router.push('/automations/triggers');
								},
							},
						],
					},
				],
			},
			{
				id: 'contacts',
				label: 'Contacts',
				icon: MdContacts,
				iconOutlined: MdOutlineContacts,
				onClick: () => {
					router.push('/contacts');
				},
				children: [
					{
						id: 'all-contacts',
						label: 'All Contacts',
						iconOutlined: MdOutlineContacts,
						iconFilled: MdContacts,
						onClick: () => {
							router.push('/contacts');
						},
						subItems: [
							{
								id: 'lists',
								label: 'Lists',
								onClick: () => {
									router.push('/contacts/lists');
								},
							},
							{
								id: 'segments',
								label: 'Segments',
								onClick: () => {
									router.push('/contacts/segments');
								},
							},
						],
					},
				],
			},
		],
		[router]
	);

	return (
		<div className="flex h-screen overflow-hidden">
			<SidebarProvider mainNavItems={mainNavItems}>
				<SideNavigation />
			</SidebarProvider>
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
