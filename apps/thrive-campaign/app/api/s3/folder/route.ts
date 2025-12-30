import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function POST(request: NextRequest) {
	try {
		const { path, name } = await request.json();

		if (!name || !name.trim()) {
			return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
		}

		// Temporary user ID
		const userId = '1029';

		// Build user options with session-based user ID
		const userOptions = {
			userId,
		};

		const folderKey = await awsS3Service.createFolder('/public/files/', name.trim(), userOptions);

		const response = NextResponse.json({
			success: true,
			key: folderKey,
			message: `Folder "${name}" created successfully`,
		});

		return response;
	} catch (error) {
		console.error('Error creating folder in S3:', error);
		return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
	}
}
