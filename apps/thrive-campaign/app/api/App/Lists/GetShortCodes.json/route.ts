import { NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';

export async function GET() {
	const data = await readCachedJson('shortcodes.json');
	return NextResponse.json(data);
}
