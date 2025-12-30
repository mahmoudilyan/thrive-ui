import { NextRequest, NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';
import { parseRequestBody } from '@/lib/request-helpers';

interface AutomationsRequestBody {
	folderid?: string;
}

const AUTOMATIONS_FILES = {
	listView: 'automations-list-view.json',
	folderView: 'automations-folder-view.json',
	singleFolderView: 'automations-single-folder-view.json',
	headers: 'automations-load-headers.json',
	headersFolderView: 'automations-load-headers-folder.json',
} as const;

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const loadHeaders = searchParams.get('loadheaders');
	const view = searchParams.get('view');

	if (loadHeaders) {
		// Load appropriate headers based on view
		const headersFile =
			view === 'folder' ? AUTOMATIONS_FILES.headersFolderView : AUTOMATIONS_FILES.headers;
		const headers = await readCachedJson(headersFile);
		return NextResponse.json(headers);
	}

	if (view === 'folder') {
		const body = await parseRequestBody(request);
		const folderId = body.folderid;

		if (folderId) {
			const singleFolderData = await readCachedJson(AUTOMATIONS_FILES.singleFolderView);
			return NextResponse.json(singleFolderData);
		}

		const folderData = await readCachedJson(AUTOMATIONS_FILES.folderView);
		return NextResponse.json(folderData);
	}

	const listData = await readCachedJson(AUTOMATIONS_FILES.listView);
	return NextResponse.json(listData);
}
