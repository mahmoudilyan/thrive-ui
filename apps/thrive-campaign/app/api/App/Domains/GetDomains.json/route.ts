import { NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';

export async function GET() {
	const data = await readCachedJson('domains.json');
	return NextResponse.json(data);
}
























