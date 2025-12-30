'use client';

import { useState } from 'react';
import { MdUpload, MdFolder, MdInsertDriveFile } from 'react-icons/md';
import { Button } from '@thrive/ui';

interface S3Item {
	name: string;
	type: 'file' | 'folder';
	size?: number;
	lastModified?: string;
	url?: string;
}

export function SimpleFileManager() {
	const [currentPath, setCurrentPath] = useState('/');
	const [items, setItems] = useState<S3Item[]>([
		{ name: 'Documents', type: 'folder' },
		{ name: 'Images', type: 'folder' },
		{ name: 'example.pdf', type: 'file', size: 1024000, lastModified: '2024-01-15' },
		{ name: 'sample.jpg', type: 'file', size: 512000, lastModified: '2024-01-10' },
	]);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		setIsLoading(true);
		// Simulate upload delay
		setTimeout(() => {
			const newItems = Array.from(files).map(file => ({
				name: file.name,
				type: 'file' as const,
				size: file.size,
				lastModified: new Date().toISOString().split('T')[0],
			}));
			setItems(prev => [...prev, ...newItems]);
			setIsLoading(false);
		}, 1000);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div className="p-6">
			<div className="flex flex-row justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Content Assets</h1>
				<div className="flex flex-row gap-3">
					<input
						type="file"
						multiple
						onChange={handleUpload}
						style={{ display: 'none' }}
						ref={input => {
							if (input) {
								(window as any).fileInput = input;
							}
						}}
					/>
					<Button
						onClick={() => (window as any).fileInput?.click()}
						loading={isLoading}
						leftIcon={<MdUpload />}
					>
						Upload Files
					</Button>
				</div>
			</div>

			<p className="text-sm text-gray-600 mb-4">Path: {currentPath}</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{items.map((item, index) => (
					<div
						key={index}
						className="p-4 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
						onClick={() => {
							if (item.type === 'folder') {
								setCurrentPath(prev => `${prev}${item.name}/`);
							}
						}}
					>
						<div className="flex flex-row items-center mb-2">
							{item.type === 'folder' ? (
								<MdFolder size={20} color="#4A90E2" />
							) : (
								<MdInsertDriveFile size={20} color="#6B7280" />
							)}
							<span className="font-medium text-sm ml-2 truncate">{item.name}</span>
						</div>

						{item.type === 'file' && (
							<div className="flex flex-col gap-1">
								{item.size && <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>}
								{item.lastModified && <p className="text-xs text-gray-500">{item.lastModified}</p>}
							</div>
						)}
					</div>
				))}
			</div>

			{items.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No files or folders found</p>
				</div>
			)}
		</div>
	);
}
