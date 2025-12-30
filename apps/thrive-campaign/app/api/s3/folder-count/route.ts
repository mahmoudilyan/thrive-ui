import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const requestedPath = searchParams.get('path') || '/';

		// Hardcoded user ID for now (matching other endpoints)
		const userId = '1029';
		const userBasePath = `public/files/${userId}`;

		// Convert relative path to absolute S3 path
		let actualPath: string;
		if (requestedPath === '/') {
			actualPath = userBasePath;
		} else {
			// Remove leading slash and combine with user base path
			const relativePath = requestedPath.replace(/^\/+/, '');
			actualPath = `${userBasePath}/${relativePath}`;
		}

		console.log('Folder Count API: Requested path:', requestedPath);
		console.log('Folder Count API: Actual S3 path:', actualPath);

		// Don't use user prefix in the service since we're handling the path manually
		const userOptions = {};

		// Get all items in the current directory
		const items = await awsS3Service.listItems(actualPath, userOptions);

		// Transform the returned items to show relative paths (matching the main list API)
		const transformedItems = items.map(item => ({
			...item,
			key: item.key.replace(`${userBasePath}/`, '').replace(`${userBasePath}`, '') || item.name,
		}));

		console.log(
			'Folder Count API: Found items:',
			transformedItems.length,
			transformedItems.map(i => ({ name: i.name, key: i.key, type: i.type }))
		);

		// Get folder file counts
		const folderCounts: Record<string, number> = {};

		// Get counts for each folder found in the current directory
		for (const item of transformedItems) {
			if (item.type === 'folder') {
				try {
					// Construct the folder path for counting
					// Build the full path from the transformed key
					const folderPath =
						requestedPath === '/'
							? `${userBasePath}/${item.key}`
							: `${userBasePath}/${requestedPath.replace(/^\/+/, '')}/${item.key}`;

					console.log(`Counting files in folder: ${item.name}, path: ${folderPath}`);

					// Get items in this folder
					const folderItems = await awsS3Service.listItems(folderPath, userOptions);

					console.log(
						`Found ${folderItems.length} items in folder ${item.name}:`,
						folderItems.map(fi => `${fi.name} (${fi.type})`)
					);

					// Count only files (not folders)
					const fileCount = folderItems.filter(folderItem => folderItem.type === 'file').length;

					console.log(`File count for ${item.name}: ${fileCount}`);

					// Use the transformed item's key as the identifier
					folderCounts[item.key] = fileCount;
				} catch (error) {
					console.error(`Error counting files in folder ${item.name}:`, error);
					// Set to 0 if we can't count
					folderCounts[item.key] = 0;
				}
			}
		}

		console.log('Folder Count API: Counts calculated:', folderCounts);

		const response = NextResponse.json(folderCounts);
		return response;
	} catch (error) {
		console.error('Error getting folder counts:', error);
		return NextResponse.json({ error: 'Failed to get folder counts' }, { status: 500 });
	}
}
