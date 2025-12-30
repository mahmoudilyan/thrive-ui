import { NextRequest, NextResponse } from 'next/server';
import { awsS3Service } from '@/lib/aws-s3-service';

export async function DELETE(request: NextRequest) {
	try {
		const { key, keys } = await request.json();

		// Get user ID from session (mimicking PHP's session_id())
		const userId = '1029';

		// Build user options with session-based user ID
		const userOptions = {
			userId,
		};

		// Handle single key or multiple keys
		const keysToDelete = key ? [key] : keys;

		if (!keysToDelete || !Array.isArray(keysToDelete) || keysToDelete.length === 0) {
			return NextResponse.json({ error: 'Item key(s) are required' }, { status: 400 });
		}

		// Delete each item
		for (const keyToDelete of keysToDelete) {
			await awsS3Service.deleteItem(keyToDelete, userOptions);
		}

		const response = NextResponse.json({
			success: true,
			message: `Successfully deleted ${keysToDelete.length} item(s)`,
		});

		return response;
	} catch (error) {
		console.error('Error deleting items from S3:', error);
		return NextResponse.json({ error: 'Failed to delete items' }, { status: 500 });
	}
}
