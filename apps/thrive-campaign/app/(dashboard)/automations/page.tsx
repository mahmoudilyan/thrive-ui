import { Suspense } from 'react';
import { PageSection } from '@thrive/ui';
import { AutomationList } from '@/components/campaigns/automation-list';

interface SearchParams {
	view?: 'list' | 'folder';
	folderId?: string;
}

export default async function AutomationPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { view = 'list', folderId } = await searchParams;

	// Only pass folderId if we're in folder view
	const folderIdToPass = view === 'folder' ? folderId : undefined;
	const getBreadcrumbs = () => {
		if (view === 'list') {
			return [
				{
					label: 'All Automations',
					href: '/automation',
				},
			];
		}
		if (view === 'folder') {
			if (!folderId) {
				return [
					{
						label: 'All Automations',
						href: '/automations',
					},
				];
			}
			return [
				{
					label: 'All Automations',
					href: '/automations',
				},
				{
					label: 'Automation Folder Name',
					href: `/automations/folder/${folderId}`,
				},
			];
		}
	};

	return (
		<>
			<PageSection
				showSidebarToggle
				// pageTitle={view === 'folder' ? 'Campaign Folder Name' : 'All Campaigns'}
				breadcrumbs={getBreadcrumbs()}
				secondaryActions={[{ label: 'Export', href: '/campaigns/export' }]}
				primaryAction={{ label: 'Create Campaign', href: '/campaigns/create' }}
				otherActions={[{ label: 'Export', href: '/campaigns/export' }]}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<AutomationList view={view} folderId={folderIdToPass} />
			</Suspense>
		</>
	);
}
