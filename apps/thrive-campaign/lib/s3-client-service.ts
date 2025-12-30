export interface S3Item {
	name: string;
	type: 'file' | 'folder';
	size?: number;
	lastModified?: Date;
	url?: string;
	key: string;
}

export class S3ClientService {
	/**
	 * List items in a folder
	 */
	async listItems(path: string = '/'): Promise<S3Item[]> {
		try {
			const response = await fetch(
				`http://localhost:3011/Dashboard3/api/s3/list?path=${encodeURIComponent(path)}`
			);

			if (!response.ok) {
				throw new Error(`Failed to list items: ${response.statusText}`);
			}

			const data = await response.json();
			return data.items || [];
		} catch (error) {
			console.error('Error listing items:', error);
			throw new Error('Failed to list items');
		}
	}

	/**
	 * Upload files to S3
	 */
	async uploadFiles(files: File[], path: string = '/'): Promise<string[]> {
		try {
			const formData = new FormData();

			files.forEach(file => {
				formData.append('files', file);
			});
			formData.append('path', path);

			const response = await fetch('/api/s3/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Failed to upload files: ${response.statusText}`);
			}

			const data = await response.json();
			return data.uploadedKeys || [];
		} catch (error) {
			console.error('Error uploading files:', error);
			throw new Error('Failed to upload files');
		}
	}

	/**
	 * Create a folder
	 */
	async createFolder(path: string, name: string): Promise<string> {
		try {
			const response = await fetch('/api/s3/folder', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ path, name }),
			});

			if (!response.ok) {
				throw new Error(`Failed to create folder: ${response.statusText}`);
			}

			const data = await response.json();
			return data.folderKey;
		} catch (error) {
			console.error('Error creating folder:', error);
			throw new Error('Failed to create folder');
		}
	}

	/**
	 * Delete items
	 */
	async deleteItems(keys: string[]): Promise<void> {
		try {
			const response = await fetch('/api/s3/delete', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ keys }),
			});

			if (!response.ok) {
				throw new Error(`Failed to delete items: ${response.statusText}`);
			}
		} catch (error) {
			console.error('Error deleting items:', error);
			throw new Error('Failed to delete items');
		}
	}

	/**
	 * Get a signed URL for secure file access
	 */
	async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
		try {
			const response = await fetch('http://localhost:3011/Dashboard3/api/s3/signed-url', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ key, expiresIn }),
			});

			if (!response.ok) {
				throw new Error(`Failed to get signed URL: ${response.statusText}`);
			}

			const data = await response.json();
			return data.signedUrl;
		} catch (error) {
			console.error('Error getting signed URL:', error);
			throw new Error('Failed to get signed URL');
		}
	}

	/**
	 * Format file size for display
	 */
	static formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
}

// Export a singleton instance
export const s3ClientService = new S3ClientService();
