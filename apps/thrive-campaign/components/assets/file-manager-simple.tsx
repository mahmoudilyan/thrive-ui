'use client';

import { useState, useEffect, useRef } from 'react';
import {
	MdUpload,
	MdFolder,
	MdInsertDriveFile,
	MdCreateNewFolder,
	MdDelete,
	MdHome,
	MdRefresh,
	MdImage,
	MdVideoFile,
	MdAudioFile,
	MdDescription,
} from 'react-icons/md';
import { type S3Item, type UserS3Options } from '@/lib/aws-s3-service';
import { getCurrentUserS3Options } from '@/lib/file-manager-auth';
import { toaster } from '@thrive/ui';
import { Button, Input } from '@thrive/ui';
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

interface FileManagerState {
	currentPath: string;
	items: S3Item[];
	selectedItems: string[];
	isLoading: boolean;
	searchTerm: string;
	viewMode: 'grid' | 'list';
	sortBy: 'name' | 'size' | 'date' | 'type';
	sortOrder: 'asc' | 'desc';
	filterType: 'all' | 'folders' | 'images' | 'videos' | 'audio' | 'documents' | 'archives';
	isUploading: boolean;
	dragOver: boolean;
	userOptions?: UserS3Options;
}

export function FileManagerSimple() {
	const [state, setState] = useState<FileManagerState>({
		currentPath: '/',
		items: [],
		selectedItems: [],
		isLoading: false,
		searchTerm: '',
		viewMode: 'grid',
		sortBy: 'name',
		sortOrder: 'asc',
		filterType: 'all',
		isUploading: false,
		dragOver: false,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);

	const updateState = (updates: Partial<FileManagerState>) => {
		setState(prev => ({ ...prev, ...updates }));
	};

	// Initialize user options and load items
	useEffect(() => {
		const initializeFileManager = async () => {
			try {
				const userOptions = await getCurrentUserS3Options();
				updateState({ userOptions });
				await loadItems('/', userOptions);
			} catch (error) {
				console.error('Failed to initialize file manager:', error);
				toaster.error('Error', 'Failed to initialize file manager');
			}
		};

		initializeFileManager();
	}, []);

	// Use API hook for listing items
	const {
		data: items = [],
		isLoading: isLoadingItems,
		refetch: refetchItems,
	} = useApi<S3Item[], { path: string }>(API_CONFIG.s3Assets.listItems, {
		params: {
			path: state.currentPath,
		},
		enabled: true,
	});

	// Update items when data changes
	useEffect(() => {
		if (items) {
			updateState({ items, isLoading: false });
		}
	}, [items]);

	const loadItems = async (path: string, userOptions?: UserS3Options) => {
		updateState({ currentPath: path, isLoading: true });
		await refetchItems();
	};

	const handleUpload = async (files: File[]) => {
		if (!files || files.length === 0) return;

		updateState({ isLoading: true });

		try {
			// Use API endpoint for upload
			const uploadPromises = files.map(async file => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('path', state.currentPath);

				const response = await fetch('/api/s3/upload', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`Failed to upload ${file.name}`);
				}

				return response.json();
			});

			await Promise.all(uploadPromises);
			await refetchItems();

			toaster.success('Success', `Uploaded ${files.length} file(s)`);
		} catch (error) {
			console.error('Upload failed:', error);
			updateState({ isLoading: false });
			toaster.error('Error', 'Failed to upload files');
		}
	};

	const handleDelete = async (itemKey: string) => {
		if (!confirm('Are you sure you want to delete this item?')) return;

		updateState({ isLoading: true });

		try {
			const response = await fetch('/api/s3/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key: itemKey }),
			});

			if (!response.ok) {
				throw new Error('Failed to delete item');
			}

			await refetchItems();
			toaster.success('Success', 'Item deleted successfully');
		} catch (error) {
			console.error('Delete failed:', error);
			updateState({ isLoading: false });
			toaster.error('Error', 'Failed to delete item');
		}
	};

	const handleCreateFolder = async () => {
		const name = prompt('Enter folder name:');
		if (!name) return;

		updateState({ isLoading: true });

		try {
			const response = await fetch('/api/s3/create-folder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					path: state.currentPath,
					name: name,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to create folder');
			}

			await refetchItems();
			toaster.success('Success', `Folder "${name}" created successfully`);
		} catch (error) {
			console.error('Create folder failed:', error);
			updateState({ isLoading: false });
			toaster.error('Error', 'Failed to create folder');
		}
	};

	const navigateToPath = async (path: string) => {
		await loadItems(path);
	};

	const handleItemClick = async (item: S3Item) => {
		if (item.type === 'folder') {
			await navigateToPath(item.key);
		} else {
			try {
				const response = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(item.key)}`);
				if (!response.ok) {
					throw new Error('Failed to get signed URL');
				}
				const data = await response.json();
				window.open(data.url, '_blank');
			} catch (error) {
				console.error('Failed to get signed URL:', error);
				toaster.error('Error', 'Failed to open file');
			}
		}
	};

	const getFileTypeIcon = (item: S3Item) => {
		if (item.type === 'folder') return <MdFolder size={24} color="#4A90E2" />;

		const ext = item.name.split('.').pop()?.toLowerCase() || '';
		const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
		const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'webm'];
		const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg'];
		const docExts = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt'];

		if (imageExts.includes(ext)) return <MdImage size={24} color="#34D399" />;
		if (videoExts.includes(ext)) return <MdVideoFile size={24} color="#F59E0B" />;
		if (audioExts.includes(ext)) return <MdAudioFile size={24} color="#8B5CF6" />;
		if (docExts.includes(ext)) return <MdDescription size={24} color="#EF4444" />;
		return <MdInsertDriveFile size={24} color="#6B7280" />;
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		updateState({ dragOver: true });
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		updateState({ dragOver: false });
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		updateState({ dragOver: false });
		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			handleUpload(files);
		}
	};

	const filteredItems = state.items.filter(item =>
		item.name.toLowerCase().includes(state.searchTerm.toLowerCase())
	);

	return (
		<div
			ref={dropZoneRef}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`p-6 min-h-screen transition-all ${
				state.dragOver
					? 'bg-blue-50 border-2 border-dashed border-blue-400'
					: 'bg-white border-2 border-transparent'
			}`}
		>
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					Content Assets (User: {state.userOptions?.userId || 'Loading...'})
				</h1>
				<div className="flex gap-2">
					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={e => {
							const files = e.target.files;
							if (files) handleUpload(Array.from(files));
						}}
						className="hidden"
						id="file-upload"
					/>
					<Button
						size="sm"
						onClick={() => document.getElementById('file-upload')?.click()}
						disabled={state.isLoading}
						leftIcon={<MdUpload />}
					>
						Upload
					</Button>
					<Button
						size="sm"
						onClick={handleCreateFolder}
						disabled={state.isLoading}
						variant="secondary"
						leftIcon={<MdCreateNewFolder />}
					>
						New Folder
					</Button>
					<Button
						size="sm"
						onClick={() => loadItems(state.currentPath)}
						disabled={state.isLoading}
						variant="ghost"
					>
						<MdRefresh />
					</Button>
				</div>
			</div>

			{/* Drag and Drop Overlay */}
			{state.dragOver && (
				<div className="fixed inset-0 bg-blue-100 opacity-80 z-[1000] flex items-center justify-center">
					<div className="text-center">
						<MdUpload size={64} color="#3182CE" />
						<p className="text-xl font-bold text-blue-600">Drop files here to upload</p>
					</div>
				</div>
			)}

			{/* Breadcrumb Navigation */}
			<div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-md">
				<Button size="sm" onClick={() => navigateToPath('/')} leftIcon={<MdHome />} />
				{state.currentPath !== '/' && <span className="mx-2 text-gray-400">/</span>}
				{state.currentPath
					.split('/')
					.filter(Boolean)
					.map((part, index, parts) => {
						const path = '/' + parts.slice(0, index + 1).join('/') + '/';
						return (
							<div key={index} className="flex items-center">
								<span className="mx-2 text-gray-400">/</span>
								<Button size="sm" variant="ghost" onClick={() => navigateToPath(path)}>
									{part}
								</Button>
							</div>
						);
					})}
			</div>

			{/* Search */}
			<Input
				placeholder="Search files and folders..."
				value={state.searchTerm}
				onChange={e => updateState({ searchTerm: e.target.value })}
				className="mb-4 max-w-[300px]"
			/>

			{/* Loading State */}
			{state.isLoading && (
				<div className="text-center py-8">
					<p>Loading...</p>
				</div>
			)}

			{/* File Grid */}
			{!state.isLoading && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{filteredItems.map((item, index) => (
							<div
								key={index}
								className="p-4 border-2 border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-pointer relative transition-all"
								onClick={() => handleItemClick(item)}
							>
								<div className="flex items-center mb-2">
									{getFileTypeIcon(item)}
									<span className="font-medium text-sm ml-2 flex-1 truncate">{item.name}</span>
								</div>

								{item.type === 'file' && item.size && (
									<p className="text-xs text-gray-500">{(item.size / 1024).toFixed(1)} KB</p>
								)}

								{/* Delete button */}
								<Button
									className="absolute top-2 right-2"
									size="xs"
									onClick={e => {
										e.stopPropagation();
										handleDelete(item.key);
									}}
									variant="ghost"
								>
									<MdDelete size={14} />
								</Button>
							</div>
						))}
					</div>

					{filteredItems.length === 0 && (
						<div className="text-center py-12">
							<p className="text-gray-500">
								{state.searchTerm ? 'No items match your search' : 'No files or folders found'}
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
