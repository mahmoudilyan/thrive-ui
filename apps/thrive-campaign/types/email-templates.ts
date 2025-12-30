export interface EmailTemplate {
	id: string;
	template: {
		label: string;
		type: string;
		builder_type: string;
		editable: boolean;
	};
	thumb: string;
	created_on: string;
	created_on_timestamp: number;
	created_by: string;
	actions: {
		master: {
			href: string;
		};
		preview: {
			href: string;
		};
		publicpreview: {
			text: string;
			href: string;
		};
		divider1: string;
		edit: {
			text: string;
			className: string;
		};
		copy: {
			text: string;
			className: string;
		};
		delete: {
			className: string;
		};
		divider2: string;
		copytoaccount: {
			text: string;
			className: string;
		};
		addtotask: {
			text: string;
			className: string;
		};
		createnewtask: {
			text: string;
			className: string;
		};
		attachtoassetgroup: {
			text: string;
			className: string;
		};
		folder: {
			text: string;
			className: string;
		};
		data: {
			'folder-itemtype': string;
		};
	};
	indexid: string;
	folder_name: string;
}
