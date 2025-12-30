import {
	S3Client,
	ListObjectsV2Command,
	PutObjectCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	CopyObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3Config {
	bucket: string;
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export interface S3Item {
	name: string;
	type: 'file' | 'folder';
	size?: number;
	lastModified?: Date;
	url?: string;
	key: string;
}

export interface UserS3Options {
	userId?: string;
	folderId?: number;
	userPrefix?: string;
}

// Get S3 configuration from environment variables
const getS3Config = (): S3Config => {
	// Decode base64 encoded credentials (as they come from PHP config)
	const decodeBase64 = (str: string): string => {
		try {
			return Buffer.from(str, 'base64').toString('utf-8');
		} catch (error) {
			// If decoding fails, return the original string (in case it's not base64)
			return str;
		}
	};

	const rawKey = process.env.S3_KEY || '';
	const rawSecret = process.env.S3_SECRET || '';

	return {
		bucket: process.env.S3_BUCKET || '',
		region: process.env.S3_REGION || 'us-east-1',
		accessKeyId: decodeBase64(rawKey),
		secretAccessKey: decodeBase64(rawSecret),
	};
};

export class AwsS3Service {
	private s3Client: S3Client;
	private config: S3Config;

	constructor() {
		this.config = getS3Config();
		console.log(this.config);

		if (!this.config.bucket || !this.config.accessKeyId || !this.config.secretAccessKey) {
			throw new Error('Missing required S3 environment variables: S3_BUCKET, S3_KEY, S3_SECRET');
		}

		this.s3Client = new S3Client({
			region: this.config.region,
			credentials: {
				accessKeyId: this.config.accessKeyId,
				secretAccessKey: this.config.secretAccessKey,
			},
		});
	}

	/**
	 * Generate user-specific prefix for S3 operations
	 * This matches the PHP get_user_path() behavior
	 */
	private getUserPrefix(options?: UserS3Options): string {
		if (!options?.userId) return '';

		// If explicit userPrefix is provided, use it
		if (options.userPrefix) {
			return options.userPrefix.endsWith('/') ? options.userPrefix : options.userPrefix + '/';
		}

		// Use the session ID as the user directory (matching PHP behavior)
		// This creates a user-specific folder structure: {sessionId}/
		return `${options.userId}/`;
	}

	/**
	 * List items in a folder (user-specific)
	 */
	async listItems(path: string = '/', userOptions?: UserS3Options): Promise<S3Item[]> {
		try {
			// Get user-specific prefix
			const userPrefix = this.getUserPrefix(userOptions);

			// Normalize path and combine with user prefix
			const normalizedPath = path === '/' ? '' : path.replace(/^\/+|\/+$/g, '') + '/';
			const prefix = normalizedPath + userPrefix;

			const command = new ListObjectsV2Command({
				Bucket: this.config.bucket,
				Prefix: prefix,
				Delimiter: '/',
			});

			const response = await this.s3Client.send(command);

			const items: S3Item[] = [];

			// Add folders (common prefixes)
			if (response.CommonPrefixes) {
				for (const commonPrefix of response.CommonPrefixes) {
					if (commonPrefix.Prefix && commonPrefix.Prefix !== prefix) {
						const folderName = commonPrefix.Prefix.replace(prefix, '').replace('/', '');
						items.push({
							name: folderName,
							type: 'folder',
							key: commonPrefix.Prefix.replace(userPrefix, ''), // Remove user prefix from key
						});
					}
				}
			}

			// Add files
			if (response.Contents) {
				for (const object of response.Contents) {
					if (object.Key && object.Key !== prefix) {
						const fileName = object.Key.replace(prefix, '');
						// Skip if it's a folder marker or contains slashes (subdirectory)
						if (!fileName.endsWith('/') && !fileName.includes('/')) {
							items.push({
								name: fileName,
								type: 'file',
								size: object.Size || 0,
								lastModified: object.LastModified,
								key: object.Key.replace(userPrefix, ''), // Remove user prefix from key
							});
						}
					}
				}
			}

			return items;
		} catch (error) {
			console.error('Error listing S3 objects:', error);
			throw new Error('Failed to list items from S3');
		}
	}

	/**
	 * Upload a file to S3 (user-specific)
	 */
	async uploadFile(file: File, path: string = '/', userOptions?: UserS3Options): Promise<string> {
		try {
			// Get user-specific prefix
			const userPrefix = this.getUserPrefix(userOptions);

			// Normalize path and combine with user prefix
			const normalizedPath = path === '/' ? '' : path.replace(/^\/+|\/+$/g, '') + '/';
			const key = userPrefix + normalizedPath + file.name;

			// Convert File to Buffer
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const command = new PutObjectCommand({
				Bucket: this.config.bucket,
				Key: key,
				Body: buffer,
				ContentType: file.type || 'application/octet-stream',
			});

			await this.s3Client.send(command);
			return key.replace(userPrefix, ''); // Return key without user prefix
		} catch (error) {
			console.error('Error uploading file to S3:', error);
			throw new Error('Failed to upload file to S3');
		}
	}

	/**
	 * Delete an item from S3 (user-specific)
	 */
	async deleteItem(key: string, userOptions?: UserS3Options): Promise<void> {
		try {
			// Get user-specific prefix and add to key
			const userPrefix = this.getUserPrefix(userOptions);
			const fullKey = userPrefix + key;

			// If it's a folder (ends with /), we need to delete all objects with that prefix
			if (fullKey.endsWith('/')) {
				await this.deleteFolder(fullKey);
			} else {
				const command = new DeleteObjectCommand({
					Bucket: this.config.bucket,
					Key: fullKey,
				});
				await this.s3Client.send(command);
			}
		} catch (error) {
			console.error('Error deleting item from S3:', error);
			throw new Error('Failed to delete item from S3');
		}
	}

	/**
	 * Delete a folder and all its contents
	 */
	private async deleteFolder(folderKey: string): Promise<void> {
		try {
			// List all objects with the folder prefix
			const listCommand = new ListObjectsV2Command({
				Bucket: this.config.bucket,
				Prefix: folderKey,
			});

			const listResponse = await this.s3Client.send(listCommand);

			if (listResponse.Contents && listResponse.Contents.length > 0) {
				// Delete all objects in the folder
				const deleteObjects = listResponse.Contents.map(object => ({ Key: object.Key! }));

				const deleteCommand = new DeleteObjectsCommand({
					Bucket: this.config.bucket,
					Delete: {
						Objects: deleteObjects,
					},
				});

				await this.s3Client.send(deleteCommand);
			}
		} catch (error) {
			console.error('Error deleting folder from S3:', error);
			throw new Error('Failed to delete folder from S3');
		}
	}

	/**
	 * Create a folder (user-specific)
	 */
	async createFolder(path: string, name: string, userOptions?: UserS3Options): Promise<string> {
		try {
			// Get user-specific prefix
			const userPrefix = this.getUserPrefix(userOptions);

			// Normalize path and combine with user prefix
			const normalizedPath = path === '/' ? '' : path.replace(/^\/+|\/+$/g, '') + '/';
			const folderKey = normalizedPath + userPrefix + name + '/';

			// Create an empty object to represent the folder
			const command = new PutObjectCommand({
				Bucket: this.config.bucket,
				Key: folderKey,
				Body: '',
			});

			await this.s3Client.send(command);
			return folderKey.replace(userPrefix, ''); // Return key without user prefix
		} catch (error) {
			console.error('Error creating folder in S3:', error);
			throw new Error('Failed to create folder in S3');
		}
	}

	/**
	 * Get a presigned URL for a file (user-specific)
	 */
	async getSignedUrl(
		key: string,
		userOptions?: UserS3Options,
		expiresIn: number = 3600
	): Promise<string> {
		try {
			// Get user-specific prefix and add to key
			const userPrefix = this.getUserPrefix(userOptions);
			const fullKey = userPrefix + key;

			const command = new GetObjectCommand({
				Bucket: this.config.bucket,
				Key: fullKey,
			});

			const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
			return signedUrl;
		} catch (error) {
			console.error('Error generating signed URL:', error);
			throw new Error('Failed to generate signed URL');
		}
	}

	/**
	 * Get public URL for a file (user-specific)
	 */
	getPublicUrl(key: string, userOptions?: UserS3Options): string {
		const userPrefix = this.getUserPrefix(userOptions);
		const fullKey = userPrefix + key;
		return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${fullKey}`;
	}

	/**
	 * Copy an object within S3 (user-specific)
	 */
	async copyItem(
		sourceKey: string,
		destinationKey: string,
		userOptions?: UserS3Options
	): Promise<void> {
		try {
			const userPrefix = this.getUserPrefix(userOptions);
			const fullSourceKey = userPrefix + sourceKey;
			const fullDestinationKey = userPrefix + destinationKey;

			const command = new CopyObjectCommand({
				Bucket: this.config.bucket,
				CopySource: `${this.config.bucket}/${fullSourceKey}`,
				Key: fullDestinationKey,
			});

			await this.s3Client.send(command);
		} catch (error) {
			console.error('Error copying item in S3:', error);
			throw new Error('Failed to copy item in S3');
		}
	}

	/**
	 * Move an object within S3 (copy then delete)
	 */
	async moveItem(
		sourceKey: string,
		destinationKey: string,
		userOptions?: UserS3Options
	): Promise<void> {
		try {
			await this.copyItem(sourceKey, destinationKey, userOptions);
			await this.deleteItem(sourceKey, userOptions);
		} catch (error) {
			console.error('Error moving item in S3:', error);
			throw new Error('Failed to move item in S3');
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
export const awsS3Service = new AwsS3Service();
