import { API_CONFIG } from '@/services/config/api';
import {
	ActionItem,
	ActionsList,
	ActionsStructure,
	Callbacks,
	TransformedAction,
	TransformedActions,
} from '@/types/table';

const COLOR_PALETTES = [
	'normal',
	'blue',
	'red',
	'yellow',
	'orange',
	'purple',
	'pink',
	'green',
	'indigo',
	'teal',
];

type ColorPalette =
	| 'normal'
	| 'blue'
	| 'red'
	| 'yellow'
	| 'orange'
	| 'purple'
	| 'pink'
	| 'green'
	| 'indigo'
	| 'teal';
export function randomPalette(): ColorPalette {
	const randomIndex = Math.floor(Math.random() * COLOR_PALETTES.length);
	return COLOR_PALETTES[randomIndex] as ColorPalette;
}

export function transformActions(
	headersActions: ActionsStructure | ActionsList | null,
	rowActions: ActionsStructure | ActionsList | null,
	row: any,
	callbacks: Callbacks,
	pathName: string,
	moduleType: string
): TransformedActions {
	const { openDialog, navigate } = callbacks;

	// Handle folder-type rows as special case
	if (row.rowtype === 'folder') {
		return handleFolderActions(
			rowActions as ActionsStructure,
			row,
			{ openDialog, navigate },
			pathName
		);
	}

	// Normalize input actions
	const normalizedHeaders = normalizeActions(headersActions);
	const normalizedRow = normalizeActions(rowActions);
	// Merge actions
	const merged = mergeActions(normalizedHeaders, normalizedRow);
	// Create action handlers
	const actionHandlers = createActionHandlers(row, callbacks, moduleType);

	// Transform merged actions
	return {
		master: createMasterAction(merged.master, actionHandlers, navigate),
		list: createActionList(merged.list, actionHandlers),
	};
}

// Helper functions
function normalizeActions(actions: ActionsStructure | ActionsList | null): {
	master: ActionItem | null;
	list: ActionsList;
} {
	if (!actions) return { master: null, list: {} };
	if ('master' in actions || 'list' in actions) {
		return {
			master: (actions as ActionsStructure).master || null,
			list: (actions as ActionsStructure).list || {},
		};
	}

	return { master: null, list: actions as ActionsList };
}

function mergeActions(
	headers: ReturnType<typeof normalizeActions>,
	row: ReturnType<typeof normalizeActions>
) {
	// Deep merge for list items
	const mergedList = { ...headers.list };

	// Iterate through row list items and merge them properly with header items
	if (row.list) {
		Object.entries(row.list).forEach(([key, rowValue]) => {
			if (typeof rowValue === 'object' && mergedList[key] && typeof mergedList[key] === 'object') {
				// If the key exists in both and both are objects, merge their properties
				mergedList[key] = {
					...mergedList[key],
					...rowValue,
				};
			} else {
				// Otherwise just use the row value (overwrite or add new)
				mergedList[key] = rowValue;
			}
		});
	}

	return {
		master: row.master || headers.master,
		list: mergedList,
	};
}

function createActionHandlers(row: any, { openDialog, navigate }: Callbacks, type: string) {
	return {
		// Common Actions
		actionMoveFromFolder: () => openDialog('moveFromFolder', { id: row.id }),
		actionAddToFolder: () =>
			openDialog('addToFolder', {
				id: row.id,
				type: type,
			}),
		actionAttachToCampaignAssets: () =>
			openDialog('attachToCampaignAsset', { id: row.id, assetType: type }),

		// Goal actions
		actionGoalStats: () => navigate(`/analytics/goal/${row.id}`),
		actionEditGoal: () => openDialog('editGoal', { id: row.id }),
		actionDeleteGoal: () =>
			openDialog('deleteModule', {
				type: 'Goal',
				module: 'Goal',
				apiConfig: API_CONFIG.goals.deleteGoal,
				body: { id: row.id },
			}),
		actionCreateTaskWithGoal: () =>
			openDialog('createTaskWithGoal', {
				assetsIds: row.id,
				assetType: 6,
			}),
		// List actions
		actionDeleteList: () =>
			openDialog('deleteModule', {
				type: 'List',
				module: 'List',
				apiConfig: API_CONFIG.lists.deleteList,
				body: { id: row.id },
			}),
		actionListBuilder: () => navigate(`/Lists/ListBuilder/${row.id}`),
		actionListRename: () => openDialog('renameModule', { id: row.id }),
		actionListImport: () => navigate(`/Lists/Import/${row.id}`),
		actionListExport: () => navigate(`/Lists/Export/${row.id}`),
		actionMergeList: () => openDialog('mergeList', { id: row.id }),
		actionDuplicateList: () => openDialog('duplicateList', { id: row.id }),
		actionAddGoalToTask: () => openDialog('addToTask', { id: row.id }),
		actionBatchEmailValidation: () => openDialog('batchEmailValidation', { id: row.id }),
		actionListSettings: () => navigate(`/Lists/Settings/${row.id}`),
		actionListPreview: () => navigate(`/Lists/Preview/${row.id}`),
		actionListEmbedCode: () => openDialog('listEmbedCode', { id: row.id }),
		actionListStats: () => openDialog('listStats', { id: row.id }),
		actionListExportHistory: () => navigate(`/Lists/ExportHistory/${row.id}`),

		actionHref: (href: string) => navigate(href),
	};
}

function createMasterAction(
	master: ActionItem | null,
	handlers: ReturnType<typeof createActionHandlers>,
	navigate: (path: string) => void
): TransformedAction | null {
	if (!master) return null;

	let onClick;
	if (master.goToView) {
		onClick = () => navigate(master.goToView!);
	} else if (master.className && handlers[master.className]) {
		onClick = () => handlers[master.className]();
	} else {
		onClick = undefined;
	}

	return {
		text: master.text || '',
		onClick,
		className: master.className,
	};
}

function createActionList(
	list: ActionsList,
	handlers: ReturnType<typeof createActionHandlers>
): TransformedActions['list'] {
	console.log('List', list);
	return Object.entries(list)
		.filter(([, value]) => {
			return typeof value === 'object' || value === 'divider';
		})
		.map(([key, value]) => {
			if (typeof value === 'object') {
				let onClick;
				if (value.href) {
					onClick = () => handlers.actionHref(value.href);
				} else if (value.className && handlers[value.className]) {
					onClick = () => handlers[value.className]();
				} else {
					onClick = undefined;
				}

				return {
					text: value.text || key,
					type: 'button' as const,
					onClick,
					className: value.className,
					isDelete: key === 'delete',
				};
			} else if (value === 'divider') {
				return { type: 'divider' };
			}
		});
}

// Special handler for folder-type rows
function handleFolderActions(
	rowActions: ActionsStructure,
	row: any,
	{ openDialog, navigate }: Callbacks,
	pathName: string
): TransformedActions {
	const handlers = {
		goToView: () => {
			if (rowActions?.master?.goToView) {
				navigate(`${pathName}?view=folder&folderId=${row.id}`);
			}
		},
		actionEditFolder: () =>
			openDialog('renameFolder', {
				id: row.id,
				name: row.folderName,
				type: 'folders',
			}),
		actionDeleteFolder: () =>
			openDialog('deleteFolder', {
				folderId: row.folderId,
				type: 'folders',
			}),
	};

	// Fix master action
	let masterOnClick;
	if (rowActions?.master?.goToView) {
		masterOnClick = () => handlers.goToView();
	} else if (rowActions?.master?.className && handlers[rowActions.master.className]) {
		masterOnClick = () => handlers[rowActions.master.className]?.();
	} else {
		masterOnClick = undefined;
	}

	const master = rowActions?.master
		? {
				text: rowActions.master.text || 'View',
				onClick: masterOnClick,
				className: rowActions.master?.className,
			}
		: null;

	// Fix list actions
	const list = Object.values(rowActions?.list || {}).map(action => {
		let actionOnClick;
		if ((action as ActionItem).className && handlers[(action as ActionItem).className!]) {
			actionOnClick = () => handlers[(action as ActionItem).className!]?.();
		} else {
			actionOnClick = undefined;
		}

		return {
			text: (action as ActionItem).text || '',
			type: 'button' as const,
			onClick: actionOnClick,
			className: (action as ActionItem).className,
			isDelete: (action as ActionItem).className?.toLowerCase().includes('delete'),
		};
	});

	return { master, list };
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transformLegacyFolderUrl(url: string): string {
	return url
		.replace(
			/\/(Goals|Activities)\/Folder\/(\d+)/i,
			(_, module) => `/${module.toLowerCase()}?view=folders&folderId=$2`
		)
		.replace(/(\?|&)([^=]+)=/g, '&$2=') // Clean up query params
		.replace(/&+/, '?'); // Replace first & with ?
}

export function getChannelIcon(type: string): string {
	switch (type?.toLowerCase()) {
		case 'facebook':
			return '/brands/facebook.svg';
		case 'linkedin':
			return '/brands/linkedin.svg';
		case 'twitter':
		case 'x':
			return '/brands/x.svg';
		case 'instagram':
			return '/brands/instagram.svg';
		case 'tiktok':
			return '/brands/tiktok.svg';
		case 'youtube':
			return '/brands/youtube-icon.svg';
		case 'pinterest':
			return '/brands/pinterest.svg';
		case 'googlebusiness':
			return '/brands/google-my-business.svg';
		case 'whatsapp':
			return '/brands/whatsapp-business.svg';
		default:
			return '';
	}
}
