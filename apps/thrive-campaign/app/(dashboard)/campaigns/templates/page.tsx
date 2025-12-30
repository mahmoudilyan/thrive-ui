import { TemplatesList } from '@/components/campaigns/templates-list';
import { Suspense } from 'react';
import { PageSection } from '@thrive/ui';

interface SearchParams {
	view?: 'list' | 'folder';
	folderId?: string;
}

export default async function TemplatesPage({
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
					label: 'All Templates',
					href: '/campaigns/templates',
				},
			];
		}
		if (view === 'folder') {
			if (!folderId) {
				return [
					{
						label: 'All Templates',
						href: '/campaigns/templates',
					},
				];
			}
			return [
				{
					label: 'All Templates',
					href: '/campaigns/templates',
				},
				{
					label: 'Template Folder',
					href: `/campaigns/templates?view=folder&folderId=${folderId}`,
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
					label: 'Create Template',
					href: '/campaigns/templates/create',
				}}
				otherActions={[
					{
						label: 'Template Settings',
						// onClick: () => {
						// 	console.log('Template settings');
						// },
					},
				]}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<TemplatesList view={view} folderId={folderIdToPass} />
			</Suspense>
		</>
	);
}
