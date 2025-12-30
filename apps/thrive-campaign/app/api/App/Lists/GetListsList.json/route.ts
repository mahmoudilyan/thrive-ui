import { NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';

export async function GET() {
	const data = await readCachedJson('lists-all.json');
	return NextResponse.json(data);
}

