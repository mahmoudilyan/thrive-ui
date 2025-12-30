'use client';

import { FileManagerItem } from '@/types/assets';
import { FileCard } from './file-card';

interface FileGridProps {
	items: FileManagerItem[];
}

export function FileGrid({ items }: FileGridProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
			{items.map(item => (
				<FileCard key={item.id} item={item} />
			))}
		</div>
	);
}
