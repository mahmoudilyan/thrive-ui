import { NextRequest, NextResponse } from 'next/server';
import defaultFields from '@/mock/form-builder/default-fields.json';

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json(defaultFields);
	} catch (error) {
		console.error('Error fetching default form fields:', error);
		return NextResponse.json({ error: 'Failed to fetch default fields' }, { status: 500 });
	}
}
