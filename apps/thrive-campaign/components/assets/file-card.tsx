'use client';

import { MdFolder, MdInsertDriveFile, MdImage, MdVideoFile } from 'react-icons/md';
import { FileManagerItem } from '@/types/assets';

interface FileCardProps {
	item: FileManagerItem;
	onSelect?: () => void;
	isSelected?: boolean;
}

export function FileCard({ item, onSelect, isSelected }: FileCardProps) {
	const getFileIcon = () => {
		if (item.type === 'folder') {
			return <MdFolder className="text-blue-500" size={40} />;
		}

		const extension = item.name.split('.').pop()?.toLowerCase() || '';
		const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
		const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'webm'];

		if (imageExts.includes(extension)) {
			return <MdImage className="text-green-500" size={40} />;
		}
		if (videoExts.includes(extension)) {
			return <MdVideoFile className="text-orange-500" size={40} />;
		}

		return <MdInsertDriveFile className="text-gray-500" size={40} />;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div
			onClick={onSelect}
			className={`
				p-4 border rounded-lg cursor-pointer transition-all
				hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5
				${isSelected ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'}
			`}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				{getFileIcon()}
				<span className="text-sm font-medium line-clamp-2 break-words w-full" title={item.name}>
					{item.name}
				</span>
				{item.type === 'file' && (
					<span className="text-xs text-gray-500">{formatFileSize(item.size)}</span>
				)}
			</div>
		</div>
	);
}
