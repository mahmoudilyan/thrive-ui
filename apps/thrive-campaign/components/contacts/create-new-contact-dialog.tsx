'use client';

import { useState, useEffect } from 'react';
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from '@thrive/ui';
import { MdPersonAdd, MdMoreVert, MdEmail, MdPhone, MdList, MdPersonOutline } from 'react-icons/md';
import type { ContactStatus, CustomField } from '@/types/contacts';

interface List {
	id: string;
	name: string;
}

interface CreateNewContactDialogProps {
	onClose: () => void;
	dialogTitle?: string;
	dialogDescription?: string;
	onSubmit?: (data: ContactFormData) => void;
}

interface ContactFormData {
	email: string;
	phone?: string;
	listId?: string;
	status: ContactStatus;
	customFields?: Record<string, any>;
}

interface FormField {
	id: number;
	name: string;
	type: string;
	secret: string;
	visibility: boolean;
	required: boolean;
	description?: string;
	groupId: number;
	profileId: number;
	options?: any;
	validation?: string;
	styleAs?: string;
	isHidden?: boolean;
}

interface FormFieldGroup {
	id: number;
	name: string;
	fields: FormField[];
}

const contactStatuses: { value: ContactStatus; label: string }[] = [
	{ value: 'Unconfirmed', label: 'Unconfirmed' },
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' },
	{ value: 'Unsubscribed', label: 'Unsubscribed' },
	{ value: 'Bounced', label: 'Bounced' },
];

export default function CreateNewContactDialog({
	onClose,
	dialogTitle = 'Create New Contact',
	dialogDescription = 'Add a new contact to your database',
	onSubmit,
}: CreateNewContactDialogProps) {
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [selectedListId, setSelectedListId] = useState<string>('');
	const [status, setStatus] = useState<ContactStatus>('Unconfirmed');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lists, setLists] = useState<List[]>([]);
	const [listFormFields, setListFormFields] = useState<FormFieldGroup[]>([]);
	const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
	const [isLoadingFields, setIsLoadingFields] = useState(false);

	// Load available lists on component mount
	useEffect(() => {
		const loadLists = async () => {
			try {
				// Load lists from the lists-all.json mock data
				const response = await fetch('/mock/lists-all.json');
				const listsData = await response.json();

				// Transform the data to match our List interface
				const transformedLists: List[] = listsData.map((list: any) => ({
					id: list.id,
					name: list.name,
				}));

				setLists(transformedLists);
			} catch (error) {
				console.error('Failed to load lists:', error);
				// Fallback to mock data
				const mockLists: List[] = [
					{ id: '152042', name: 'AI chatbot franchises' },
					{ id: '151947', name: 'Email Guide List' },
					{ id: '150536', name: 'Email Marketing Guide 2025' },
				];
				setLists(mockLists);
			}
		};

		loadLists();
	}, []);

	// Load form fields when list is selected
	useEffect(() => {
		const loadListFormFields = async () => {
			if (!selectedListId) {
				setListFormFields([]);
				setCustomFieldValues({});
				return;
			}

			setIsLoadingFields(true);
			try {
				// Call the new API endpoint
				const response = await fetch(
					`/api/App/Contacts/GetContactFormFields.json?listId=${selectedListId}`
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch form fields: ${response.statusText}`);
				}

				const formFieldsData = await response.json();

				// Transform the API response to match our FormFieldGroup interface
				const transformedFields: FormFieldGroup[] = [];

				if (formFieldsData.fields && Array.isArray(formFieldsData.fields)) {
					// Group fields by type/category for better organization
					const personalFields: FormField[] = [];
					const contactFields: FormField[] = [];
					const companyFields: FormField[] = [];
					const otherFields: FormField[] = [];

					formFieldsData.fields.forEach((field: any, index: number) => {
						const transformedField: FormField = {
							id: index + 1,
							name: field.label || field.caption || field.name,
							type: field.type || 'text',
							secret: field.name,
							visibility: true,
							required: field.required === 'true' || field.required === true,
							description: field.tooltip || field.placeholder,
							groupId: 1,
							profileId: 1,
							options: field.options,
						};

						// Categorize fields based on their names/types
						const fieldName = transformedField.name.toLowerCase();
						if (
							fieldName.includes('first') ||
							fieldName.includes('last') ||
							fieldName.includes('name')
						) {
							personalFields.push(transformedField);
						} else if (
							fieldName.includes('phone') ||
							fieldName.includes('email') ||
							fieldName.includes('website') ||
							fieldName.includes('linkedin') ||
							fieldName.includes('twitter') ||
							fieldName.includes('facebook')
						) {
							contactFields.push(transformedField);
						} else if (
							fieldName.includes('company') ||
							fieldName.includes('industry') ||
							fieldName.includes('employee')
						) {
							companyFields.push(transformedField);
						} else {
							otherFields.push(transformedField);
						}
					});

					// Create groups
					if (personalFields.length > 0) {
						transformedFields.push({
							id: 1,
							name: 'Personal Information',
							fields: personalFields,
						});
					}

					if (contactFields.length > 0) {
						transformedFields.push({
							id: 2,
							name: 'Contact Information',
							fields: contactFields,
						});
					}

					if (companyFields.length > 0) {
						transformedFields.push({
							id: 3,
							name: 'Company Information',
							fields: companyFields,
						});
					}

					if (otherFields.length > 0) {
						transformedFields.push({
							id: 4,
							name: 'Additional Information',
							fields: otherFields,
						});
					}
				}

				setListFormFields(transformedFields);
			} catch (error) {
				console.error('Failed to load form fields:', error);
				// Fallback to empty fields
				setListFormFields([]);
			} finally {
				setIsLoadingFields(false);
			}
		};

		loadListFormFields();
	}, [selectedListId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const formData: ContactFormData = {
				email: email.trim(),
				phone: phone.trim() || undefined,
				listId: selectedListId || undefined,
				status,
				customFields: Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined,
			};

			if (onSubmit) {
				await onSubmit(formData);
			}
			onClose();
		} catch (error) {
			console.error('Failed to create contact:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCustomFieldChange = (fieldSecret: string, value: any) => {
		setCustomFieldValues(prev => ({
			...prev,
			[fieldSecret]: value,
		}));
	};

	const renderFormField = (field: FormField) => {
		const value = customFieldValues[field.secret] || '';

		switch (field.type) {
			case 'text':
			case 'email':
				return (
					<Input
						key={field.id}
						value={value}
						onChange={e => handleCustomFieldChange(field.secret, e.target.value)}
						placeholder={`Enter ${field.name.toLowerCase()}`}
						required={field.required}
						type={field.type === 'email' ? 'email' : 'text'}
					/>
				);

			case 'tel':
				return (
					<Input
						key={field.id}
						value={value}
						onChange={e => handleCustomFieldChange(field.secret, e.target.value)}
						placeholder={`Enter ${field.name.toLowerCase()}`}
						required={field.required}
						type="tel"
					/>
				);

			case 'url':
				return (
					<Input
						key={field.id}
						value={value}
						onChange={e => handleCustomFieldChange(field.secret, e.target.value)}
						placeholder={`Enter ${field.name.toLowerCase()}`}
						required={field.required}
						type="url"
					/>
				);

			case 'textarea':
				return (
					<textarea
						key={field.id}
						value={value}
						onChange={e => handleCustomFieldChange(field.secret, e.target.value)}
						placeholder={`Enter ${field.name.toLowerCase()}`}
						required={field.required}
						rows={3}
						className="w-full px-3 py-2 border border-border rounded-md bg-bg text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				);

			case 'select':
				// This would need to be implemented based on field options
				return (
					<Select
						key={field.id}
						value={value}
						onValueChange={val => handleCustomFieldChange(field.secret, val)}
					>
						<SelectTrigger>
							<SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
						</SelectTrigger>
						<SelectContent>
							{/* Options would come from field.options */}
							<SelectItem value="option1">Option 1</SelectItem>
							<SelectItem value="option2">Option 2</SelectItem>
						</SelectContent>
					</Select>
				);

			case 'digits':
				return (
					<Input
						key={field.id}
						value={value}
						onChange={e => handleCustomFieldChange(field.secret, e.target.value)}
						placeholder={`Enter ${field.name.toLowerCase()}`}
						required={field.required}
						type="number"
					/>
				);

			default:
				return (
					<Input
						key={field.id}
						value={value}
						onChange={e => handleCustomFieldChange(field.secret, e.target.value)}
						placeholder={`Enter ${field.name.toLowerCase()}`}
						required={field.required}
					/>
				);
		}
	};

	const handleContactAction = (action: string) => {
		console.log(`Contact action: ${action}`);
		// These would open respective dialogs or perform actions
		switch (action) {
			case 'moveToList':
				// openDialog('moveToList', { contact: newContact });
				break;
			case 'addToList':
				// openDialog('addToList', { contact: newContact });
				break;
			case 'validateEmail':
				// Perform email validation
				break;
			case 'enrichContact':
				// Perform contact enrichment
				break;
			case 'deleteContact':
				// openDialog('deleteContact', { contact: newContact });
				break;
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20">
							<MdPersonAdd className="w-5 h-5 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<DialogTitle>{dialogTitle}</DialogTitle>
							<DialogDescription>{dialogDescription}</DialogDescription>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm">
								<MdMoreVert className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleContactAction('moveToList')}>
								<MdList className="mr-2 w-4 h-4" />
								Move to List
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleContactAction('addToList')}>
								<MdPersonAdd className="mr-2 w-4 h-4" />
								Add to List
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleContactAction('validateEmail')}>
								<MdEmail className="mr-2 w-4 h-4" />
								Validate Email
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleContactAction('enrichContact')}>
								<MdPersonOutline className="mr-2 w-4 h-4" />
								Enrich Contact
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => handleContactAction('deleteContact')}
								className="text-red-600 focus:text-red-600"
							>
								Delete Contact
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</DialogHeader>

			<div className="space-y-4 py-4 max-h-96 overflow-y-auto">
				{/* Required Email Field */}
				<div>
					<label htmlFor="contact-email" className="block text-sm font-medium text-ink mb-1">
						Email Address *
					</label>
					<div className="relative">
						<MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-light" />
						<Input
							id="contact-email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Enter email address"
							required
							autoFocus
							type="email"
							className="pl-10"
						/>
					</div>
				</div>

				{/* Phone Field */}
				<div>
					<label htmlFor="contact-phone" className="block text-sm font-medium text-ink mb-1">
						Phone Number
					</label>
					<div className="relative">
						<MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-light" />
						<Input
							id="contact-phone"
							value={phone}
							onChange={e => setPhone(e.target.value)}
							placeholder="Enter phone number"
							type="tel"
							className="pl-10"
						/>
					</div>
				</div>

				{/* List Selection */}
				<div>
					<label htmlFor="contact-list" className="block text-sm font-medium text-ink mb-1">
						List
					</label>
					<Select value={selectedListId} onValueChange={setSelectedListId}>
						<SelectTrigger>
							<SelectValue placeholder="Select a list" />
						</SelectTrigger>
						<SelectContent>
							{lists.map(list => (
								<SelectItem key={list.id} value={list.id}>
									{list.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Contact Status */}
				<div>
					<label htmlFor="contact-status" className="block text-sm font-medium text-ink mb-1">
						Contact Status
					</label>
					<Select value={status} onValueChange={(value: ContactStatus) => setStatus(value)}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{contactStatuses.map(statusOption => (
								<SelectItem key={statusOption.value} value={statusOption.value}>
									{statusOption.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Dynamic Form Fields */}
				{isLoadingFields && (
					<div className="text-center py-4">
						<div className="text-sm text-ink-light">Loading form fields...</div>
					</div>
				)}

				{listFormFields.map(group => (
					<div key={group.id} className="space-y-3">
						<h4 className="text-sm font-medium text-ink border-b border-border pb-1">
							{group.name}
						</h4>
						{group.fields.map(field => (
							<div key={field.id}>
								<label className="block text-sm font-medium text-ink mb-1">
									{field.name}
									{field.required && <span className="text-red-500 ml-1">*</span>}
								</label>
								{renderFormField(field)}
								{field.description && (
									<p className="text-xs text-ink-light mt-1">{field.description}</p>
								)}
							</div>
						))}
					</div>
				))}
			</div>

			<DialogFooter>
				<Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" variant="primary" disabled={!email.trim() || isSubmitting}>
					{isSubmitting ? 'Creating...' : 'Create Contact'}
				</Button>
			</DialogFooter>
		</form>
	);
}
