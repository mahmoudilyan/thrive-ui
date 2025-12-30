import { CampaignsList } from '@/components/campaigns/campaigns-list';
import { Suspense } from 'react';
import { PageSectionWrapper } from '../page-section-wrapper';
interface SearchParams {
	view?: 'list' | 'folder';
	folderId?: string;
}

export default async function CampaignsPage({
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
					label: 'All Campaigns',
					href: '/campaigns',
				},
			];
		}
		if (view === 'folder') {
			if (!folderId) {
				return [
					{
						label: 'All Campaigns',
						href: '/campaigns',
					},
				];
			}
			return [
				{
					label: 'All Campaigns',
					href: '/campaigns',
				},
				{
					label: 'Campaign Folder Name',
					href: `/campaigns/folder/${folderId}`,
				},
			];
		}
	};

	return (
		<>
			<PageSectionWrapper
				breadcrumbs={getBreadcrumbs()}
				primaryAction={{
					label: 'Create Campaign',
					action: 'createCampaign',
				}}
				otherActions={[
					{
						label: 'Create Folder',
						action: 'campaignSettings',
					},
					{
						label: 'Manage Folders',
						action: 'campaignSettings',
					},
				]}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<CampaignsList view={view} folderId={folderIdToPass} />
			</Suspense>
		</>
	);
}
