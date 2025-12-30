import { NextRequest, NextResponse } from 'next/server';

import { readCachedJson } from '@/lib/mock-cache';
import { parseRequestBody } from '@/lib/request-helpers';

interface CampaignsRequestBody {
	folderid?: string;
}

const CAMPAIGNS_FILES = {
	listView: 'campaigns-list-view.json',
	folderView: 'campaigns-folder-view.json',
	singleFolderView: 'campaigns-single-folder-view.json',
	headers: 'campaigns-load-headers.json',
} as const;

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const loadHeaders = searchParams.get('loadheaders');
	const view = searchParams.get('view');

	if (loadHeaders) {
		const headers = await readCachedJson(CAMPAIGNS_FILES.headers);
		return NextResponse.json(headers);
	}
	if (view === 'folder') {
		const body = await parseRequestBody(request);
		const folderId = body.folderid;

		if (folderId) {
			const singleFolderData = await readCachedJson(CAMPAIGNS_FILES.singleFolderView);
			return NextResponse.json(singleFolderData);
		}

		const folderData = await readCachedJson(CAMPAIGNS_FILES.folderView);
		return NextResponse.json(folderData);
	}

	const listData = await readCachedJson(CAMPAIGNS_FILES.listView);
	return NextResponse.json(listData);
}
