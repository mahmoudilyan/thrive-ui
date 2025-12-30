import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const requestedPath = searchParams.get('path') || '/';

		// Hardcoded user ID for now
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

		console.log('API: Requested path:', requestedPath);
		console.log('API: Actual S3 path:', actualPath);

		// Don't use user prefix in the service since we're handling the path manually
		const userOptions = {};

		const items = await awsS3Service.listItems(actualPath, userOptions);

		// Transform the returned items to show relative paths (remove the user base path)
		const transformedItems = items.map(item => ({
			...item,
			key: item.key.replace(`${userBasePath}/`, '').replace(`${userBasePath}`, '') || item.name,
		}));

		console.log('API: Found items:', transformedItems.length);

		const response = NextResponse.json(transformedItems);

		return response;
	} catch (error) {
		console.error('Error listing S3 items:', error);
		return NextResponse.json({ error: 'Failed to list items' }, { status: 500 });
	}
}
