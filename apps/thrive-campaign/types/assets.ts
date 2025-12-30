export interface FileItem {
	id: string;
	name: string;
	displayName?: string;
	type: 'file' | 'folder';
	size: number;
	extension?: string;
	mimeType?: string;
	path: string;
	url?: string;
	thumbnailUrl?: string;
	dateModified: Date;
	dateCreated: Date;
	permissions: {
		canRead: boolean;
		canWrite: boolean;
		canDelete: boolean;
		canRename: boolean;
	};
	metadata?: {
		width?: number;
		height?: number;
		duration?: number;
		[key: string]: unknown;
	};
}

export interface FolderItem extends Omit<FileItem, 'type' | 'extension' | 'mimeType'> {
	type: 'folder';
	childCount?: number;
	children?: FileItem[];
}

export type FileManagerItem = FileItem | FolderItem;

export interface FileManagerState {
	currentPath: string;
	items: FileManagerItem[];
	selectedItems: string[];
	viewMode: 'grid' | 'list' | 'columns';
	sortBy: 'name' | 'date' | 'size' | 'type';
	sortOrder: 'asc' | 'desc';
	filter: string;
	filterType: 'all' | 'images' | 'videos' | 'documents' | 'audio' | 'folders';
	isLoading: boolean;
	error?: string;
	clipboard: {
		items: string[];
		operation: 'copy' | 'cut' | null;
	};
}

export interface FileManagerConfig {
	allowUpload: boolean;
	allowDelete: boolean;
	allowRename: boolean;
	allowCreateFolder: boolean;
	allowCopyPaste: boolean;
	maxFileSize: number;
	allowedExtensions: string[];
	disallowedExtensions: string[];
	showHiddenFiles: boolean;
	thumbnailSize: number;
	baseUrl: string;
	uploadUrl: string;
}

export interface FileUploadProgress {
	id: string;
	name: string;
	size: number;
	loaded: number;
	progress: number;
	status: 'pending' | 'uploading' | 'completed' | 'error';
	error?: string;
}

export interface FileManagerActions {
	setCurrentPath: (path: string) => void;
	setItems: (items: FileManagerItem[]) => void;
	setSelectedItems: (items: string[]) => void;
	toggleItemSelection: (itemId: string) => void;
	selectAllItems: () => void;
	clearSelection: () => void;
	setViewMode: (mode: FileManagerState['viewMode']) => void;
	setSortBy: (sortBy: FileManagerState['sortBy']) => void;
	setSortOrder: (order: FileManagerState['sortOrder']) => void;
	setFilter: (filter: string) => void;
	setFilterType: (type: FileManagerState['filterType']) => void;
	setLoading: (loading: boolean) => void;
	setError: (error?: string) => void;
	refreshItems: () => Promise<void>;
	navigateToPath: (path: string) => Promise<void>;
	uploadFiles: (files: File[]) => Promise<void>;
	deleteItems: (itemIds: string[]) => Promise<void>;
	renameItem: (itemId: string, newName: string) => Promise<void>;
	createFolder: (name: string) => Promise<void>;
	copyItems: (itemIds: string[]) => void;
	cutItems: (itemIds: string[]) => void;
	pasteItems: () => Promise<void>;
	clearClipboard: () => void;
}

export type FileManagerContextType = FileManagerState & FileManagerActions;

// File type categories based on extensions
export const FILE_TYPE_CATEGORIES = {
	images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
	videos: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'ogg'],
	audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
	documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'],
	archives: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
	code: ['js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'html', 'json', 'xml', 'php', 'py', 'java'],
} as const;

export type FileTypeCategory = keyof typeof FILE_TYPE_CATEGORIES;
