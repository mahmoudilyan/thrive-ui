import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const path = searchParams.get('path') || '/';

		console.log('API: Listing ALL items for path:', path);

		// List items without any user prefix to see everything in the bucket
		const items = await awsS3Service.listItems(path, { userId: undefined });

		console.log('API: Found items without user prefix:', items.length);

		const response = NextResponse.json(items);

		return response;
	} catch (error) {
		console.error('Error listing all S3 items:', error);
		return NextResponse.json({ error: 'Failed to list items' }, { status: 500 });
	}
}
