import { NextRequest, NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';

export async function GET(request: NextRequest) {
	try {
		const data = await readCachedJson('contact-fields.json');
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error reading contact fields data:', error);
		return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const data = await readCachedJson('contact-fields.json');
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error reading contact fields data:', error);
		return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
	}
}
