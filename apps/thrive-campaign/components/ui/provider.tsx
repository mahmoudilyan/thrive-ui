'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DialogProvider, DialogManager } from '@thrive/ui';
import { DndProvider } from '@/providers/dnd-provider';
import { SidebarProvider } from '@thrive/ui';
import type { NavigationItem } from '@thrive/ui';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import DashboardTwoTone from '@mui/icons-material/DashboardTwoTone';
import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';
import {
	MdOutlineMarkEmailRead,
	MdMarkEmailRead,
	MdOutlineAccountTree,
	MdAccountTree,
	MdContacts,
	MdOutlineContacts,
} from 'react-icons/md';
import { appDialogConfig } from '@/components/dialogs';

//export const customSystem = createSystem(defaultConfig, theme);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});

export function Provider({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const mainNavItems: NavigationItem[] = useMemo(
		() => [
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: DashboardTwoTone,
				onClick: () => {
					router.push('/campaigns');
				},
			},
			{
				id: 'thrive-campaigns',
				label: 'Thrive Campaigns',
				icon: CampaignTwoToneIcon,
				onClick: () => {
					router.push('/campaigns');
				},
				children: [
					{
						id: 'thrive-campaigns',
						label: 'All Campaigns',
						iconOutlined: MdOutlineMarkEmailRead,
						iconFilled: MdMarkEmailRead,
						onClick: () => {
							router.push('/campaigns');
						},
						subItems: [
							{
								id: 'campaigns',
								label: 'All Campaigns',
								onClick: () => {
									router.push('/campaigns');
								},
							},
							{
								id: 'templates',
								label: 'Templates',
								onClick: () => {
									router.push('/campaigns');
								},
							},
						],
					},
					{
						id: 'automation',
						label: 'Automation',
						iconOutlined: MdOutlineAccountTree,
						iconFilled: MdAccountTree,
						onClick: () => {
							router.push('/automations');
						},
						subItems: [
							{
								id: 'automation',
								label: 'All Automations',
								onClick: () => {
									router.push('/automations');
								},
							},
						],
					},
					{
						id: 'contacts',
						label: 'Contacts',
						iconOutlined: MdOutlineContacts,
						iconFilled: MdContacts,
						onClick: () => {
							router.push('/contacts');
						},
						subItems: [
							{
								id: 'contacts',
								label: 'All Contacts',
								onClick: () => {
									router.push('/contacts');
								},
							},
							{
								id: 'lists',
								label: 'Lists',
								onClick: () => {
									router.push('/contacts/lists');
								},
							},
						],
					},
				],
			},
		],
		[]
	);
	return (
		<QueryClientProvider client={queryClient}>
			<DialogProvider>
				<DndProvider>
					<SidebarProvider
						mainNavItems={mainNavItems}
						config={{
							defaultMainItem: 'dashboard',
							defaultSecondaryOpen: true,
							animationDuration: 300,
						}}
					>
						{children}
						<DialogManager config={appDialogConfig} />
					</SidebarProvider>
				</DndProvider>
			</DialogProvider>
		</QueryClientProvider>
	);
}
