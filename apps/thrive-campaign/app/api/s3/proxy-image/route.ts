import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const key = searchParams.get('key');

		if (!key) {
			return NextResponse.json({ error: 'Key is required' }, { status: 400 });
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

		console.log('Proxy API: Requested key:', key);
		console.log('Proxy API: Actual S3 key:', actualKey);

		// Get user-specific parameters (not used since we're handling paths manually)
		const userOptions = {};

		// Get signed URL from S3
		const url = await awsS3Service.getSignedUrl(actualKey, userOptions);

		// Fetch the image from S3
		const imageResponse = await fetch(url);

		if (!imageResponse.ok) {
			console.error(
				'Failed to fetch image from S3:',
				imageResponse.status,
				imageResponse.statusText
			);
			throw new Error(`Failed to fetch image from S3: ${imageResponse.status}`);
		}

		// Get the image data
		const imageBuffer = await imageResponse.arrayBuffer();
		const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

		// Return the image with proper headers
		return new NextResponse(imageBuffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
				'Access-Control-Allow-Origin': '*', // Allow all origins (adjust in production)
			},
		});
	} catch (error) {
		console.error('Error proxying image:', error);
		return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
	}
}
