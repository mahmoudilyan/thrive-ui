'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
	FileManagerState,
	FileManagerActions,
	FileManagerItem,
	FileManagerContextType,
} from '@/types/assets';

// Default configuration - exported for use in other components
export const DEFAULT_CONFIG = {
	allowUpload: true,
	allowDelete: true,
	allowRename: true,
	allowCreateFolder: true,
	allowCopyPaste: true,
	maxFileSize: 50 * 1024 * 1024, // 50MB
	allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx', 'txt'],
	disallowedExtensions: ['exe', 'bat', 'cmd'],
	showHiddenFiles: false,
	thumbnailSize: 150,
	baseUrl: '/api/assets',
	uploadUrl: '/api/assets/upload',
};

// Create store with Zustand
const useFileManagerStore = create<FileManagerState & FileManagerActions>()(
	subscribeWithSelector((set, get) => ({
		// Initial state
		currentPath: '/',
		items: [],
		selectedItems: [],
		viewMode: 'grid',
		sortBy: 'name',
		sortOrder: 'asc',
		filter: '',
		filterType: 'all',
		isLoading: false,
		error: undefined,
		clipboard: {
			items: [],
			operation: null,
		},

		// Actions
		setCurrentPath: (path: string) => set({ currentPath: path }),

		setItems: (items: FileManagerItem[]) => set({ items }),

		setSelectedItems: (items: string[]) => set({ selectedItems: items }),

		toggleItemSelection: (itemId: string) => {
			const { selectedItems } = get();
			const isSelected = selectedItems.includes(itemId);

			if (isSelected) {
				set({ selectedItems: selectedItems.filter(id => id !== itemId) });
			} else {
				set({ selectedItems: [...selectedItems, itemId] });
			}
		},

		selectAllItems: () => {
			const { items } = get();
			const allItemIds = items.map(item => item.id);
			set({ selectedItems: allItemIds });
		},

		clearSelection: () => set({ selectedItems: [] }),

		setViewMode: mode => set({ viewMode: mode }),

		setSortBy: sortBy => set({ sortBy }),

		setSortOrder: order => set({ sortOrder: order }),

		setFilter: filter => set({ filter }),

		setFilterType: type => set({ filterType: type }),

		setLoading: loading => set({ isLoading: loading }),

		setError: error => set({ error }),

		// Iframe/S3 Actions - These will be handled by the iframe file manager
		refreshItems: async () => {
			const { setLoading, setError, setItems } = get();
			setLoading(true);
			setError(undefined);

			try {
				// This will be handled by iframe communication or S3 direct access
				// For now, set empty items - the iframe will handle the actual file listing
				setItems([]);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'An error occurred');
				setItems([]);
			} finally {
				setLoading(false);
			}
		},

		navigateToPath: async (path: string) => {
			const { setCurrentPath, refreshItems } = get();
			setCurrentPath(path);
			await refreshItems();
		},

		uploadFiles: async (files: File[]) => {
			const { setLoading, setError } = get();
			setLoading(true);
			setError(undefined);

			try {
				// This will be handled by iframe file manager
				console.log('Upload files to iframe/S3:', files);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Upload failed');
			} finally {
				setLoading(false);
			}
		},

		deleteItems: async (itemIds: string[]) => {
			const { setLoading, setError, clearSelection } = get();
			setLoading(true);
			setError(undefined);

			try {
				// This will be handled by iframe file manager
				console.log('Delete items in iframe/S3:', itemIds);
				clearSelection();
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Delete failed');
			} finally {
				setLoading(false);
			}
		},

		renameItem: async (itemId: string, newName: string) => {
			const { setLoading, setError } = get();
			setLoading(true);
			setError(undefined);

			try {
				// This will be handled by iframe file manager
				console.log('Rename item in iframe/S3:', itemId, newName);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Rename failed');
			} finally {
				setLoading(false);
			}
		},

		createFolder: async (name: string) => {
			const { setLoading, setError } = get();
			setLoading(true);
			setError(undefined);

			try {
				// This will be handled by iframe file manager
				console.log('Create folder in iframe/S3:', name);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Create folder failed');
			} finally {
				setLoading(false);
			}
		},

		copyItems: (itemIds: string[]) => {
			set({
				clipboard: {
					items: itemIds,
					operation: 'copy',
				},
			});
		},

		cutItems: (itemIds: string[]) => {
			set({
				clipboard: {
					items: itemIds,
					operation: 'cut',
				},
			});
		},

		pasteItems: async () => {
			const { clipboard, setLoading, setError, clearClipboard } = get();

			if (!clipboard.operation || clipboard.items.length === 0) return;

			setLoading(true);
			setError(undefined);

			try {
				// This will be handled by iframe file manager
				console.log('Paste items in iframe/S3:', clipboard.items, clipboard.operation);
				clearClipboard();
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Paste failed');
			} finally {
				setLoading(false);
			}
		},

		clearClipboard: () => {
			set({
				clipboard: {
					items: [],
					operation: null,
				},
			});
		},
	}))
);

// Context
const FileManagerContext = createContext<FileManagerContextType | null>(null);

// Provider component
interface FileManagerProviderProps {
	children: ReactNode;
}

export function FileManagerProvider({ children }: FileManagerProviderProps) {
	const store = useFileManagerStore();

	return <FileManagerContext.Provider value={store}>{children}</FileManagerContext.Provider>;
}

// Hook to use the file manager context
export function useFileManager() {
	const context = useContext(FileManagerContext);
	if (!context) {
		throw new Error('useFileManager must be used within a FileManagerProvider');
	}
	return context;
}
