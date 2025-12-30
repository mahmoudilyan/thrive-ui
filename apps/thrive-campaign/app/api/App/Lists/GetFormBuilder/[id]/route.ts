import { NextRequest, NextResponse } from 'next/server';
import formData from '@/mock/form-builder/form-data.json';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;

		// In a real implementation, fetch form data by ID
		// For now, return mock data
		const form = {
			...formData,
			id,
		};

		return NextResponse.json(form);
	} catch (error) {
		console.error('Error fetching form builder data:', error);
		return NextResponse.json({ error: 'Failed to fetch form data' }, { status: 500 });
	}
}
