import { NextRequest, NextResponse } from 'next/server';
import contactFormFields from '@/mock/contact-form-fields.json';
import contactFormFields2 from '@/mock/contact-form-fields2.json';

/**
 * GET /api/App/Contacts/GetContactFormFields.json
 * 
 * Returns form fields for a specific list ID.
 * This endpoint simulates the backend behavior by returning different
 * field configurations based on the list ID.
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const listId = searchParams.get('listId');

		if (!listId) {
			return NextResponse.json(
				{ error: 'listId parameter is required' },
				{ status: 400 }
			);
		}

		// Simulate different form fields based on list ID
		// In a real implementation, this would query the database
		// based on the list configuration
		let formFieldsData;

		// Use different mock data based on list ID for demonstration
		if (listId === '152042' || listId === '151947' || listId === '150536') {
			// Use the more comprehensive form fields for these lists
			formFieldsData = contactFormFields;
		} else {
			// Use the simpler form fields for other lists
			formFieldsData = contactFormFields2;
		}

		// Transform the mock data to match the expected API response format
		const response = {
			...formFieldsData,
			listId: listId,
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error fetching contact form fields:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
