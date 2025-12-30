'use client';

import { FileManagerItem } from '@/types/assets';
import { FileRow } from './file-row';

interface FileListProps {
	items: FileManagerItem[];
}

export function FileList({ items }: FileListProps) {
	return (
		<div className="flex flex-col gap-1 p-4">
			{items.map(item => (
				<FileRow key={item.id} item={item} />
			))}
		</div>
	);
}
