import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;
		const body = await request.json();

		// In a real implementation, save form data to database
		// For now, simulate successful save
		console.log('Saving form builder data for ID:', id, body);

		return NextResponse.json({
			success: true,
			message: 'Form saved successfully',
			id,
		});
	} catch (error) {
		console.error('Error saving form builder data:', error);
		return NextResponse.json({ error: 'Failed to save form data' }, { status: 500 });
	}
}
