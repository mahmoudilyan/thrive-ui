import { NextRequest, NextResponse } from 'next/server';
import fieldsByList from '@/mock/form-builder/fields-by-list.json';

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json(fieldsByList);
	} catch (error) {
		console.error('Error fetching fields by list:', error);
		return NextResponse.json({ error: 'Failed to fetch fields by list' }, { status: 500 });
	}
}
