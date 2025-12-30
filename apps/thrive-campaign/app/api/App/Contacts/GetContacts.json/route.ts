import { NextRequest, NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const loadHeaders = searchParams.get('loadheaders');

	try {
		const filePath = loadHeaders ? 'contact-load-headers.json' : 'contacts.json';
		const data = await readCachedJson(filePath);
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error reading contacts data:', error);
		return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
	}
}
