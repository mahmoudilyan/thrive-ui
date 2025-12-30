'use client';

import { useEffect, useMemo } from 'react';
import {
	MdViewList,
	MdViewModule,
	MdSort,
	MdSearch,
	MdFolder,
	MdDescription,
	MdUpload,
	MdCreateNewFolder,
	MdRefresh,
} from 'react-icons/md';
import { useFileManager } from './file-manager-provider';
import { Button, IconButton, Input, Spinner } from '@thrive/ui';

interface FileManagerViewProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export function FileManagerView({ searchParams }: FileManagerViewProps) {
	const {
		selectedItems,
		viewMode,
		sortBy,
		sortOrder,
		filter,
		filterType,
		isLoading,
		error,
		refreshItems,
		setFilter,
		setFilterType,
		setViewMode,
		setSortBy,
		setSortOrder,
	} = useFileManager();

	// Initialize from search params
	useEffect(() => {
		if (searchParams?.view && typeof searchParams.view === 'string') {
			setViewMode(searchParams.view as 'grid' | 'list' | 'columns');
		}
	}, [searchParams, setViewMode]);

	// Load data initially
	useEffect(() => {
		refreshItems();
	}, [refreshItems]);

	// Use items from store
	const { items } = useFileManager();

	// Filter and sort items
	const filteredAndSortedItems = useMemo(() => {
		let filtered = items;

		// Apply text filter
		if (filter) {
			filtered = filtered.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
		}

		// Apply type filter
		if (filterType !== 'all') {
			filtered = filtered.filter(item => {
				if (filterType === 'folders') {
					return item.type === 'folder';
				}

				if (item.type === 'folder') return false;

				// Simple type checking without strict typing
				if (item.type !== 'file') return false;
				const extension = (item as any).extension?.toLowerCase();
				if (!extension) return false;

				switch (filterType) {
					case 'images':
						return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension);
					case 'videos':
						return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'ogg'].includes(extension);
					case 'documents':
						return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'].includes(
							extension
						);
					case 'audio':
						return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(extension);
					default:
						return true;
				}
			});
		}

		// Sort items
		const sorted = [...filtered].sort((a, b) => {
			// Folders first
			if (a.type === 'folder' && b.type !== 'folder') return -1;
			if (a.type !== 'folder' && b.type === 'folder') return 1;

			let comparison = 0;

			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'date':
					comparison = new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime();
					break;
				case 'size':
					comparison = a.size - b.size;
					break;
				case 'type':
					const aExt = a.type === 'file' ? (a as any).extension || '' : '';
					const bExt = b.type === 'file' ? (b as any).extension || '' : '';
					comparison = aExt.localeCompare(bExt);
					break;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return sorted;
	}, [items, filter, filterType, sortBy, sortOrder]);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div className="flex flex-col gap-4 h-full">
			{/* Simple Toolbar */}
			<div className="flex items-center gap-2 flex-wrap">
				<Button size="sm" leftIcon={<MdUpload />}>
					Upload
				</Button>
				<Button size="sm" variant="secondary" leftIcon={<MdCreateNewFolder />}>
					New Folder
				</Button>
				<IconButton aria-label="Refresh" size="sm" variant="secondary">
					<MdRefresh />
				</IconButton>
			</div>

			{/* Search and View Controls */}
			<div className="flex items-center gap-4 flex-wrap">
				<div className="flex items-center gap-2">
					<MdSearch />
					<Input
						placeholder="Search files..."
						value={filter}
						onChange={e => setFilter(e.target.value)}
						size="sm"
						className="max-w-[300px]"
					/>
				</div>

				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant={filterType === 'all' ? 'primary' : 'secondary'}
						onClick={() => setFilterType('all')}
					>
						All
					</Button>
					<Button
						size="sm"
						variant={filterType === 'folders' ? 'primary' : 'secondary'}
						onClick={() => setFilterType('folders')}
					>
						Folders
					</Button>
					<Button
						size="sm"
						variant={filterType === 'documents' ? 'primary' : 'secondary'}
						onClick={() => setFilterType('documents')}
					>
						Documents
					</Button>
					<Button
						size="sm"
						variant={filterType === 'images' ? 'primary' : 'secondary'}
						onClick={() => setFilterType('images')}
					>
						Images
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm">Sort:</span>
					<Button
						size="sm"
						variant={sortBy === 'name' ? 'primary' : 'secondary'}
						onClick={() => setSortBy('name')}
					>
						Name
					</Button>
					<Button
						size="sm"
						variant={sortBy === 'date' ? 'primary' : 'secondary'}
						onClick={() => setSortBy('date')}
					>
						Date
					</Button>
					<Button
						size="sm"
						variant={sortBy === 'size' ? 'primary' : 'secondary'}
						onClick={() => setSortBy('size')}
					>
						Size
					</Button>
					<IconButton
						aria-label="Sort order"
						onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
						variant={sortOrder === 'desc' ? 'primary' : 'secondary'}
						size="sm"
					>
						<MdSort />
					</IconButton>
				</div>

				<div className="flex items-center gap-2 ml-auto">
					<IconButton
						aria-label="Grid view"
						onClick={() => setViewMode('grid')}
						variant={viewMode === 'grid' ? 'primary' : 'secondary'}
						size="sm"
					>
						<MdViewModule />
					</IconButton>
					<IconButton
						aria-label="List view"
						onClick={() => setViewMode('list')}
						variant={viewMode === 'list' ? 'primary' : 'secondary'}
						size="sm"
					>
						<MdViewList />
					</IconButton>
				</div>
			</div>

			{/* Breadcrumb */}
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600">📁 / Assets</span>
			</div>

			{/* Error Alert */}
			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-red-600">{error}</p>
				</div>
			)}

			{/* Loading State */}
			{isLoading && (
				<div className="flex justify-center items-center h-[200px]">
					<Spinner size="lg" />
				</div>
			)}

			{/* File Content */}
			{!isLoading && (
				<div className="flex-1 overflow-auto">
					{filteredAndSortedItems.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
							<p className="text-lg mb-2">No files found</p>
							<p className="text-sm">
								{filter || filterType !== 'all'
									? 'Try adjusting your filters'
									: 'Upload files or create folders to get started'}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
							{filteredAndSortedItems.map(item => (
								<div
									key={item.id}
									className="p-4 border border-gray-200 rounded-md cursor-pointer text-center transition-all hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 bg-white"
								>
									<div className="flex flex-col items-center gap-2">
										<div className="text-3xl">
											{item.type === 'folder' ? (
												<MdFolder className="text-blue-500" />
											) : (
												<MdDescription className="text-gray-500" />
											)}
										</div>
										<span
											className="text-sm font-medium leading-tight max-w-full break-words line-clamp-2"
											title={item.name}
										>
											{item.name}
										</span>
										{item.type === 'file' && (
											<span className="text-xs text-gray-500">{formatFileSize(item.size)}</span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Status Bar */}
			<div className="p-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
				<p>
					{filteredAndSortedItems.length} item(s)
					{selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
				</p>
			</div>
		</div>
	);
}
