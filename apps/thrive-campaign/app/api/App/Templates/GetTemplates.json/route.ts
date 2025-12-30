import { NextRequest, NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';
import { parseRequestBody } from '@/lib/request-helpers';

interface TemplatesRequestBody {
	folderid?: string;
}

const TEMPLATES_FILES = {
	listView: 'templates-list-view.json',
	folderView: 'templates-folder-view.json',
	singleFolderView: 'templates-single-folder-view.json',
	headers: 'templates-headers.json',
	presets: 'templates.json',
} as const;

async function handleTemplatesRequest(request: NextRequest, folderId?: string) {
	const { searchParams } = new URL(request.url);
	const loadHeaders = searchParams.get('loadheaders');
	const view = searchParams.get('view');
	const type = searchParams.get('type');

	// Handle loadheaders request
	if (loadHeaders) {
		const headers = await readCachedJson(TEMPLATES_FILES.headers);
		return NextResponse.json(headers);
	}

	// Handle type-based request (for templates endpoint)
	if (type) {
		const presetsData = (await readCachedJson(TEMPLATES_FILES.presets)) as Record<string, unknown>;

		// Return the specific section based on type
		if (type in presetsData) {
			return NextResponse.json(presetsData[type]);
		}

		// If type doesn't match, return empty array
		return NextResponse.json([]);
	}

	// Handle folder view
	if (view === 'folder') {
		if (folderId) {
			const singleFolderData = await readCachedJson(TEMPLATES_FILES.singleFolderView);
			return NextResponse.json(singleFolderData);
		}

		const folderData = await readCachedJson(TEMPLATES_FILES.folderView);
		return NextResponse.json(folderData);
	}

	// Default to list view
	const listData = await readCachedJson(TEMPLATES_FILES.listView);
	return NextResponse.json(listData);
}

export async function GET(request: NextRequest) {
	return handleTemplatesRequest(request);
}

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	let folderId: string | undefined;

	// Try to get folderId from request body if it's a folder view
	const view = searchParams.get('view');
	if (view === 'folder') {
		const body = await parseRequestBody<TemplatesRequestBody & { [key: string]: any }>(request);
		folderId = body.folderid;
	}

	return handleTemplatesRequest(request, folderId);
}
