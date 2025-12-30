import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const key = searchParams.get('key');

		if (!key) {
			return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
		}

		// Hardcoded user ID for now (matching list API)
		const userId = '1029';
		const userBasePath = `public/files/${userId}`;

		// Convert relative key to absolute S3 key
		// If the key already includes the full path, use it as-is
		// Otherwise, prepend the user base path
		let actualKey: string;
		if (key.startsWith(userBasePath)) {
			actualKey = key;
		} else {
			// Remove leading slash if present and combine with user base path
			const relativeKey = key.replace(/^\/+/, '');
			actualKey = relativeKey ? `${userBasePath}/${relativeKey}` : userBasePath;
		}

		console.log('Signed URL API: Requested key:', key);
		console.log('Signed URL API: Actual S3 key:', actualKey);

		// Use the AWS S3 service to generate signed URL
		const userOptions = {};

		try {
			const url = await awsS3Service.getSignedUrl(actualKey, userOptions);
			console.log('Generated signed URL successfully');

			return NextResponse.json({ url });
		} catch (error) {
			console.error('S3 Service Error:', error);
			throw error;
		}
	} catch (error) {
		console.error('Error generating signed URL:', error);
		return NextResponse.json(
			{
				error: 'Failed to generate signed URL',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { key: relativeKey, expiresIn = 3600 } = await request.json();

		if (!relativeKey) {
			return NextResponse.json({ error: 'Object key is required' }, { status: 400 });
		}

		// Hardcoded user ID for now
		const userId = '1029';
		const userBasePath = `public/files/${userId}`;

		// Convert relative key to absolute S3 key
		const actualKey = relativeKey.startsWith('/')
			? `${userBasePath}${relativeKey}`
			: `${userBasePath}/${relativeKey}`;

		// Don't use user prefix in the service since we're handling the path manually
		const userOptions = {};

		const signedUrl = await awsS3Service.getSignedUrl(actualKey, userOptions, expiresIn);

		const response = NextResponse.json({
			success: true,
			url: signedUrl,
		});

		return response;
	} catch (error) {
		console.error('Error generating signed URL:', error);
		return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
	}
}
