export type FieldType =
	| 'text'
	| 'textarea'
	| 'email'
	| 'url'
	| 'phone'
	| 'date'
	| 'birthday'
	| 'select'
	| 'radio'
	| 'checkbox'
	| 'file'
	| 'digits'
	| 'gdpr';

export type ContactStatus = 'Unconfirmed' | 'Active' | 'Inactive' | 'Unsubscribed' | 'Bounced';

export interface CustomFieldOptions {
	dateFormat?: string;
	allowedExtensions?: string[];
	maxSize?: number;
	gdpr?: {
		required?: boolean;
		[key: string]: any;
	};
	[key: string]: any;
}

export interface CustomField {
	id: number;
	name: string;
	type: FieldType;
	secret: string;
	visibility: boolean;
	required: boolean;
	description?: string;
	groupId: number;
	profileId: number;
	options?: CustomFieldOptions;
	validation?: string;
	styleAs?: string;
	isHidden?: boolean;
}

export interface ContactList {
	count: number;
	labels: string[];
}

export interface ContactListParams {
	[key: string]: any;
}

export interface EmailValidation {
	id: string;
	label: string;
	background: string;
	status: 'verified' | 'not-verified' | 'invalid';
}

export interface LeadStatus {
	label: string;
	color: string;
}

export interface ContactActions {
	data: {
		listid: string;
	};
}

// Base contact fields
export interface BaseContact {
	id: string;
	indexid: string;
	email: string;
	phone?: string;
	status: ContactStatus;
	registrationdate: string;
	list_name: ContactList;
	actions: ContactActions;
	emailvalidation: EmailValidation;

	// Visual elements
	picture: string | null;
	color?: string;
	letters?: string;

	// Data fields
	data_leadscore: number;
	data_leadstatus: LeadStatus;
}

// Contact with any additional dynamic fields
export interface Contact extends BaseContact {
	[key: string]: any;
}

export interface ListField extends CustomField {
	listId: number;
	listName: string;
}

export interface DefaultObjectField {
	field_id: number;
	field_name: string;
	field_visibility: number;
	field_secret?: string;
}

export interface DefaultFieldGroup {
	id: number;
	name: string;
	fields: DefaultObjectField[];
}

export interface DataField {
	id: string;
	name: string;
	visibility: number;
}

export interface TableColumnConfig {
	title: any;
	id: string;
	key: string;
	name: string;
	visibility: boolean;
	group: string;
	isFixed?: boolean;
	width?: number;
	secret?: string;
	sort?: boolean;
	defaultSort?: boolean;
	type?: FieldType;
	isDefaultField?: boolean;
}

export type TableColumns = TableColumnConfig[];
export interface TableColumnVisibility {
	[key: string]: boolean;
}

export interface ContactsTableHeaders {
	[key: string]: TableColumnConfig;
}

export interface ContactsResponse {
	contacts: Contact[];
	recordsTotal?: number;
	recordsFiltered?: number;
	contactsTotal?: number;
	contactsActive?: number;
	listFields?: ListField[];
	headers?: ContactsTableHeaders;
	customFields?: {
		[key: string]: CustomField;
	};
}

export interface SearchDef {
	value: string;
	regex: boolean;
}

export interface ColumnQuery {
	data: string;
	name?: string;
	searchable: boolean;
	orderable: boolean;
	search: SearchDef;
}

export interface ContactsFilter {
	lists?: string[];
	audiences?: string[];
	status?: ContactStatus[];
	dateRange?: {
		start: string;
		end: string;
	};
	search?: SearchDef;
	searchBy?: 'fields' | 'name' | 'tags';
	page?: number;
	pageSize?: number;
}

export type ContactsSort = {
	id: string;
	desc: boolean;
}[];

export type ContactsColumnVisibility = Record<string, boolean>;

export interface OrderDef {
	column: number;
	dir: 'asc' | 'desc';
}

export interface ContactActions {
	master: {
		text: string;
		className: string;
	};
	list: {
		[key: string]:
			| {
					text: string;
					className: string;
			  }
			| 'divider';
	};
}

export interface ContactsTableHeadersAndActions {
	headers: ContactsTableHeaders;
	actions: ContactActions;
}

export interface DateRange {
	start: string;
	end: string;
}

// Main table state interface
export interface ContactsTableState {
	// Pagination
	pagination: {
		pageIndex: number;
		pageSize: number;
	};

	// Columns configuration
	columnsQueries: ColumnQuery[];

	// Sorting
	sorting: {
		id: string;
		desc: boolean;
	}[];

	// Search/Filter state
	search: SearchDef;
	searchBy: 'fields' | 'name' | 'tags';

	// Filters
	filters: {
		lists?: string[];
		audiences?: string[];
		dateRange?: DateRange;
		isBDA?: boolean;
	};
}
