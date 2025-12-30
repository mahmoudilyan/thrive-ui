import { NextRequest, NextResponse } from 'next/server';
import { readCachedJson } from '@/lib/mock-cache';
import { parseRequestBody } from '@/lib/request-helpers';

interface ListsRequestBody {
	folderid?: string;
}

const LISTS_FILES = {
	listView: 'lists-list-view.json',
	folderView: 'lists-folder-view.json',
	singleFolderView: 'lists-folder-5674.json',
	headers: 'list-load-headers.json',
} as const;

async function handleListsRequest(request: NextRequest, folderId?: string) {
	const { searchParams } = new URL(request.url);
	const loadHeaders = searchParams.get('loadheaders');
	const view = searchParams.get('view');

	// Handle loadheaders request
	if (loadHeaders) {
		const headers = await readCachedJson(LISTS_FILES.headers);
		return NextResponse.json(headers);
	}

	// Handle folder view
	if (view === 'folder') {
		if (folderId) {
			const singleFolderData = await readCachedJson(LISTS_FILES.singleFolderView);
			return NextResponse.json(singleFolderData);
		}

		const folderData = await readCachedJson(LISTS_FILES.folderView);
		return NextResponse.json(folderData);
	}

	// Default to list view
	const listData = await readCachedJson(LISTS_FILES.listView);
	return NextResponse.json(listData);
}

export async function GET(request: NextRequest) {
	return handleListsRequest(request);
}

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	let folderId: string | undefined;

	// Try to get folderId from request body if it's a folder view
	const view = searchParams.get('view');
	if (view === 'folder') {
		const body = await parseRequestBody<ListsRequestBody & { [key: string]: any }>(request);
		folderId = body.folderid;
	}

	return handleListsRequest(request, folderId);
}
