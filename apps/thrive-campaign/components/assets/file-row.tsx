'use client';

import { MdFolder, MdInsertDriveFile, MdImage, MdVideoFile } from 'react-icons/md';
import { FileManagerItem } from '@/types/assets';

interface FileRowProps {
	item: FileManagerItem;
	onSelect?: () => void;
	isSelected?: boolean;
}

export function FileRow({ item, onSelect, isSelected }: FileRowProps) {
	const getFileIcon = () => {
		if (item.type === 'folder') {
			return <MdFolder className="text-blue-500" size={24} />;
		}

		const extension = item.name.split('.').pop()?.toLowerCase() || '';
		const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
		const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'webm'];

		if (imageExts.includes(extension)) {
			return <MdImage className="text-green-500" size={24} />;
		}
		if (videoExts.includes(extension)) {
			return <MdVideoFile className="text-orange-500" size={24} />;
		}

		return <MdInsertDriveFile className="text-gray-500" size={24} />;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const formatDate = (date: Date | string) => {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div
			onClick={onSelect}
			className={`
				flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
				hover:bg-blue-50 hover:border-blue-300
				${isSelected ? 'bg-blue-50 border border-blue-400' : 'border border-transparent'}
			`}
		>
			<div className="flex-shrink-0">{getFileIcon()}</div>
			<div className="flex-1 min-w-0">
				<div className="font-medium text-sm truncate">{item.name}</div>
			</div>
			{item.type === 'file' && (
				<>
					<div className="text-sm text-gray-500 w-24 text-right">{formatFileSize(item.size)}</div>
					<div className="text-sm text-gray-500 w-32 text-right">
						{formatDate(item.dateModified)}
					</div>
				</>
			)}
			{item.type === 'folder' && (
				<div className="text-sm text-gray-500 w-56 text-right">Folder</div>
			)}
		</div>
	);
}
