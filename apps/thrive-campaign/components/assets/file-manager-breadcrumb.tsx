'use client';

import { MdChevronRight, MdHome } from 'react-icons/md';
import { useFileManager } from './file-manager-provider';
import { Button } from '@thrive/ui';

export function FileManagerBreadcrumb() {
	const { currentPath, navigateToPath } = useFileManager();

	const pathParts = currentPath.split('/').filter(Boolean);

	return (
		<div className="flex items-center gap-2">
			<Button size="sm" variant="ghost" onClick={() => navigateToPath('/')} leftIcon={<MdHome />} />

			{pathParts.map((part, index) => {
				const path = '/' + pathParts.slice(0, index + 1).join('/');
				const isLast = index === pathParts.length - 1;

				return (
					<div key={path} className="flex items-center gap-2">
						<MdChevronRight className="text-gray-400" />
						<Button
							size="sm"
							variant={isLast ? 'primary' : 'ghost'}
							onClick={() => navigateToPath(path)}
							disabled={isLast}
						>
							{part}
						</Button>
					</div>
				);
			})}
		</div>
	);
}
