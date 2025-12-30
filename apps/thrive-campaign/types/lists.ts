export interface List {
	id: string;
	rowtype?: string;
	list: string;
	created_on: string;
	contacts: string | number;
	status_confirmed: string | number;
	status_unconfirmed: string | number;
	status_unsubscribed: string | number;
	status_bounced: string | number;
	status_complaint: string | number;
	folder_name?: string;
	folderItems?: number;
	name?: string;
	actions?: any;
	actionslist?: any;
	[key: string]: any;
}
