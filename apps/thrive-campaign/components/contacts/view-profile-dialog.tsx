'use client';

import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Badge,
} from '@thrive/ui';
import { MdPerson, MdEmail, MdPhone, MdBusiness, MdCalendarToday } from 'react-icons/md';
import type { Contact } from '@/types/contacts';

interface ViewProfileDialogProps {
	onClose: () => void;
	contact: Contact;
	dialogTitle?: string;
	dialogDescription?: string;
}

export default function ViewProfileDialog({
	onClose,
	contact,
	dialogTitle = 'Contact Profile',
	dialogDescription = 'View contact details and information',
}: ViewProfileDialogProps) {
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'active':
				return 'success';
			case 'inactive':
				return 'secondary';
			case 'unsubscribed':
				return 'warning';
			case 'bounced':
				return 'destructive';
			case 'unconfirmed':
				return 'secondary';
			default:
				return 'secondary';
		}
	};

	return (
		<>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
						<MdPerson className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-6 py-4">
				{/* Basic Information */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-ink border-b border-border pb-1">
						Basic Information
					</h3>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-center gap-3">
							<MdEmail className="w-4 h-4 text-ink-light" />
							<div>
								<div className="text-sm font-medium text-ink">Email</div>
								<div className="text-sm text-ink-light">{contact.email}</div>
							</div>
						</div>

						{contact.phone && (
							<div className="flex items-center gap-3">
								<MdPhone className="w-4 h-4 text-ink-light" />
								<div>
									<div className="text-sm font-medium text-ink">Phone</div>
									<div className="text-sm text-ink-light">{contact.phone}</div>
								</div>
							</div>
						)}

						<div className="flex items-center gap-3">
							<MdCalendarToday className="w-4 h-4 text-ink-light" />
							<div>
								<div className="text-sm font-medium text-ink">Registration Date</div>
								<div className="text-sm text-ink-light">
									{new Date(contact.registrationdate).toLocaleDateString()}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="w-4 h-4 flex items-center justify-center">
								<div className="w-2 h-2 rounded-full bg-ink-light" />
							</div>
							<div>
								<div className="text-sm font-medium text-ink">Status</div>
								<Badge variant={getStatusColor(contact.status)}>{contact.status}</Badge>
							</div>
						</div>
					</div>
				</div>

				{/* List Information */}
				{contact.list_name && (
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-ink border-b border-border pb-1">
							List Information
						</h3>
						<div className="flex items-center gap-3">
							<MdBusiness className="w-4 h-4 text-ink-light" />
							<div>
								<div className="text-sm font-medium text-ink">Lists</div>
								<div className="text-sm text-ink-light">
									{contact.list_name.labels?.join(', ') || 'No lists assigned'}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Email Validation */}
				{contact.emailvalidation && (
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-ink border-b border-border pb-1">
							Email Validation
						</h3>
						<div className="flex items-center gap-3">
							<div 
								className="w-4 h-4 rounded-full"
								style={{ backgroundColor: contact.emailvalidation.background }}
							/>
							<div>
								<div className="text-sm font-medium text-ink">Validation Status</div>
								<div className="text-sm text-ink-light">
									{contact.emailvalidation.label} - {contact.emailvalidation.status}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Lead Information */}
				{contact.data_leadstatus && (
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-ink border-b border-border pb-1">
							Lead Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<div className="text-sm font-medium text-ink">Lead Score</div>
								<div className="text-sm text-ink-light">{contact.data_leadscore}</div>
							</div>
							<div>
								<div className="text-sm font-medium text-ink">Lead Status</div>
								<Badge style={{ backgroundColor: contact.data_leadstatus.color }}>
									{contact.data_leadstatus.label}
								</Badge>
							</div>
						</div>
					</div>
				)}

				{/* Custom Fields */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-ink border-b border-border pb-1">
						Additional Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{Object.entries(contact)
							.filter(([key, value]) => 
								!['id', 'indexid', 'email', 'phone', 'status', 'registrationdate', 
								  'list_name', 'actions', 'emailvalidation', 'picture', 'color', 
								  'letters', 'data_leadscore', 'data_leadstatus'].includes(key) && 
								value && 
								typeof value === 'string'
							)
							.map(([key, value]) => (
								<div key={key}>
									<div className="text-sm font-medium text-ink capitalize">
										{key.replace(/_/g, ' ')}
									</div>
									<div className="text-sm text-ink-light">{String(value)}</div>
								</div>
							))}
					</div>
				</div>
			</div>

			<DialogFooter>
				<Button variant="primary" onClick={onClose}>
					Close
				</Button>
			</DialogFooter>
		</>
	);
}
