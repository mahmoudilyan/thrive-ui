'use client';

import {
	Box,
	Button,
	Flex,
	Input,
	Text,
	Skeleton,
	SkeletonCircle,
	Separator,
	HStack,
	IconButton,
	VStack,
	Group,
	Icon,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FcFolder } from 'react-icons/fc';
import {
	MdArchive,
	MdAudioFile,
	MdClear,
	MdCreateNewFolder,
	MdDelete,
	MdDescription,
	MdFilterList,
	MdFolder,
	MdImage,
	MdInsertDriveFile,
	MdRefresh,
	MdSearch,
	MdSelectAll,
	MdSort,
	MdUpload,
	MdVideoFile,
	MdViewList,
	MdViewModule,
	MdLink,
	MdDownload,
	MdPreview,
	MdEdit,
	MdAssignment,
	MdVisibility,
	MdMoreHoriz,
	MdArrowUpward,
	MdArrowDownward,
	MdCheck,
} from 'react-icons/md';
import { toaster } from '@/components/ui/toaster';
import { useApi, useApiMutation } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import { useInView } from 'react-intersection-observer';

import {
	ActionBarRoot,
	ActionBarContent,
	ActionBarSelectionTrigger,
	ActionBarSeparator,
} from '@/components/ui/action-bar';

import { useCustomDialog } from '@/hooks/use-custom-dialog';
import { FilePreviewDialog } from './file-preview-dialog';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '@/components/ui/breadcrumb';
import {
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
	MenuContextTrigger,
	MenuItemGroup,
} from '../ui/menu';
import { Checkbox } from '../ui/checkbox';
import { DraggableItem, type S3Item, type DragItem } from './draggable-item';
import { InputGroup } from '../ui/input-group';
import { Tooltip } from '../ui/tooltip';

interface UserS3Options {
	userId?: string;
	folderId?: number;
	userPrefix?: string;
}

interface FileManagerState {
	currentPath: string;
	selectedItems: string[];
	searchTerm: string;
	viewMode: 'grid' | 'list';
	sortBy: 'name' | 'size' | 'date' | 'type';
	sortOrder: 'asc' | 'desc';
	filterType: 'all' | 'folders' | 'images' | 'videos' | 'audio' | 'documents' | 'archives';
	uploadProgress: { [fileName: string]: number };
	isUploading: boolean;
	userOptions?: UserS3Options;
}

// Custom hook for S3 operations
const useS3Operations = (userOptions?: UserS3Options) => {
	// Upload mutation
	const uploadMutation = useApiMutation(API_CONFIG.s3Assets.uploadFile);

	// Delete mutation
	const deleteMutation = useApiMutation(API_CONFIG.s3Assets.deleteItem);

	// Create folder mutation
	const createFolderMutation = useApiMutation(API_CONFIG.s3Assets.createFolder);

	// Get signed URL function - now returns a promise-based function
	const getSignedUrl = async (key: string): Promise<string> => {
		// Since useApi is a hook, we need to use fetch directly here
		// or restructure to use the hook at component level
		const searchParams = new URLSearchParams({
			key,
			...(userOptions?.userId && { userId: userOptions.userId }),
			...(userOptions?.folderId && { folderId: userOptions.folderId.toString() }),
			...(userOptions?.userPrefix && { userPrefix: userOptions.userPrefix }),
		});

		const response = await fetch(
			`https://uix.vbout.com/Dashboard3/api/s3/signed-url?${searchParams}`
		);
		if (!response.ok) {
			throw new Error('Failed to get signed URL');
		}

		const result = await response.json();
		console.log('Signed URL response:', result);
		return result.url;
	};

	// Get thumbnail URL function - uses proxy to avoid CORS issues
	const getThumbnailUrl = (key: string): string => {
		const searchParams = new URLSearchParams({
			key,
			...(userOptions?.userId && { userId: userOptions.userId }),
			...(userOptions?.folderId && { folderId: userOptions.folderId.toString() }),
			...(userOptions?.userPrefix && { userPrefix: userOptions.userPrefix }),
		});

		// Use proxy endpoint to avoid CORS issues
		return `/Dashboard3/api/s3?${searchParams}`;
	};

	// Upload file function
	const uploadFile = async (file: File, path: string = '/'): Promise<string> => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('path', path);
		if (userOptions?.userId) formData.append('userId', userOptions.userId);
		if (userOptions?.folderId) formData.append('folderId', userOptions.folderId.toString());
		if (userOptions?.userPrefix) formData.append('userPrefix', userOptions.userPrefix);

		const result = await uploadMutation.mutateAsync(formData);
		return result.key;
	};

	// Delete item function
	const deleteItem = async (key: string): Promise<void> => {
		await deleteMutation.mutateAsync({
			key,
			userId: userOptions?.userId,
			folderId: userOptions?.folderId,
			userPrefix: userOptions?.userPrefix,
		});
	};

	// Create folder function
	const createFolder = async (path: string, name: string): Promise<string> => {
		const result = await createFolderMutation.mutateAsync({
			path,
			name,
			userId: userOptions?.userId,
			folderId: userOptions?.folderId,
			userPrefix: userOptions?.userPrefix,
		});
		return result.key;
	};

	// Format file size utility
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return {
		uploadFile,
		deleteItem,
		createFolder,
		getSignedUrl,
		getThumbnailUrl,
		formatFileSize,
		isUploading: uploadMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isCreatingFolder: createFolderMutation.isPending,
	};
};

export function FileManager() {
	const { openDialog, closeDialog } = useCustomDialog();
	const [state, setState] = useState<FileManagerState>({
		currentPath: '/',
		selectedItems: [],
		searchTerm: '',
		viewMode: 'grid',
		sortBy: 'name',
		sortOrder: 'asc',
		filterType: 'all',
		uploadProgress: {},
		isUploading: false,
		userOptions: {
			// Remove userId to show all files in the bucket without user prefix
			// userId: '1029',
		},
	});
	const [isExternalDragging, setIsExternalDragging] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const { ref: loadMoreRef, inView } = useInView();

	const updateState = (updates: Partial<FileManagerState>) => {
		setState(prev => ({ ...prev, ...updates }));
	};

	// Use the custom S3 operations hook
	const s3Operations = useS3Operations(state.userOptions);

	// Pagination settings
	const ITEMS_PER_PAGE = 20;
	const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);

	// Use regular useApi instead of infinite query
	const {
		data: allItems = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useApi<S3Item[], { path: string }>(API_CONFIG.s3Assets.listItems, {
		params: {
			path: state.currentPath,
		},
		enabled: true,
	});

	// Fetch folder counts for the current path
	const {
		data: folderCounts = {},
		isLoading: isLoadingFolderCounts,
		refetch: refetchFolderCounts,
	} = useApi<Record<string, number>, { path: string }>(API_CONFIG.s3Assets.getFolderCounts, {
		params: {
			path: state.currentPath,
		},
		enabled: true,
	});

	// Get file type category with more detailed categorization
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

	// Filter items based on search and filter type
	const filteredItems = allItems.filter(item => {
		// Apply search filter
		if (state.searchTerm && !item.name.toLowerCase().includes(state.searchTerm.toLowerCase())) {
			return false;
		}

		// Apply type filter
		if (state.filterType !== 'all') {
			switch (state.filterType) {
				case 'folders':
					return item.type === 'folder';
				case 'images':
					return getFileCategory(item) === 'image';
				case 'videos':
					return getFileCategory(item) === 'video';
				case 'audio':
					return getFileCategory(item) === 'audio';
				case 'documents':
					return getFileCategory(item) === 'document';
				case 'archives':
					return getFileCategory(item) === 'archive';
				default:
					return true;
			}
		}

		return true;
	});

	// Load more when scrolling to bottom
	useEffect(() => {
		if (inView && displayedItemsCount < filteredItems.length) {
			setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
		}
	}, [inView, displayedItemsCount, filteredItems.length]);

	// Reset displayed items count when path or filters change
	useEffect(() => {
		setDisplayedItemsCount(ITEMS_PER_PAGE);
	}, [state.currentPath, state.filterType, state.searchTerm]);

	// Handle external file drag over entire file manager
	const handleRootDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer.types.includes('Files')) {
			setIsExternalDragging(true);
		}
	}, []);

	const handleRootDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		// Only set to false if leaving the entire file manager
		if (e.currentTarget === e.target) {
			setIsExternalDragging(false);
		}
	}, []);

	const handleRootDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsExternalDragging(false);

			// If dropped on root (not on a folder), upload to current path
			if (e.target === e.currentTarget) {
				const files = Array.from(e.dataTransfer.files);
				if (files.length > 0) {
					handleUpload(files);
				}
			}
		},
		[state.currentPath]
	);

	// Handle upload with progress using toast
	const handleUpload = async (files: File[]) => {
		if (!files || files.length === 0) return;

		const uploadPromise = async () => {
			updateState({ isUploading: true });

			const uploadPromises = files.map(async file => {
				try {
					await s3Operations.uploadFile(file, state.currentPath);
					return file.name;
				} catch (error) {
					throw error;
				}
			});

			const results = await Promise.all(uploadPromises);
			await refetch();
			await refetchFolderCounts();
			updateState({ isUploading: false });
			return results;
		};

		toaster.promise(uploadPromise(), {
			success: {
				title: 'Successfully uploaded!',
				description: `Uploaded ${files.length} file(s)`,
			},
			error: {
				title: 'Upload failed',
				description: 'Something went wrong with the upload',
			},
			loading: {
				title: 'Uploading...',
				description: `Uploading ${files.length} file(s)`,
			},
		});
	};

	// Handle file input change
	const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			handleUpload(Array.from(files));
		}
	};

	// Handle external file drop on folders
	const handleExternalFileDrop = useCallback(
		async (files: File[], dropTarget: S3Item) => {
			if (dropTarget.type !== 'folder') return;

			// Upload files to the target folder
			const targetPath = dropTarget.key.endsWith('/') ? dropTarget.key : dropTarget.key + '/';

			const uploadPromise = async () => {
				updateState({ isUploading: true });

				const uploadPromises = files.map(async file => {
					try {
						await s3Operations.uploadFile(file, targetPath);
						return file.name;
					} catch (error) {
						throw error;
					}
				});

				const results = await Promise.all(uploadPromises);
				await refetch();
				await refetchFolderCounts();
				updateState({ isUploading: false });
				return results;
			};

			toaster.promise(uploadPromise(), {
				success: {
					title: 'Successfully uploaded!',
					description: `Uploaded ${files.length} file(s) to ${dropTarget.name}`,
				},
				error: {
					title: 'Upload failed',
					description: 'Something went wrong with the upload',
				},
				loading: {
					title: 'Uploading...',
					description: `Uploading ${files.length} file(s) to ${dropTarget.name}`,
				},
			});
		},
		[s3Operations, refetch]
	);

	// Handle folder creation
	const handleCreateFolder = async () => {
		const name = prompt('Enter folder name:');
		if (!name) return;

		try {
			await s3Operations.createFolder(state.currentPath, name);
			await refetch();
			await refetchFolderCounts();

			toaster.create({
				title: 'Folder created',
				description: `Folder "${name}" created successfully`,
				type: 'info',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		} catch (error) {
			console.error('Failed to create folder:', error);
			toaster.create({
				title: 'Error creating folder',
				description: 'Failed to create folder',
				type: 'error',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		}
	};

	// Handle item deletion
	const handleDelete = async (itemKey: string) => {
		if (!confirm('Are you sure you want to delete this item?')) return;

		try {
			await s3Operations.deleteItem(itemKey);
			await refetch();
			await refetchFolderCounts();

			toaster.create({
				title: 'Item deleted',
				description: 'Item deleted successfully',
				type: 'success',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		} catch (error) {
			console.error('Failed to delete item:', error);
			toaster.create({
				title: 'Error deleting item',
				description: 'Failed to delete item',
				type: 'error',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		}
	};

	// Navigation
	const navigateToPath = async (path: string) => {
		console.log('Navigating to path:', path);
		updateState({ currentPath: path, selectedItems: [] });
		setDisplayedItemsCount(ITEMS_PER_PAGE);
	};

	// Get file type icon
	const getFileTypeIcon = (item: S3Item, size: number = 24) => {
		if (item.type === 'folder') return <MdFolder size={size} color="#4A90E2" />;

		const category = getFileCategory(item);
		switch (category) {
			case 'image':
				return <MdImage size={size} color="#34D399" />;
			case 'video':
				return <MdVideoFile size={size} color="#F59E0B" />;
			case 'audio':
				return <MdAudioFile size={size} color="#8B5CF6" />;
			case 'document':
				return <MdDescription size={size} color="#EF4444" />;
			case 'archive':
				return <MdArchive size={size} color="#6B7280" />;
			default:
				return <MdInsertDriveFile size={size} color="#6B7280" />;
		}
	};

	// Filter and sort items
	const getFilteredAndSortedItems = () => {
		const sorted = [...filteredItems];

		// Apply sorting
		sorted.sort((a, b) => {
			let comparison = 0;

			switch (state.sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'size':
					comparison = (a.size || 0) - (b.size || 0);
					break;
				case 'date':
					const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
					const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
					comparison = aDate - bDate;
					break;
				case 'type':
					comparison = getFileCategory(a).localeCompare(getFileCategory(b));
					break;
			}

			return state.sortOrder === 'desc' ? -comparison : comparison;
		});

		// Folders first, unless sorting by type
		if (state.sortBy !== 'type') {
			sorted.sort((a, b) => {
				if (a.type === 'folder' && b.type !== 'folder') return -1;
				if (a.type !== 'folder' && b.type === 'folder') return 1;
				return 0;
			});
		}

		// Return only the items to display
		return sorted.slice(0, displayedItemsCount);
	};

	const handleItemClick = async (item: S3Item) => {
		console.log('Item clicked:', item);
		if (item.type === 'folder') {
			// For folders, ensure we're using the full key
			const folderPath = item.key.endsWith('/') ? item.key : item.key + '/';
			navigateToPath(folderPath);
		} else {
			// Handle file selection or opening
			try {
				const signedUrl = await s3Operations.getSignedUrl(item.key);
				window.open(signedUrl, '_blank');
			} catch (error) {
				console.error('Failed to get signed URL:', error);
				toaster.create({
					title: 'Error opening file',
					description: 'Failed to generate secure URL for file',
					type: 'error',
					meta: {
						closable: true,
						duration: 3000,
					},
				});
			}
		}
	};

	const toggleItemSelection = (itemKey: string) => {
		const isSelected = state.selectedItems.includes(itemKey);
		if (isSelected) {
			updateState({ selectedItems: state.selectedItems.filter(id => id !== itemKey) });
		} else {
			updateState({ selectedItems: [...state.selectedItems, itemKey] });
		}
	};

	const selectAllVisible = () => {
		const visibleItems = getFilteredAndSortedItems();
		updateState({ selectedItems: visibleItems.map(item => item.key) });
	};

	const clearSelection = () => {
		updateState({ selectedItems: [] });
	};

	// Handle drag and drop for items
	const handleItemDrop = async (dragItem: DragItem, dropTarget: S3Item) => {
		// Prevent dropping item into itself
		if (dragItem.key === dropTarget.key) return;

		// Prevent dropping a folder into its own subdirectory
		if (dragItem.type === 'folder' && dropTarget.key.startsWith(dragItem.key)) {
			toaster.create({
				title: 'Invalid operation',
				description: 'Cannot move a folder into itself',
				type: 'error',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
			return;
		}

		try {
			// Extract the item name from the key
			const itemName = dragItem.key.split('/').pop() || dragItem.name;
			// const targetPath = dropTarget.key.endsWith('/') ? dropTarget.key : dropTarget.key + '/';

			// TODO: Implement actual move operation using targetPath
			// For now, just show a message
			toaster.create({
				title: 'Move operation',
				description: `Moving "${itemName}" to "${dropTarget.name}"`,
				type: 'info',
				meta: {
					closable: true,
					duration: 3000,
				},
			});

			// Refresh the list after move
			// await refetch();
		} catch (error) {
			console.error('Failed to move item:', error);
			toaster.create({
				title: 'Error',
				description: 'Failed to move item',
				type: 'error',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		}
	};

	// Truncate text in the middle with ellipsis
	const truncateMiddle = (text: string, maxLength: number = 30) => {
		if (text.length <= maxLength) return text;
		const start = Math.ceil(maxLength / 2) - 2;
		const end = Math.floor(maxLength / 2) - 1;
		return `${text.slice(0, start)}...${text.slice(-end)}`;
	};

	// Handle context menu actions
	const handleCopyUrl = async (item: S3Item) => {
		try {
			const url = await s3Operations.getSignedUrl(item.key);
			await navigator.clipboard.writeText(url);
			toaster.create({
				title: 'URL Copied',
				description: 'The file URL has been copied to clipboard',
				type: 'success',
				meta: {
					closable: true,
					duration: 2000,
				},
			});
		} catch (error) {
			console.error('Failed to copy URL:', error);
			toaster.create({
				title: 'Error',
				description: 'Failed to copy URL',
				type: 'error',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		}
	};

	const handleDownload = async (item: S3Item) => {
		try {
			const url = await s3Operations.getSignedUrl(item.key);
			const link = document.createElement('a');
			link.href = url;
			link.download = item.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Failed to download:', error);
			toaster.create({
				title: 'Error',
				description: 'Failed to download file',
				type: 'error',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		}
	};

	const handlePreview = async (item: S3Item) => {
		if (item.type === 'folder') {
			handleItemClick(item);
		} else {
			try {
				// Start loading state
				let loadingUrl = '';

				// Open dialog immediately with loading state
				openDialog(
					'file-preview',
					{
						content: (
							<FilePreviewDialog
								item={item}
								url={loadingUrl}
								isLoading={true}
								onClose={() => closeDialog()}
								onDownload={handleDownload}
								formatFileSize={s3Operations.formatFileSize}
							/>
						),
					},
					{
						size: 'xl',
						modal: true,
					}
				);

				// Load the URL
				try {
					loadingUrl = await s3Operations.getSignedUrl(item.key);

					// Update dialog with loaded URL
					openDialog(
						'file-preview',
						{
							content: (
								<FilePreviewDialog
									item={item}
									url={loadingUrl}
									isLoading={false}
									onClose={() => closeDialog()}
									onDownload={handleDownload}
									formatFileSize={s3Operations.formatFileSize}
								/>
							),
						},
						{
							size: 'xl',
							modal: true,
						}
					);
				} catch (error) {
					console.error('Failed to preview:', error);
					closeDialog();
					toaster.create({
						title: 'Error',
						description: 'Failed to preview file',
						type: 'error',
						meta: {
							closable: true,
							duration: 3000,
						},
					});
				}
			} catch (error) {
				console.error('Failed to open preview:', error);
			}
		}
	};

	const handleRename = (item: S3Item) => {
		const newName = prompt('Enter new name:', item.name);
		if (newName && newName !== item.name) {
			// TODO: Implement rename functionality
			toaster.create({
				title: 'Not implemented',
				description: 'Rename functionality is not yet implemented',
				type: 'info',
				meta: {
					closable: true,
					duration: 3000,
				},
			});
		}
	};

	const handleCreateGatedForms = (item: S3Item) => {
		// TODO: Implement create gated forms functionality
		toaster.create({
			title: 'Create Gated Forms',
			description: `Creating gated form for ${item.name}`,
			type: 'info',
			meta: {
				closable: true,
				duration: 3000,
			},
		});
	};

	const handleShowGatedForms = (item: S3Item) => {
		// TODO: Implement show gated forms functionality
		toaster.create({
			title: 'Show Gated Forms',
			description: `Showing gated forms for ${item.name}`,
			type: 'info',
			meta: {
				closable: true,
				duration: 3000,
			},
		});
	};

	// Generate breadcrumb items
	const getBreadcrumbItems = () => {
		// Remove leading/trailing slashes and split
		const cleanPath = state.currentPath.replace(/^\/+|\/+$/g, '');
		const pathParts = cleanPath ? cleanPath.split('/') : [];
		const items = [{ name: 'uploads', path: '/' }]; // Show "uploads" as root instead of "Home"

		let currentPath = '';
		pathParts.forEach(part => {
			currentPath += '/' + part;
			items.push({ name: part, path: currentPath });
		});

		console.log('Breadcrumb items:', items);
		return items;
	};

	// Render thumbnail for items
	const renderThumbnail = (item: S3Item) => {
		const category = getFileCategory(item);

		if (item.type === 'folder') {
			return (
				<Box
					position="relative"
					width="100%"
					height="100%"
					overflow="hidden"
					borderRadius="md"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<FcFolder size={60} fill="#4A90E2" />
				</Box>
			);
		}

		// Show actual thumbnail for images
		if (category === 'image') {
			// Use proxy URL for thumbnails to avoid CORS issues
			const thumbnailUrl = `https://uix.vbout.com/Dashboard3/api/s3/proxy-image?key=${encodeURIComponent(item.key)}`;

			return (
				<Box
					position="relative"
					width="100%"
					height="100%"
					overflow="hidden"
					borderRadius="md"
					bgImage={`url("${thumbnailUrl}")`}
					bgSize="contain"
					backgroundPosition="center"
					bgRepeat="no-repeat"
				>
					<Box
						position="absolute"
						top="0"
						left="0"
						width="100%"
						height="100%"
						display="flex"
						alignItems="center"
						justifyContent="center"
						bg="gray.100"
						zIndex={-1}
					>
						<MdImage size={48} color="#34D399" />
					</Box>
				</Box>
			);
		}

		// For videos, show video icon without background
		if (category === 'video') {
			return (
				<Box
					position="relative"
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<MdVideoFile size={48} color="#F59E0B" />
				</Box>
			);
		}

		// For audio files, show audio icon without background
		if (category === 'audio') {
			return (
				<Box
					position="relative"
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<MdAudioFile size={48} color="#8B5CF6" />
				</Box>
			);
		}

		// For documents, show document icon without background
		if (category === 'document') {
			const ext = item.name.split('.').pop()?.toUpperCase() || 'DOC';
			const iconColor = ext === 'PDF' ? '#EF4444' : '#3B82F6';

			return (
				<Box
					position="relative"
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<MdDescription size={48} color={iconColor} />
				</Box>
			);
		}

		// For archives, show archive icon without background
		if (category === 'archive') {
			return (
				<Box
					position="relative"
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<MdArchive size={48} color="#6B7280" />
				</Box>
			);
		}

		// Default for other files
		return (
			<Box
				position="relative"
				width="100%"
				height="100%"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<MdInsertDriveFile size={48} color="#6B7280" />
			</Box>
		);
	};

	// Render thumbnail for list view (smaller size)
	const renderListThumbnail = (item: S3Item) => {
		const category = getFileCategory(item);

		if (item.type === 'folder') {
			return <FcFolder size={32} />;
		}

		// Show actual thumbnail for images
		if (category === 'image') {
			const thumbnailUrl = `https://uix.vbout.com/Dashboard3/api/s3/proxy-image?key=${encodeURIComponent(item.key)}`;

			return (
				<Box
					width="32px"
					height="32px"
					overflow="hidden"
					borderRadius="md"
					bg="gray.100"
					display="flex"
					alignItems="center"
					justifyContent="center"
					position="relative"
				>
					<Box
						position="absolute"
						top="0"
						left="0"
						width="100%"
						height="100%"
						bgImage={`url("${thumbnailUrl}")`}
						bgSize="cover"
						backgroundPosition="center"
						bgRepeat="no-repeat"
						borderRadius="md"
					/>
					{/* Fallback icon */}
					<MdImage size={20} color="#34D399" style={{ zIndex: -1 }} />
				</Box>
			);
		}

		// Return regular file type icons for non-images
		return getFileTypeIcon(item, 32);
	};

	const sortedAndFilteredItems = getFilteredAndSortedItems();
	const hasMore = displayedItemsCount < filteredItems.length;

	if (isError) {
		return (
			<Box p={6} textAlign="center">
				<Text color="red.500">Error loading files: {error?.message}</Text>
				<Button onClick={() => refetch()} mt={4}>
					Retry
				</Button>
			</Box>
		);
	}
	const breadcrumbItems = getBreadcrumbItems();
	return (
		<>
			<Flex justify="space-between" align="center" mb={4}>
				<BreadcrumbRoot separator="/" separatorGap="3">
					{breadcrumbItems.map((item, index) => {
						if (index === 0 && breadcrumbItems.length === 1) {
							return (
								<BreadcrumbCurrentLink key={item.name} onClick={() => navigateToPath(item.path)}>
									All Files
								</BreadcrumbCurrentLink>
							);
						}

						const isLast = index === breadcrumbItems.length - 1;

						if (isLast) {
							return (
								<BreadcrumbCurrentLink key={item.name}>
									{item.name}
									<MenuRoot positioning={{ placement: 'bottom-end' }}>
										<MenuTrigger asChild>
											<IconButton aria-label="More options" variant="ghost" size="xs">
												<MdMoreHoriz />
											</IconButton>
										</MenuTrigger>
										<MenuContent>
											<MenuItem value="delete" />
										</MenuContent>
									</MenuRoot>
								</BreadcrumbCurrentLink>
							);
						}

						return (
							<BreadcrumbLink
								key={item.name}
								asChild
								onClick={() => navigateToPath(item.path)}
								cursor="pointer"
							>
								<Text onClick={() => navigateToPath(item.path)}>
									{item.name === 'uploads' ? 'All Files' : item.name}
								</Text>
							</BreadcrumbLink>
						);
					})}
				</BreadcrumbRoot>

				<HStack gap={2}>
					<InputGroup startElement={<MdSearch color="#666" />}>
						<Input
							placeholder="Search files and folders..."
							value={state.searchTerm}
							onChange={e => updateState({ searchTerm: e.target.value })}
							size="sm"
							maxW="300px"
						/>
					</InputGroup>
					<Button
						size="sm"
						onClick={() => fileInputRef.current?.click()}
						variant="secondary"
						disabled={isLoading || state.isUploading}
					>
						<MdUpload style={{ marginRight: '8px' }} />
						Upload Files
					</Button>
					<Button size="sm" onClick={handleCreateFolder} disabled={isLoading} variant="secondary">
						<MdCreateNewFolder style={{ marginRight: '8px' }} />
						New Folder
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={handleFileInputChange}
						style={{ display: 'none' }}
					/>
				</HStack>
			</Flex>
			<Box
				ref={dropZoneRef}
				//minH="calc(100vh - 100px)"
				onDragOver={handleRootDragOver}
				onDragLeave={handleRootDragLeave}
				onDrop={handleRootDrop}
				//bg={isExternalDragging ? 'blue.50' : 'white'}
				border={isExternalDragging ? '2px dashed' : '2px solid transparent'}
				borderColor={isExternalDragging ? 'blue.400' : 'transparent'}
				transition="all 0.2s"
			>
				{/* External Drag Overlay */}
				{isExternalDragging && (
					<Box
						position="fixed"
						top={0}
						left={0}
						right={0}
						bottom={0}
						bg="blue.100"
						opacity={0.8}
						zIndex={1000}
						display="flex"
						alignItems="center"
						justifyContent="center"
						pointerEvents="none"
					>
						<Box textAlign="center">
							<MdUpload size={64} color="#3182CE" />
							<Text fontSize="xl" fontWeight="bold" color="blue.600">
								Drop files here to upload
							</Text>
							<Text fontSize="md" color="blue.500" mt={2}>
								or drop on a folder to upload there
							</Text>
						</Box>
					</Box>
				)}

				{/* Toolbar */}
				{/* View Mode */}
				<Flex align="center" gap={1} justifyContent="space-between" w="full" mb="2">
					<MenuRoot positioning={{ placement: 'bottom-start' }}>
						<MenuTrigger asChild>
							<Button size="sm" variant="secondary" data-active={state.filterType !== 'all'}>
								<MdFilterList style={{ marginRight: '4px' }} />
								Type:{' '}
								{state.filterType === 'all'
									? 'All Files'
									: state.filterType === 'folders'
										? 'Folders'
										: state.filterType === 'images'
											? 'Images'
											: state.filterType === 'videos'
												? 'Videos'
												: state.filterType === 'audio'
													? 'Audio'
													: state.filterType === 'documents'
														? 'Documents'
														: state.filterType === 'archives'
															? 'Archives'
															: 'All Files'}
							</Button>
						</MenuTrigger>
						<MenuContent>
							<MenuItem value="all" onClick={() => updateState({ filterType: 'all' })}>
								<MdInsertDriveFile style={{ marginRight: '8px' }} />
								All Files
							</MenuItem>
							<MenuItem value="folders" onClick={() => updateState({ filterType: 'folders' })}>
								<MdFolder style={{ marginRight: '8px' }} />
								Folders
							</MenuItem>
							<Separator />
							<MenuItem value="images" onClick={() => updateState({ filterType: 'images' })}>
								<MdImage style={{ marginRight: '8px' }} />
								Images
							</MenuItem>
							<MenuItem value="videos" onClick={() => updateState({ filterType: 'videos' })}>
								<MdVideoFile style={{ marginRight: '8px' }} />
								Videos
							</MenuItem>
							<MenuItem value="audio" onClick={() => updateState({ filterType: 'audio' })}>
								<MdAudioFile style={{ marginRight: '8px' }} />
								Audio
							</MenuItem>
							<MenuItem value="documents" onClick={() => updateState({ filterType: 'documents' })}>
								<MdDescription style={{ marginRight: '8px' }} />
								Documents
							</MenuItem>
							<MenuItem value="archives" onClick={() => updateState({ filterType: 'archives' })}>
								<MdArchive style={{ marginRight: '8px' }} />
								Archives
							</MenuItem>
						</MenuContent>
					</MenuRoot>
					<Group attached>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => updateState({ viewMode: 'grid' })}
							data-active={state.viewMode === 'grid'}
							id="grid-view-button"
						>
							<Tooltip content="Grid View" positioning={{ placement: 'top-start' }}>
								<MdViewModule />
							</Tooltip>
						</Button>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => updateState({ viewMode: 'list' })}
							data-active={state.viewMode === 'list'}
							id="list-view-button"
						>
							<Tooltip content="List View" positioning={{ placement: 'top-start' }}>
								<MdViewList />
							</Tooltip>
						</Button>
					</Group>
				</Flex>
				{state.viewMode === 'grid' && (
					<Box w="full" display="flex" justifyContent="flex-start" mb="2" mt="2">
						<MenuRoot>
							<MenuTrigger asChild>
								<Button size="sm" variant="ghost" textTransform="capitalize">
									{state.sortBy}
									{state.sortOrder === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />}
								</Button>
							</MenuTrigger>
							<MenuContent>
								<MenuItemGroup title="Sort by">
									<MenuItem value="name" onClick={() => updateState({ sortBy: 'name' })}>
										Name
										{state.sortBy === 'name' && <Icon as={MdCheck} />}
									</MenuItem>
									<MenuItem value="type" onClick={() => updateState({ sortBy: 'date' })}>
										Modification Date
										{state.sortBy === 'date' && <Icon as={MdCheck} />}
									</MenuItem>
									<MenuItem value="date" onClick={() => updateState({ sortBy: 'size' })}>
										Size
										{state.sortBy === 'size' && <Icon as={MdCheck} />}
									</MenuItem>
								</MenuItemGroup>
								<MenuItemGroup title="Sort order">
									<MenuItem value="asc" onClick={() => updateState({ sortOrder: 'asc' })}>
										Ascending
										{state.sortOrder === 'asc' && <Icon as={MdCheck} />}
									</MenuItem>
									<MenuItem value="desc" onClick={() => updateState({ sortOrder: 'desc' })}>
										Descending
										{state.sortOrder === 'desc' && <Icon as={MdCheck} />}
									</MenuItem>
								</MenuItemGroup>
							</MenuContent>
						</MenuRoot>
					</Box>
				)}

				{/* Selection Actions */}
				{state.selectedItems.length > 0 && (
					<ActionBarRoot open={state.selectedItems.length > 0}>
						<ActionBarContent>
							<ActionBarSelectionTrigger>
								{state.selectedItems.length}
								<Text textTransform="capitalize">
									{state.selectedItems.length === 1 ? 'item' : 'items'} selected
								</Text>
							</ActionBarSelectionTrigger>
							<ActionBarSeparator />

							<Button
								variant="outline"
								colorPalette="red"
								size="sm"
								onClick={async () => {
									if (
										!confirm(
											`Are you sure you want to delete ${state.selectedItems.length} item(s)?`
										)
									)
										return;

									try {
										await Promise.all(
											state.selectedItems.map(itemKey => s3Operations.deleteItem(itemKey))
										);
										await refetch();
										await refetchFolderCounts();
										updateState({ selectedItems: [] });

										toaster.create({
											title: 'Items deleted',
											description: `Successfully deleted ${state.selectedItems.length} item(s)`,
											type: 'success',
											meta: {
												closable: true,
												duration: 3000,
											},
										});
									} catch (error) {
										console.error('Failed to delete items:', error);
										toaster.create({
											title: 'Error deleting items',
											description: 'Failed to delete selected items',
											type: 'error',
											meta: {
												closable: true,
												duration: 3000,
											},
										});
									}
								}}
							>
								<MdDelete />
								Delete {state.selectedItems.length}{' '}
								{state.selectedItems.length === 1 ? 'item' : 'items'}
							</Button>
							<Button size="sm" onClick={clearSelection} variant="secondary">
								<MdClear style={{ marginRight: '4px' }} />
								Clear Selection
							</Button>
						</ActionBarContent>
					</ActionBarRoot>
				)}

				{/* File Grid/List */}

				<Box
					maxH="calc(100vh - 240px)"
					overflowY="auto"
					bg="bg.panel"
					w="calc(100% + 64px)"
					ml="-32px"
				>
					{state.viewMode === 'grid' ? (
						<Flex wrap="wrap" gap={4} p={8}>
							{isLoading && sortedAndFilteredItems.length === 0 ? (
								// Loading skeletons
								Array.from({ length: 8 }).map((_, index) => (
									<Box
										key={index}
										p={4}
										border="2px solid"
										borderColor="gray.200"
										borderRadius="md"
										height="200px"
									>
										<Flex direction="column" align="center" gap={2}>
											<Skeleton height="120px" width="100%" borderRadius="md" />
											<Skeleton height="20px" width="80%" />
											<Skeleton height="16px" width="60%" />
										</Flex>
									</Box>
								))
							) : (
								<>
									{sortedAndFilteredItems.map(item => {
										const isSelected = state.selectedItems.includes(item.key);
										return (
											<React.Fragment key={item.key}>
												<MenuRoot closeOnSelect={false}>
													<MenuContextTrigger asChild>
														<DraggableItem
															item={item}
															onDrop={handleItemDrop}
															onExternalFileDrop={handleExternalFileDrop}
														>
															<Box position="relative" w="full" h="full">
																<VStack
																	w="full"
																	h="full"
																	p={2}
																	gap={2}
																	border="2px solid"
																	borderColor={isSelected ? 'blue.400' : 'transparent'}
																	borderRadius="md"
																	_hover={{ bg: 'bg' }}
																	cursor="grab"
																	_active={{ cursor: 'grabbing' }}
																	onClick={e => {
																		// Don't handle click if dragging
																		if (e.defaultPrevented) return;

																		if (e.metaKey || e.ctrlKey) {
																			toggleItemSelection(item.key);
																		} else {
																			handleItemClick(item);
																		}
																	}}
																>
																	{/* Thumbnail */}
																	<Box
																		flex="1"
																		display="flex"
																		alignItems="center"
																		justifyContent="center"
																		w="100%"
																		h="100%"
																		border="1px solid"
																		borderColor="border.muted"
																		borderRadius="sm"
																		p={2}
																	>
																		{renderThumbnail(item)}
																	</Box>

																	{/* File/Folder info */}
																	<VStack align="center" gap={0} w="full" px={2}>
																		<Text
																			fontSize="sm"
																			fontWeight="medium"
																			textAlign="center"
																			lineClamp={1}
																			w="full"
																		>
																			{item.name}
																		</Text>
																		{item.type === 'folder' && (
																			<Text fontSize="xs" color="gray.500">
																				{folderCounts[item.key] !== undefined
																					? `${folderCounts[item.key]} file${folderCounts[item.key] !== 1 ? 's' : ''}`
																					: isLoadingFolderCounts
																						? '...'
																						: '0 files'}
																			</Text>
																		)}
																		{item.type === 'file' && item.size && (
																			<Text fontSize="xs" color="gray.500">
																				{s3Operations.formatFileSize(item.size)}
																			</Text>
																		)}
																	</VStack>
																</VStack>

																{/* Action buttons */}
																<Flex
																	position="absolute"
																	top={2}
																	left={0}
																	width="100%"
																	gap={1}
																	onClick={e => e.stopPropagation()}
																	display="none"
																	_groupHover={{ display: 'flex' }}
																	justifyContent="space-between"
																>
																	<Box>
																		<Checkbox
																			size="sm"
																			onChange={() => toggleItemSelection(item.key)}
																			checked={isSelected}
																			ml="2"
																		/>
																	</Box>
																	<Box>
																		{/* <Button
																		size="xs"
																		onClick={() => handleDelete(item.key)}
																		colorScheme="red"
																		variant="ghost"
																		mr="2"
																	>
																		<MdDelete size={14} />
																	</Button> */}
																	</Box>
																</Flex>
															</Box>
														</DraggableItem>
													</MenuContextTrigger>

													<MenuContent minW="240px">
														{/* File/Folder name */}
														<MenuItem value="file-name" disabled>
															<Text fontSize="sm" fontWeight="medium" color="gray.700">
																{truncateMiddle(item.name, 25)}
															</Text>
														</MenuItem>

														{item.type === 'folder' ? (
															<>
																{/* Folder-specific menu */}
																<MenuItem value="rename" onClick={() => handleRename(item)}>
																	<MdEdit />
																	Rename
																</MenuItem>
																<MenuItem
																	value="delete"
																	onClick={() => handleDelete(item.key)}
																	color="red.500"
																>
																	<MdDelete />
																	Delete
																</MenuItem>

																<Separator />

																<MenuItem value="last-edited" disabled>
																	<Text fontSize="xs" color="gray.500">
																		Last Edited:{' '}
																		{item.lastModified
																			? new Date(item.lastModified).toLocaleDateString()
																			: 'Unknown'}
																	</Text>
																</MenuItem>
															</>
														) : (
															<>
																{/* File-specific menu */}
																<MenuItem value="copy-url" onClick={() => handleCopyUrl(item)}>
																	<MdLink />
																	Copy URL
																</MenuItem>
																<MenuItem value="download" onClick={() => handleDownload(item)}>
																	<MdDownload />
																	Download
																</MenuItem>
																<MenuItem value="preview" onClick={() => handlePreview(item)}>
																	<MdPreview />
																	Preview
																</MenuItem>

																<Separator />

																<MenuItem
																	value="create-gated"
																	onClick={() => handleCreateGatedForms(item)}
																>
																	<MdAssignment />
																	Create Gated Forms
																</MenuItem>
																<MenuItem
																	value="show-gated"
																	onClick={() => handleShowGatedForms(item)}
																>
																	<MdVisibility />
																	Show Gated Forms
																</MenuItem>

																<Separator />

																<MenuItem value="rename" onClick={() => handleRename(item)}>
																	<MdEdit />
																	Rename
																</MenuItem>
																<MenuItem
																	value="delete"
																	onClick={() => handleDelete(item.key)}
																	color="red.500"
																>
																	<MdDelete />
																	Delete
																</MenuItem>

																<Separator />

																{/* File info */}
																<MenuItem value="last-edited" disabled>
																	<Text fontSize="xs" color="gray.500">
																		Last Edited:{' '}
																		{item.lastModified
																			? new Date(item.lastModified).toLocaleDateString()
																			: 'Unknown'}
																	</Text>
																</MenuItem>
																{item.size && (
																	<MenuItem value="size" disabled>
																		<Text fontSize="xs" color="gray.500">
																			Size: {s3Operations.formatFileSize(item.size)}
																		</Text>
																	</MenuItem>
																)}
															</>
														)}
													</MenuContent>
												</MenuRoot>
											</React.Fragment>
										);
									})}
									{/* Loading more indicator */}
									{hasMore && (
										<Box ref={loadMoreRef} p={4} textAlign="center">
											<Skeleton height="120px" width="100%" borderRadius="md" />
											<Skeleton height="20px" width="80%" mt={2} mx="auto" />
										</Box>
									)}
								</>
							)}
						</Flex>
					) : (
						// List view - Table format
						<Box>
							{/* Table Header */}
							<Flex
								p={4}
								borderBottom="1px solid"
								borderColor="gray.200"
								bg="gray.50"
								fontWeight="medium"
								fontSize="sm"
								color="gray.600"
								position="sticky"
								top="0"
								zIndex="1"
								//backgroundColor="white"
							>
								<Button
									variant="ghost"
									size="sm"
									flex="1"
									minW="0"
									justifyContent="flex-start"
									fontWeight="medium"
									fontSize="sm"
									color="gray.600"
									onClick={() =>
										updateState({
											sortBy: 'name',
											sortOrder:
												state.sortBy === 'name' && state.sortOrder === 'asc' ? 'desc' : 'asc',
										})
									}
								>
									NAME
									{state.sortBy === 'name' &&
										(state.sortOrder === 'asc' ? (
											<MdArrowUpward size={14} style={{ marginLeft: '4px' }} />
										) : (
											<MdArrowDownward size={14} style={{ marginLeft: '4px' }} />
										))}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									w="120px"
									justifyContent="flex-start"
									fontWeight="medium"
									fontSize="sm"
									color="gray.600"
									onClick={() =>
										updateState({
											sortBy: 'type',
											sortOrder:
												state.sortBy === 'type' && state.sortOrder === 'asc' ? 'desc' : 'asc',
										})
									}
								>
									TYPE
									{state.sortBy === 'type' &&
										(state.sortOrder === 'asc' ? (
											<MdArrowUpward size={14} style={{ marginLeft: '4px' }} />
										) : (
											<MdArrowDownward size={14} style={{ marginLeft: '4px' }} />
										))}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									w="160px"
									justifyContent="flex-start"
									fontWeight="medium"
									fontSize="sm"
									color="gray.600"
									onClick={() =>
										updateState({
											sortBy: 'date',
											sortOrder:
												state.sortBy === 'date' && state.sortOrder === 'asc' ? 'desc' : 'asc',
										})
									}
								>
									UPDATED
									{state.sortBy === 'date' &&
										(state.sortOrder === 'asc' ? (
											<MdArrowUpward size={14} style={{ marginLeft: '4px' }} />
										) : (
											<MdArrowDownward size={14} style={{ marginLeft: '4px' }} />
										))}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									w="100px"
									justifyContent="flex-end"
									fontWeight="medium"
									fontSize="sm"
									color="gray.600"
									onClick={() =>
										updateState({
											sortBy: 'size',
											sortOrder:
												state.sortBy === 'size' && state.sortOrder === 'asc' ? 'desc' : 'asc',
										})
									}
								>
									SIZE
									{state.sortBy === 'size' &&
										(state.sortOrder === 'asc' ? (
											<MdArrowUpward size={14} style={{ marginLeft: '4px' }} />
										) : (
											<MdArrowDownward size={14} style={{ marginLeft: '4px' }} />
										))}
								</Button>
							</Flex>

							{isLoading && sortedAndFilteredItems.length === 0 ? (
								// Loading skeletons for list view
								Array.from({ length: 10 }).map((_, index) => (
									<Flex
										key={index}
										p={4}
										borderBottom="1px solid"
										borderColor="gray.100"
										align="center"
										gap={3}
									>
										<SkeletonCircle size="40px" />
										<Skeleton height="20px" flex={1} />
										<Skeleton height="16px" width="100px" />
										<Skeleton height="16px" width="140px" />
										<Skeleton height="16px" width="80px" />
									</Flex>
								))
							) : (
								<>
									{sortedAndFilteredItems.map(item => {
										const isSelected = state.selectedItems.includes(item.key);

										// Format date
										const formatDate = (date: Date | undefined) => {
											if (!date) return 'Unknown';
											const d = new Date(date);
											const today = new Date();
											const yesterday = new Date(today);
											yesterday.setDate(yesterday.getDate() - 1);

											if (d.toDateString() === today.toDateString()) {
												return `Today by M`;
											} else if (d.toDateString() === yesterday.toDateString()) {
												return `Yesterday by M`;
											} else {
												return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by M`;
											}
										};

										return (
											<MenuRoot key={item.key} closeOnSelect={false}>
												<MenuContextTrigger asChild>
													<Flex
														p={4}
														borderBottom="1px solid"
														borderColor="gray.100"
														_hover={{ bg: 'gray.50' }}
														cursor="pointer"
														align="center"
														bg={isSelected ? 'blue.50' : 'transparent'}
														onClick={e => {
															if (e.metaKey || e.ctrlKey) {
																toggleItemSelection(item.key);
															} else {
																handleItemClick(item);
															}
														}}
													>
														{/* Icon and Name */}
														<Flex align="center" gap={3} flex="1" minW="0">
															{item.type === 'folder' ? (
																<FcFolder size={24} />
															) : (
																renderListThumbnail(item)
															)}
															<Text fontWeight="medium" truncate>
																{item.name}
															</Text>
														</Flex>

														{/* Type */}
														<Text fontSize="sm" color="gray.500" w="120px" textAlign="left">
															{item.type === 'folder'
																? 'Folder'
																: getFileCategory(item) === 'image'
																	? 'Image'
																	: getFileCategory(item) === 'video'
																		? 'Video'
																		: getFileCategory(item) === 'audio'
																			? 'Audio'
																			: getFileCategory(item) === 'document'
																				? 'Document'
																				: getFileCategory(item) === 'archive'
																					? 'Archive'
																					: 'File'}
														</Text>

														{/* Updated Date */}
														<Text fontSize="sm" color="gray.500" w="160px" textAlign="left">
															{formatDate(item.lastModified)}
														</Text>

														{/* Size */}
														<Text fontSize="sm" color="gray.500" w="100px" textAlign="right">
															{item.type === 'folder'
																? folderCounts[item.key] !== undefined
																	? `${folderCounts[item.key]} File${folderCounts[item.key] !== 1 ? 's' : ''}`
																	: isLoadingFolderCounts
																		? '...'
																		: '0 Files'
																: item.size
																	? s3Operations.formatFileSize(item.size)
																	: '0 B'}
														</Text>
													</Flex>
												</MenuContextTrigger>

												<MenuContent minW="240px">
													{/* File/Folder name */}
													<MenuItem value="file-name" disabled>
														<Text fontSize="sm" fontWeight="medium" color="gray.700">
															{truncateMiddle(item.name, 25)}
														</Text>
													</MenuItem>

													{item.type === 'folder' ? (
														<>
															{/* Folder-specific menu */}
															<MenuItem value="rename" onClick={() => handleRename(item)}>
																<MdEdit />
																Rename
															</MenuItem>
															<MenuItem
																value="delete"
																onClick={() => handleDelete(item.key)}
																color="red.500"
															>
																<MdDelete />
																Delete
															</MenuItem>

															<Separator />

															<MenuItem value="last-edited" disabled>
																<Text fontSize="xs" color="gray.500">
																	Last Edited:{' '}
																	{item.lastModified
																		? new Date(item.lastModified).toLocaleDateString()
																		: 'Unknown'}
																</Text>
															</MenuItem>
														</>
													) : (
														<>
															{/* File-specific menu */}
															<MenuItem value="copy-url" onClick={() => handleCopyUrl(item)}>
																<MdLink />
																Copy URL
															</MenuItem>
															<MenuItem value="download" onClick={() => handleDownload(item)}>
																<MdDownload />
																Download
															</MenuItem>
															<MenuItem value="preview" onClick={() => handlePreview(item)}>
																<MdPreview />
																Preview
															</MenuItem>

															<Separator />

															<MenuItem
																value="create-gated"
																onClick={() => handleCreateGatedForms(item)}
															>
																<MdAssignment />
																Create Gated Forms
															</MenuItem>
															<MenuItem
																value="show-gated"
																onClick={() => handleShowGatedForms(item)}
															>
																<MdVisibility />
																Show Gated Forms
															</MenuItem>

															<Separator />

															<MenuItem value="rename" onClick={() => handleRename(item)}>
																<MdEdit />
																Rename
															</MenuItem>
															<MenuItem
																value="delete"
																onClick={() => handleDelete(item.key)}
																color="red.500"
															>
																<MdDelete />
																Delete
															</MenuItem>

															<Separator />

															{/* File info */}
															<MenuItem value="last-edited" disabled>
																<Text fontSize="xs" color="gray.500">
																	Last Edited:{' '}
																	{item.lastModified
																		? new Date(item.lastModified).toLocaleDateString()
																		: 'Unknown'}
																</Text>
															</MenuItem>
															{item.size && (
																<MenuItem value="size" disabled>
																	<Text fontSize="xs" color="gray.500">
																		Size: {s3Operations.formatFileSize(item.size)}
																	</Text>
																</MenuItem>
															)}
														</>
													)}
												</MenuContent>
											</MenuRoot>
										);
									})}
									{/* Loading more indicator */}
									{hasMore && (
										<Flex ref={loadMoreRef} p={4} borderBottom="1px solid" borderColor="gray.100">
											<Skeleton height="20px" width="200px" />
										</Flex>
									)}
								</>
							)}
						</Box>
					)}

					{sortedAndFilteredItems.length === 0 && !isLoading && (
						<Box textAlign="center" py={12}>
							<Text color="gray.500">
								{state.searchTerm || state.filterType !== 'all'
									? 'No items match your criteria'
									: 'No files or folders found'}
							</Text>
						</Box>
					)}
				</Box>
			</Box>
		</>
	);
}
