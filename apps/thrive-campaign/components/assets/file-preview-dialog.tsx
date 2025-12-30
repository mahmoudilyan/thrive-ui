'use client';

import {
	MdClose,
	MdDownload,
	MdAudioFile,
	MdDescription,
	MdArchive,
	MdInsertDriveFile,
} from 'react-icons/md';
import { Button, Skeleton } from '@thrive/ui';

interface S3Item {
	name: string;
	type: 'file' | 'folder';
	size?: number;
	lastModified?: Date;
	url?: string;
	thumbnailUrl?: string;
	key: string;
}

interface FilePreviewDialogProps {
	item: S3Item;
	url: string;
	isLoading: boolean;
	onClose: () => void;
	onDownload: (item: S3Item) => Promise<void>;
	formatFileSize: (bytes: number) => string;
}

const getFileCategory = (item: S3Item): string => {
	if (item.type === 'folder') return 'folder';
	const ext = item.name.split('.').pop()?.toLowerCase() || '';

	const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'];
	const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
	const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
	const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];
	const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];

	if (imageExts.includes(ext)) return 'image';
	if (videoExts.includes(ext)) return 'video';
	if (audioExts.includes(ext)) return 'audio';
	if (docExts.includes(ext)) return 'document';
	if (archiveExts.includes(ext)) return 'archive';
	return 'file';
};

export function FilePreviewDialog({
	item,
	url,
	isLoading,
	onClose,
	onDownload,
	formatFileSize,
}: FilePreviewDialogProps) {
	const category = getFileCategory(item);

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="p-8 text-center">
					<Skeleton className="h-[400px] w-full" />
					<p className="mt-4">Loading preview...</p>
				</div>
			);
		}

		switch (category) {
			case 'image':
				return (
					<div className="relative w-full h-full">
						<img
							src={url}
							alt={item.name}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'contain',
								maxHeight: '70vh',
							}}
						/>
					</div>
				);

			case 'video':
				return (
					<div className="relative w-full h-full">
						<video
							controls
							style={{
								width: '100%',
								height: '100%',
								maxHeight: '70vh',
							}}
						>
							<source src={url} />
							Your browser does not support the video tag.
						</video>
					</div>
				);

			case 'audio':
				return (
					<div className="p-8 text-center">
						<MdAudioFile size={64} color="#8B5CF6" />
						<p className="mt-4 mb-4 font-medium">{item.name}</p>
						<audio controls style={{ width: '100%' }}>
							<source src={url} />
							Your browser does not support the audio tag.
						</audio>
					</div>
				);

			case 'document':
				// For PDFs and documents, use an iframe
				if (item.name.toLowerCase().endsWith('.pdf')) {
					return (
						<div className="w-full h-[70vh]">
							<iframe
								src={url}
								width="100%"
								height="100%"
								style={{ border: 'none' }}
								title={item.name}
							/>
						</div>
					);
				}
				// For other documents, show download option
				return (
					<div className="p-8 text-center">
						<MdDescription size={64} color="#EF4444" />
						<p className="mt-4 mb-4 font-medium">{item.name}</p>
						<p className="text-gray-600 mb-4">This document cannot be previewed in the browser.</p>
						<Button onClick={() => onDownload(item)} leftIcon={<MdDownload />}>
							Download
						</Button>
					</div>
				);

			case 'archive':
				return (
					<div className="p-8 text-center">
						<MdArchive size={64} color="#6B7280" />
						<p className="mt-4 mb-4 font-medium">{item.name}</p>
						<p className="text-gray-600 mb-2">Archive file</p>
						{item.size && (
							<p className="text-sm text-gray-500 mb-4">Size: {formatFileSize(item.size)}</p>
						)}
						<Button onClick={() => onDownload(item)} leftIcon={<MdDownload />}>
							Download Archive
						</Button>
					</div>
				);

			default:
				return (
					<div className="p-8 text-center">
						<MdInsertDriveFile size={64} color="#6B7280" />
						<p className="mt-4 mb-4 font-medium">{item.name}</p>
						<p className="text-gray-600 mb-4">This file type cannot be previewed.</p>
						<Button onClick={() => onDownload(item)} leftIcon={<MdDownload />}>
							Download
						</Button>
					</div>
				);
		}
	};

	return (
		<div className="bg-white rounded-lg">
			<div className="flex justify-between items-center p-4 border-b border-gray-200">
				<h2 className="font-semibold text-lg">{item.name}</h2>
				<Button size="sm" variant="ghost" onClick={onClose} leftIcon={<MdClose size={20} />} />
			</div>
			<div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">{renderContent()}</div>
			<div className="flex gap-2 justify-end p-4 border-t border-gray-200">
				{item.type === 'file' && (
					<Button onClick={() => onDownload(item)} variant="secondary" leftIcon={<MdDownload />}>
						Download
					</Button>
				)}
				<Button onClick={onClose}>Close</Button>
			</div>
		</div>
	);
}
