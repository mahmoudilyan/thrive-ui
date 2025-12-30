import { NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';

export async function GET() {
	const data = await readCachedJson('all-lists.json');
	return NextResponse.json(data);
}
