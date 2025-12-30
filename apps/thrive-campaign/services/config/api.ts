import { ContactsTableState } from '@/types/contacts/index';
import { TableState } from '@/types/table';
import { API_BASE_URL, API_BASE_PATH } from './config';

// config/env.ts
export const env = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	//apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://uix.vbout.com/App',
	nodeEnv: process.env.NODE_ENV,
};

// Debug environment
console.log('Environment Debug:', {
	NODE_ENV: process.env.NODE_ENV,
	isDev: env.isDev,
	isProd: env.isProd,
});

//const baseUrl = env.apiUrl;
const baseUrl = env.isDev ? API_BASE_URL + API_BASE_PATH : '/api/App';
const nextApiUrl = env.isDev ? '/api' : '/api';

export interface ApiEndpoint<TParams = void> {
	createKey: (params: TParams) => readonly unknown[];
	url: ((params: TParams) => string) | string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	contentType?: 'json' | 'form';
	pageParamKey?: string;
}

export const API_CONFIG: Record<string, Record<string, ApiEndpoint<unknown>>> = {
	auth: {
		login: {
			createKey: () => ['auth', 'login'],
			url: `${baseUrl}/auth/login`,
		} satisfies ApiEndpoint<void>,
		register: {
			createKey: () => ['auth', 'register'],
			url: `${baseUrl}/auth/register`,
		} satisfies ApiEndpoint<void>,
		logout: {
			createKey: () => ['auth', 'logout'],
			url: `${baseUrl}/auth/logout`,
		} satisfies ApiEndpoint<void>,
	},
	contacts: {
		getContacts: {
			createKey: (tableState: ContactsTableState) => [
				'contacts',
				'list',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: `${baseUrl}/Contacts/GetContacts.json`,
			method: 'POST',
			contentType: 'form',
		} as ApiEndpoint<ContactsTableState>,
		getDefaultFields: {
			createKey: () => ['defaultFields'],
			url: `${baseUrl}/Contacts/GetDefaultFields.json`,
		} satisfies ApiEndpoint,
		getDataFields: {
			createKey: () => ['dataFields'],
			url: `${baseUrl}/Contacts/GetDataFields.json`,
		} satisfies ApiEndpoint,
		getAllFields: {
			createKey: () => ['allFields'],
			url: `${baseUrl}/Contacts/GetAllFields.json`,
		} satisfies ApiEndpoint,
		getAllHeadersAndActions: {
			createKey: () => ['allHeadersAndActions'],
			url: `${baseUrl}/Contacts/GetContacts.json?loadheaders=true`,
			method: 'POST',
			contentType: 'form',
		} satisfies ApiEndpoint,
		createContact: {
			createKey: () => ['createContact'],
			url: `${baseUrl}/Contacts/createContact.json`,
		} satisfies ApiEndpoint,
		getContact: {
			createKey: (id: string) => ['getContact', id],
			url: (id: string) => `${baseUrl}/Contacts/GetContact/${id}.json`,
		} satisfies ApiEndpoint<string>,
		updateContact: {
			createKey: (id: string) => ['updateContact', id],
			url: (id: string) => `${baseUrl}/Contacts/UpdateContact/${id}.json`,
		} satisfies ApiEndpoint<string>,
		moveContact: {
			createKey: (id: string) => ['moveContact', id],
			url: (id: string) => `${baseUrl}/Contacts/MoveContact/${id}.json`,
		} satisfies ApiEndpoint<string>,
		getContactFormFields: {
			createKey: (listId: string) => ['getContactFormFields', listId],
			url: (listId: string) => `${baseUrl}/Contacts/GetContactFormFields.json?listId=${listId}`,
		} satisfies ApiEndpoint<string>,
	},
	lists: {
		getLists: {
			createKey: (tableState: TableState) => [
				'lists',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Lists/GetLists.json?${params.toString()}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getListsFilters: {
			createKey: () => ['getListsFilters'],
			url: `${baseUrl}/Lists/GetListsList.json`,
		},
		getListsHeaders: {
			createKey: () => ['getListsHeaders'],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Lists/GetLists.json?${params.toString()}&loadheaders=true`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getShortcodes: {
			createKey: () => ['getShortcodes'],
			url: (params: { types: string; listId: number; listsOnly: number }) =>
				`${baseUrl}/Lists/GetShortCodes.json?types=${params.types}&listId=${params.listId}&listsOnly=${params.listsOnly}`,
		},
		getAllLists: {
			createKey: () => ['getAllLists'],
			url: (params: { source: string; __loader: string; __get: string; _: string }) =>
				`${baseUrl}/Lists/GetAllLists.json?source=${params.source}&__loader=${params.__loader}&__get=${params.__get}&_=${params._}`,
		},
	},
	audiences: {
		getAudiences: {
			createKey: (tableState: TableState) => [
				'audiences',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Audiences/GetAudiences.json?${params.toString()}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getAudiencesList: {
			createKey: () => ['getAudiencesList'],
			url: `${baseUrl}/Audiences/GetAudiencesList.json`,
		},
		getAudiencesHeaders: {
			createKey: () => ['getAudiencesHeaders'],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Audiences/GetAudiences.json?${params.toString()}&loadheaders=true`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getAllAudiences: {
			createKey: () => ['getAllAudiences'],
			url: (params: { source: string; __loader: string; __get: string; _: string }) =>
				`${baseUrl}/Audiences/GetAllAudiences.json?source=${params.source}&__loader=${params.__loader}&__get=${params.__get}&_=${params._}`,
		},
	},
	goals: {
		getGoals: {
			createKey: (tableState: TableState) => [
				'goals',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Goals/GetGoals.json?${params.toString()}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getGoalsDomains: {
			createKey: () => ['getGoalsDomains'],
			url: `${baseUrl}/Domains/GetDomains.json`,
		},
		getGoalsHeaders: {
			createKey: () => ['getGoalsHeaders'],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Goals/GetGoals.json?${params.toString()}&loadheaders=true`;
			},
			method: 'POST',
			contentType: 'form',
		},
		deleteGoal: {
			createKey: (id: string) => ['deleteGoal', id],
			url: `${baseUrl}/Goals/DeleteGoal.json`,
			method: 'POST',
			contentType: 'form',
		},
	},
	folders: {
		getFolders: {
			createKey: (tableState: TableState) => [
				'folders',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: `${baseUrl}/Folders/GetFolders.json`,
			method: 'POST',
			contentType: 'form',
		},
		createFolder: {
			createKey: (params: { type: string }) => ['createFolder', params.type],
			url: (params: { type: string }) => `${baseUrl}/Folders/CreateFolder.json?type=${params.type}`,
			method: 'POST',
			contentType: 'form',
		},
		deleteFolder: {
			createKey: (folderId: number) => ['deleteFolder', folderId],
			url: (params: { folderId: number; type: string }) => {
				return `${baseUrl}/Folders/RemoveFolder.json?id=${params.folderId}&type=${params.type}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getFoldersHeaders: {
			createKey: () => ['getFoldersHeaders'],
			url: `${baseUrl}/Folders/GetFolders.json?loadheaders=true`,
			method: 'POST',
			contentType: 'form',
		},
		renameFolder: {
			createKey: (params: { id: number; type: string }) => ['renameFolder', params.id, params.type],
			url: (params: { id: number; type: string }) =>
				`${baseUrl}/Folders/UpdateFolder.json?id=${params.id}&type=${params.type}`,
			method: 'POST',
			contentType: 'form',
		},
		getFoldersList: {
			createKey: () => ['getFoldersList'],
			url: (params: { source: string; __loader: string; __get: string; _: string }) =>
				`${baseUrl}/Folders/GetFoldersList.json?source=${params.source}&__loader=${params.__loader}&__get=${params.__get}&_=${params._}`,
		},
	},
	tasks: {
		getTasks: {
			createKey: () => ['tasks'],
			url: `${baseUrl}/Tasks/GetTasks.json`,
		},
		addToTask: {
			createKey: (params: { assetsIds: number; assetType: number }) => [
				'addToTask',
				params.assetsIds,
				params.assetType,
			],
			url: (params: { assetsIds: number; assetType: number }) => {
				return `${baseUrl}/Tasks/AddNewAsset.json?assetsIds=${params.assetsIds}&assetType=${params.assetType}`;
			},
			method: 'POST',
			contentType: 'form',
		},
	},

	campaignsAssets: {
		getAssets: {
			createKey: (tableState: TableState) => [
				'campaignsAssets',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: `${baseUrl}/CampaignAssets/GetAssetGroups.json`,
			method: 'POST',
			contentType: 'form',
		},
		getAssetsHeaders: {
			createKey: () => ['campaignsAssetsHeaders'],
			url: `${baseUrl}/CampaignAssets/GetAssetGroups.json?loadheaders=true`,
			method: 'POST',
			contentType: 'form',
		},
		attachAsset: {
			createKey: (params: { id: number; assetType: string }) => [
				'attachAsset',
				params.id,
				params.assetType,
			],
			url: (params: { id: number; assetType: string }) => {
				return `${baseUrl}/CampaignAssets/AttachToAssetGroup.json?assetType=${params.assetType}&id=3835.json?id=${params.id}&assetType=${params.assetType}`;
			},
			method: 'POST',
			contentType: 'form',
		},
	},
	campaigns: {
		getCampaigns: {
			createKey: (tableState: TableState) => [
				'campaigns',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/EmailMarketing/GetCampaigns.json?${params.toString()}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getCampaignsHeaders: {
			createKey: () => ['getCampaignsHeaders'],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/EmailMarketing/GetCampaigns.json?${params.toString()}&loadheaders=true`;
			},
			method: 'POST',
			contentType: 'form',
		},
	},
	automations: {
		getAutomations: {
			createKey: (tableState: TableState) => [
				'automations',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Automation/GetAutomations.json?${params.toString()}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getAutomationsHeaders: {
			createKey: () => ['getAutomationsHeaders'],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Automation/GetAutomations.json?${params.toString()}&loadheaders=true`;
			},
			method: 'POST',
			contentType: 'form',
		},
	},
	email: {
		templates: {
			createKey: (params: { type: string }) => ['email', 'templates', params.type],
			url: (params: { type: string }) =>
				`${baseUrl}/Templates/GetTemplates.json?type=${params.type}`,
		},
		getTemplates: {
			createKey: (tableState: TableState) => [
				'emailTemplates',
				tableState.filters,
				tableState.pagination.pageIndex,
				tableState.pagination.pageSize,
				tableState.sorting,
			],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Templates/GetTemplates.json?${params.toString()}`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getTemplatesHeaders: {
			createKey: () => ['getTemplatesHeaders'],
			url: (tableState: TableState) => {
				const params = new URLSearchParams({
					view: tableState.view || 'folder',
				});
				return `${baseUrl}/Templates/GetTemplates.json?${params.toString()}&loadheaders=true`;
			},
			method: 'POST',
			contentType: 'form',
		},
		getTemplatePreview: {
			createKey: (id: string) => ['templates', 'preview', id],
			url: (id: string) => `${baseUrl}/Templates/PreviewTemplate/${id}.html`,
			method: 'GET',
		} satisfies ApiEndpoint<string>,
		getShortcodes: {
			createKey: () => ['email', 'shortcodes'],
			url: `${baseUrl}/Email/GetShortcodes.json`,
		},
	},
	social: {
		getChannels: {
			createKey: () => ['social', 'getChannels'],
			url: `${baseUrl}/SocialMedia/GetChannels.json`,
		},
		getChannelTabs: {
			createKey: (params: { channelDetails: string }) => [
				'social',
				'getChannelTabs',
				params.channelDetails,
			],
			url: (params: { channelDetails: string }) =>
				`${baseUrl}/SocialStreams/ChannelTabs.json?channel=${params.channelDetails}`,
		},
		getEvents: {
			createKey: (params: { start: string; end: string }) => [
				'social',
				'getEvents',
				params.start,
				params.end,
			],
			url: (params: { start: string; end: string }) =>
				`${baseUrl}/Calendar/EventsList.json?start=${params.start}&end=${params.end}`,
		},
		getStreamData: {
			createKey: (params: {
				channelDetails: string;
				tabId: string;
				cacheAfter: 0 | 1;
				create: string;
				after?: string;
			}) => [
				'social',
				'getStreamData',
				params.channelDetails,
				params.tabId,
				params.cacheAfter,
				params.create,
				params.after,
			],
			url: (params: {
				channelDetails: string;
				tabId: string;
				cacheAfter: 0 | 1;
				create: string;
				after?: string;
			}) =>
				`${baseUrl}/SocialStreams/Stream.json?channel=${params.channelDetails}&tabid=${params.tabId}&cacheAfter=${params.cacheAfter}&create=${params.create}${params.after ? `&after=${params.after}` : ''}`,
		},
		getFacebookComments: {
			createKey: (params: { postId: string; platform: string }) => [
				'social',
				'getComments',
				params.postId,
				params.platform,
			],
			url: (params: { uid: string; id: string; postid?: string }) =>
				`${baseUrl}/SocialStreams/FacebookComments.json?uid=${params.uid}&id=${params.id}&postid=${params.postid || ''}`,
		},
		addFacebookComment: {
			createKey: (params: { uid: string; id: string; postid?: string }) => [
				'social',
				'addFacebookComment',
				params.uid,
				params.id,
				params.postid,
			],
			url: (params: { uid: string; id: string; postid?: string }) =>
				`${baseUrl}/SocialStreams/AddFacebookComment.json?uid=${params.uid}&id=${params.id}&postid=${params.postid || ''}`,
		},
		likeFacebookComment: {
			createKey: (params: { commentId: string; platform: string }) => [
				'social',
				'likeComment',
				params.commentId,
				params.platform,
			],
			url: () => `${baseUrl}/SocialStreams/LikeComment.json`,
		},
		createShortLink: {
			createKey: (params: {
				agencyModeration: number | string;
				url: string;
				profileid: number;
			}) => ['shortLinks', 'create', params.agencyModeration, params.url, params.profileid],
			url: `${baseUrl}/SocialMedia/CreateShortlink.json`,
			method: 'POST',
			contentType: 'form',
		} satisfies ApiEndpoint<{ agencyModeration: number | string; url: string; profileid: number }>,
		textCrawler: {
			createKey: (params: { text: string; echo: string; __loader: string }) => [
				'shortLinks',
				'textCrawler',
				params.text,
				params.echo,
				params.__loader,
			],
			url: `${baseUrl}/SocialMedia/TextCrawler.json`,
			method: 'POST',
			contentType: 'form',
		} satisfies ApiEndpoint<{
			text: string;
			echo: string;
			profileid: number;
			__loader: string;
		}>,
	},
	s3Assets: {
		listItems: {
			createKey: (params: { path: string; filterType?: string; searchTerm?: string }) => [
				's3Assets',
				'list',
				params.path,
				params.filterType,
				params.searchTerm,
			],
			url: (params: { path: string }) =>
				`${nextApiUrl}/s3/list?path=${encodeURIComponent(params.path)}`,
			method: 'GET',
			pageParamKey: 'after',
		} as ApiEndpoint<{ path: string; filterType?: string; searchTerm?: string }>,
		uploadFile: {
			createKey: () => ['s3Assets', 'upload'],
			url: `${nextApiUrl}/s3/upload`,
			method: 'POST',
		} satisfies ApiEndpoint,
		deleteItem: {
			createKey: () => ['s3Assets', 'delete'],
			url: `/api/s3/delete`,
			method: 'DELETE',
		} satisfies ApiEndpoint,
		createFolder: {
			createKey: () => ['s3Assets', 'createFolder'],
			url: `${nextApiUrl}/s3/folder`,
			method: 'POST',
		} satisfies ApiEndpoint,
		getSignedUrl: {
			createKey: (params: {
				key: string;
				userId?: string;
				folderId?: string;
				userPrefix?: string;
			}) => [
				's3Assets',
				'signedUrl',
				params.key,
				params.userId,
				params.folderId,
				params.userPrefix,
			],
			url: (params: { key: string; userId?: string; folderId?: string; userPrefix?: string }) => {
				const searchParams = new URLSearchParams({
					key: params.key,
					...(params.userId && { userId: params.userId }),
					...(params.folderId && { folderId: params.folderId }),
					...(params.userPrefix && { userPrefix: params.userPrefix }),
				});
				return `${nextApiUrl}/s3/signed-url?${searchParams.toString()}`;
			},
			method: 'GET',
		} satisfies ApiEndpoint<{
			key: string;
			userId?: string;
			folderId?: string;
			userPrefix?: string;
		}>,
		getThumbnail: {
			createKey: (key: string) => ['s3Assets', 'thumbnail', key],
			url: `${nextApiUrl}/s3/thumbnail`,
		} satisfies ApiEndpoint<string>,
		getFolderCounts: {
			createKey: (params: { path: string }) => ['s3Assets', 'folderCounts', params.path],
			url: (params: { path: string }) =>
				`${nextApiUrl}/s3/folder-count?path=${encodeURIComponent(params.path)}`,
			method: 'GET',
		} satisfies ApiEndpoint<{ path: string }>,
	},
	formBuilder: {
		getForm: {
			createKey: (id: string) => ['formBuilder', 'getForm', id],
			url: (params: { id: string }) => `${baseUrl}/Lists/GetFormBuilder/${params.id}`,
			method: 'GET',
		},
		saveForm: {
			createKey: (id: string) => ['formBuilder', 'saveForm', id],
			url: (params: { id: string }) => `${baseUrl}/Lists/UpdateFormBuilder/${params.id}`,
			method: 'POST',
			contentType: 'form',
		},
		getAvailableFields: {
			createKey: (id: string) => ['formBuilder', 'fields', id],
			url: (id: string) => `${baseUrl}/Lists/GetFormBuilderFields/${id}`,
			method: 'GET',
		} satisfies ApiEndpoint<string>,
		getDefaultFields: {
			createKey: () => ['formBuilder', 'defaultFields'],
			url: `${baseUrl}/Lists/GetDefaultFormFields.json`,
			method: 'GET',
		} satisfies ApiEndpoint,
		getFieldsByList: {
			createKey: () => ['formBuilder', 'fieldsByList'],
			url: `${baseUrl}/Lists/GetFieldsByList.json`,
			method: 'GET',
		} satisfies ApiEndpoint,
		getPaymentSettings: {
			createKey: (id: string) => ['formBuilder', 'payment', id],
			url: (id: string) => `${baseUrl}/Lists/GetPaymentSettings/${id}.json`,
			method: 'GET',
		} satisfies ApiEndpoint<string>,
		getPaymentProducts: {
			createKey: (domainId: string) => ['formBuilder', 'products', domainId],
			url: (domainId: string) => `${baseUrl}/Ecommerce/GetProducts/${domainId}.json`,
			method: 'GET',
		} satisfies ApiEndpoint<string>,
	},
} as const;
