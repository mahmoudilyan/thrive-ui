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
} from '@thrive/ui';
import { MdEdit, MdEmail, MdPhone } from 'react-icons/md';
import type { Contact, ContactStatus } from '@/types/contacts';

interface EditContactDialogProps {
	onClose: () => void;
	contact: Contact;
	dialogTitle?: string;
	dialogDescription?: string;
	onSubmit?: (data: Partial<Contact>) => void;
}

const contactStatuses: { value: ContactStatus; label: string }[] = [
	{ value: 'Unconfirmed', label: 'Unconfirmed' },
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' },
	{ value: 'Unsubscribed', label: 'Unsubscribed' },
	{ value: 'Bounced', label: 'Bounced' },
];

export default function EditContactDialog({
	onClose,
	contact,
	dialogTitle = 'Edit Contact',
	dialogDescription = 'Update contact information',
	onSubmit,
}: EditContactDialogProps) {
	const [email, setEmail] = useState(contact.email || '');
	const [phone, setPhone] = useState(contact.phone || '');
	const [status, setStatus] = useState<ContactStatus>(contact.status || 'Unconfirmed');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [customFields, setCustomFields] = useState<Record<string, any>>({});

	// Initialize custom fields from contact data
	useEffect(() => {
		const fields: Record<string, any> = {};
		Object.entries(contact).forEach(([key, value]) => {
			if (!['id', 'indexid', 'email', 'phone', 'status', 'registrationdate', 
				  'list_name', 'actions', 'emailvalidation', 'picture', 'color', 
				  'letters', 'data_leadscore', 'data_leadstatus'].includes(key)) {
				fields[key] = value;
			}
		});
		setCustomFields(fields);
	}, [contact]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const updatedData: Partial<Contact> = {
				id: contact.id,
				email: email.trim(),
				phone: phone.trim() || undefined,
				status,
				...customFields,
			};

			if (onSubmit) {
				await onSubmit(updatedData);
			}
			onClose();
		} catch (error) {
			console.error('Failed to update contact:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCustomFieldChange = (key: string, value: any) => {
		setCustomFields(prev => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20">
						<MdEdit className="w-5 h-5 text-orange-600 dark:text-orange-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-4 py-4 max-h-96 overflow-y-auto">
				{/* Email Field */}
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

				{/* Custom Fields */}
				{Object.keys(customFields).length > 0 && (
					<div className="space-y-3">
						<h4 className="text-sm font-medium text-ink border-b border-border pb-1">
							Additional Information
						</h4>
						{Object.entries(customFields).map(([key, value]) => (
							<div key={key}>
								<label className="block text-sm font-medium text-ink mb-1 capitalize">
									{key.replace(/_/g, ' ')}
								</label>
								<Input
									value={String(value || '')}
									onChange={e => handleCustomFieldChange(key, e.target.value)}
									placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}`}
								/>
							</div>
						))}
					</div>
				)}

				{/* Contact Info */}
				<div className="bg-bg-subtle p-3 rounded-md">
					<div className="text-xs text-ink-light">
						<div>Contact ID: {contact.id}</div>
						<div>Registration Date: {new Date(contact.registrationdate).toLocaleDateString()}</div>
						{contact.list_name?.labels && (
							<div>Lists: {contact.list_name.labels.join(', ')}</div>
						)}
					</div>
				</div>
			</div>

			<DialogFooter>
				<Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" variant="primary" disabled={!email.trim() || isSubmitting}>
					{isSubmitting ? 'Updating...' : 'Update Contact'}
				</Button>
			</DialogFooter>
		</form>
	);
}
