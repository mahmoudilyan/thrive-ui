'use client';

import { useState } from 'react';
import { MdFolder, MdImage, MdInsertDriveFile, MdRefresh } from 'react-icons/md';
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import { Button, Input, Skeleton } from '@thrive/ui';

interface S3Item {
	name: string;
	type: 'file' | 'folder';
	size?: number;
	lastModified?: Date;
	url?: string;
	thumbnailUrl?: string;
	key: string;
}

interface UploadsTabProps {
	onSelect?: (url: string) => void;
}

export function UploadsTab({ onSelect }: UploadsTabProps) {
	const [currentPath, setCurrentPath] = useState('/');
	const [searchTerm, setSearchTerm] = useState('');

	const {
		data: items = [],
		isLoading,
		refetch,
	} = useApi<S3Item[], { path: string }>(API_CONFIG.s3Assets.listItems, {
		params: {
			path: currentPath,
		},
		enabled: true,
	});

	// Filter items based on search
	const filteredItems = items.filter(item => {
		if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
			return false;
		}
		return true;
	});

	// Get file type category
	const getFileCategory = (item: S3Item): string => {
		if (item.type === 'folder') return 'folder';
		const ext = item.name.split('.').pop()?.toLowerCase() || '';

		const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'];
		if (imageExts.includes(ext)) return 'image';
		return 'file';
	};

	const getFileTypeIcon = (item: S3Item) => {
		if (item.type === 'folder') return <MdFolder size={24} color="#4A90E2" />;
		const category = getFileCategory(item);
		if (category === 'image') return <MdImage size={24} color="#34D399" />;
		return <MdInsertDriveFile size={24} color="#6B7280" />;
	};

	const handleItemClick = async (item: S3Item) => {
		if (item.type === 'folder') {
			const folderPath = item.key.endsWith('/') ? item.key : item.key + '/';
			setCurrentPath(folderPath);
		} else if (onSelect) {
			// For files, get signed URL and call onSelect
			try {
				const response = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(item.key)}`);
				if (response.ok) {
					const data = await response.json();
					onSelect(data.url);
				}
			} catch (error) {
				console.error('Failed to get signed URL:', error);
			}
		}
	};

	const getBreadcrumbItems = () => {
		const cleanPath = currentPath.replace(/^\/+|\/+$/g, '');
		const pathParts = cleanPath ? cleanPath.split('/') : [];
		const items = [{ name: 'uploads', path: '/' }];

		let path = '';
		pathParts.forEach(part => {
			path += '/' + part;
			items.push({ name: part, path });
		});

		return items;
	};

	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 mb-3">
				{getBreadcrumbItems().map((item, index) => (
					<div key={index} className="flex items-center">
						{index > 0 && <span className="mx-1 text-gray-400">/</span>}
						<Button
							size="xs"
							variant={index === getBreadcrumbItems().length - 1 ? 'primary' : 'ghost'}
							onClick={() => setCurrentPath(item.path)}
						>
							{item.name}
						</Button>
					</div>
				))}
			</div>

			{/* Search and Actions */}
			<div className="flex gap-2 mb-4">
				<Input
					placeholder="Search files..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					size="sm"
					className="flex-1"
				/>
				<Button size="sm" onClick={() => refetch()} variant="ghost" leftIcon={<MdRefresh />} />
			</div>

			{/* Files Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
				{isLoading
					? Array.from({ length: 8 }).map((_, index) => (
							<div key={index} className="p-3 border border-gray-200 rounded-md">
								<Skeleton className="w-10 h-10 rounded-full mb-2" />
								<Skeleton className="h-4" />
							</div>
						))
					: filteredItems.map(item => (
							<div
								key={item.key}
								className="p-3 border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
								onClick={() => handleItemClick(item)}
							>
								<div className="flex flex-col items-center">
									{getFileCategory(item) === 'image' && item.type === 'file' ? (
										<div className="relative w-[60px] h-[60px] mb-2">
											{/* For image files, try to show thumbnail */}
											{getFileTypeIcon(item)}
										</div>
									) : (
										<div className="mb-2">{getFileTypeIcon(item)}</div>
									)}
									<p className="text-xs text-center line-clamp-2">{item.name}</p>
								</div>
							</div>
						))}
			</div>

			{filteredItems.length === 0 && !isLoading && (
				<div className="text-center py-8">
					<p className="text-gray-500 text-sm">
						{searchTerm ? 'No files match your search' : 'No files found'}
					</p>
				</div>
			)}
		</div>
	);
}
