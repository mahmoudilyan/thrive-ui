import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const files = formData.getAll('files') as File[];
		const path = (formData.get('path') as string) || '/';

		// Get user ID from session (mimicking PHP's session_id())
		const userId = '1029';

		// Build user options with session-based user ID
		const userOptions = {
			userId,
		};

		// Handle single file or multiple files
		const filesToUpload = file ? [file] : files;

		if (!filesToUpload || filesToUpload.length === 0) {
			return NextResponse.json({ error: 'No files provided' }, { status: 400 });
		}

		const uploadedKeys: string[] = [];

		for (const fileToUpload of filesToUpload) {
			const key = await awsS3Service.uploadFile(fileToUpload, path, userOptions);
			uploadedKeys.push(key);
		}

		// For single file uploads, return just the key
		if (file) {
			const response = NextResponse.json({
				success: true,
				key: uploadedKeys[0],
			});

			return response;
		}

		// For multiple files, return all keys
		const response = NextResponse.json({
			success: true,
			uploadedKeys,
			message: `Successfully uploaded ${uploadedKeys.length} file(s)`,
		});

		return response;
	} catch (error) {
		console.error('Error uploading files to S3:', error);
		return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
	}
}
