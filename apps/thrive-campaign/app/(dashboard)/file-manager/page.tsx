import { Suspense } from 'react';
import { PageSection } from '@thrive/ui';
import { FileManagerSimple } from '@/components/assets/file-manager-simple';
import { FileManagerProvider } from '@/components/assets/file-manager-provider';

interface SearchParams {
	view?: 'grid' | 'list';
}

export default async function FileManagerPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { view = 'grid' } = await searchParams;

	const getBreadcrumbs = () => {
		return [
			{
				label: 'Dashboard',
				href: '/',
			},
			{
				label: 'File Manager',
				href: '/file-manager',
			},
		];
	};

	return (
		<>
			<PageSection
				showSidebarToggle
				pageTitle="File Manager"
				breadcrumbs={getBreadcrumbs()}
				secondaryActions={[
					{ label: 'Settings', href: '/file-manager/settings' },
					{ label: 'Help', href: '/file-manager/help' },
				]}
			/>
			<FileManagerProvider>
				<Suspense fallback={<div className="p-8 text-center">Loading file manager...</div>}>
					<div className="h-[calc(100vh-200px)]">
						<FileManagerSimple />
					</div>
				</Suspense>
			</FileManagerProvider>
		</>
	);
}
