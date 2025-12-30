// Form Builder Type Definitions

export type FieldType =
	| 'text'
	| 'email'
	| 'url'
	| 'textarea'
	| 'digits'
	| 'phone'
	| 'select'
	| 'radio'
	| 'checkbox'
	| 'date'
	| 'birthday'
	| 'file'
	| 'gdpr'
	| 'captcha'
	| 'payment-products'
	| 'payment-shipping'
	| 'payment-billing'
	| 'payment-checkout';

export type FieldValidation =
	| 'email'
	| 'url'
	| 'digits'
	| 'phone'
	| 'countries'
	| 'states'
	| 'cities'
	| 'date'
	| 'birthday'
	| 'time-12'
	| '';

export interface FieldOption {
	label: string;
	value: string;
	default?: boolean;
	required?: boolean;
}

export interface FormField {
	id: string;
	type: FieldType;
	name: string;
	description?: string;
	placeholder?: string;
	defaultValue?: string;
	required: boolean;
	private: boolean;
	validation?: FieldValidation;
	options?: FieldOption[] | Record<string, any>;
	order: number;
	stepId?: string;
	key?: string;
	secret?: string;
	styleAs?: string;
	// Field-specific options
	dateFormat?: string;
	allowedExtensions?: string[];
	maxFileSize?: number;
	showCountryList?: boolean;
	currency?: string;
	currencyPosition?: 'before' | 'after';
	decimals?: number;
	numberFormat?: boolean;
}

export interface FormStep {
	id: string;
	title: string;
	description?: string;
	order: number;
	isDefault?: boolean;
	fields: FormField[];
}

export interface FormDependency {
	id: string;
	targetFieldId: string;
	sourceFieldId: string;
	condition:
		| 'equals'
		| 'not_equals'
		| 'contains'
		| 'greater_than'
		| 'less_than'
		| 'is_empty'
		| 'is_not_empty';
	value?: string;
	value1?: string;
	grouping?: 'and' | 'or';
}

export interface EmailTemplate {
	subject?: string;
	content: string;
}

export interface FormSettings {
	// Subscription settings
	multipleSubmissions: boolean;
	doubleOptIn: boolean;
	hideSubscribeAgain: boolean;
	confirmRedirect: boolean;
	confirmRedirectUrl?: string;
	confirmRedirectDirect: boolean;
	autoresponder: boolean;
	notifyAdmins: boolean;
	notifyEmails?: string[];
	redirect: boolean;
	redirectUrl?: string;
	redirectDirect: boolean;
	skipSuccessMessage: boolean;
	overrideErrorMessages: boolean;
	customErrorMessages?: Record<string, string>;
	allowEmptyFields: boolean;
	autoTag: boolean;
	autoTagTags?: string[];

	// Sender details
	fromEmail: string;
	fromName: string;
	replyTo: string;

	// Email templates
	emailSubject: string;
	confirmationEmail: EmailTemplate;
	successEmail: EmailTemplate;
	confirmationMessage: string;
	successMessage: string;
	errorMessage: string;
	notifyEmailSubject?: string;
	notifyEmailMessage?: string;

	// Advanced
	emailValidation?: boolean;
	emailValidationSuppress?: boolean;
	emailValidationSuppressList?: string[];
	dataEnrichment?: boolean;
	dataEnrichmentTarget?: string;
	dataEnrichmentMappingId?: number;
	dataEnrichmentProvider?: string;
}

export interface PaymentProduct {
	id: string;
	name: string;
	nameOrg?: string;
	description?: string;
	price: number;
	quantitative: boolean;
	recurring: boolean;
	recurringCount?: number;
	recurringInterval?: 'day' | 'week' | 'month';
	recurringExpiration?: number;
	taxes: boolean;
	taxesPercent?: number;
	fieldId: string;
	rank: number;
}

export interface PaymentSettings {
	domainId?: number;
	currency?: {
		code: string;
		sign: string;
		name: string;
	};
	gateway?: {
		id: string;
		name: string;
	};
	products: PaymentProduct[];
	shipping: {
		enabled: boolean;
	};
	billing: {
		enabled: boolean;
	};
}

export interface FormBuilderData {
	id: string;
	name: string;
	title: string;
	logo?: string;
	fields: FormField[];
	steps: FormStep[];
	settings: FormSettings;
	dependencies: FormDependency[];
	payment?: PaymentSettings;
	// Button labels
	submitButtonLabel: string;
	nextButtonLabel: string;
	previousButtonLabel: string;
	afterSubmitLabel: string;
}

export interface FieldTypeDefinition {
	type: FieldType;
	label: string;
	icon: string;
	description?: string;
	category: 'basic' | 'advanced' | 'payment';
	unique?: boolean;
	disabled?: string;
}

export interface DefaultFieldGroup {
	id: string;
	name: string;
	fields: FormField[];
}

export interface FieldsByList {
	listId: string;
	listName: string;
	fields: FormField[];
}
