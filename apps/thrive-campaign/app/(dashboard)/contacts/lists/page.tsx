import { ListsList } from '@/components/contacts/lists-list';
import { Suspense } from 'react';
import { PageSection } from '@thrive/ui';

interface SearchParams {
	view?: 'list' | 'folder';
	folderId?: string;
}

export default async function ListsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { view = 'list', folderId } = await searchParams;

	// Only pass folderId if we're in folder view
	const folderIdToPass = view === 'folder' ? folderId : undefined;

	const getBreadcrumbs = () => {
		if (view === 'list') {
			return [
				{
					label: 'All Lists',
					href: '/contacts/lists',
				},
			];
		}
		if (view === 'folder') {
			if (!folderId) {
				return [
					{
						label: 'All Lists',
						href: '/contacts/lists',
					},
				];
			}
			return [
				{
					label: 'All Lists',
					href: '/contacts/lists',
				},
				{
					label: 'List Folder',
					href: `/contacts/lists?view=folder&folderId=${folderId}`,
				},
			];
		}
	};

	return (
		<>
			<PageSection
				showSidebarToggle
				breadcrumbs={getBreadcrumbs()}
				primaryAction={{
					label: 'Create List',
					href: '/contacts/lists/create',
				}}
				otherActions={[
					{
						label: 'List Settings',
						// onClick: () => {
						// 	console.log('List settings');
						// },
					},
					{
						label: 'Import Contacts',
						// onClick: () => {
						// 	console.log('Import contacts');
						// },
					},
					{
						label: 'Export Lists',
						// onClick: () => {
						// 	console.log('Export lists');
						// },
					},
				]}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<ListsList view={view} folderId={folderIdToPass} />
			</Suspense>
		</>
	);
}
