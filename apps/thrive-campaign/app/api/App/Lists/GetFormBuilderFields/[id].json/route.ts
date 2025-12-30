import { NextRequest, NextResponse } from 'next/server';
import formFields from '@/mock/form-builder/form-fields.json';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;

		// Return available field types for this list
		return NextResponse.json({
			fieldTypes: formFields.fieldTypes,
		});
	} catch (error) {
		console.error('Error fetching form builder fields:', error);
		return NextResponse.json({ error: 'Failed to fetch fields' }, { status: 500 });
	}
}
