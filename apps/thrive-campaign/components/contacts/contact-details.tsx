'use client';

import { Contact } from '@/types/contacts/index';
import { Text, Badge } from '@thrive/ui';

interface ContactDetailsProps {
	email: string;
	phone?: string;
	status: Contact['status'];
	registrationDate: string;
	emailValidation?: Contact['emailvalidation'];
}

export function ContactDetails({
	email,
	phone,
	status,
	registrationDate,
	emailValidation,
}: ContactDetailsProps) {
	const getStatusVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case 'active':
				return 'success';
			case 'inactive':
				return 'secondary';
			case 'unsubscribed':
				return 'warning';
			case 'bounced':
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	const getEmailValidationVariant = (status: string) => {
		switch (status) {
			case 'verified':
				return 'success';
			case 'invalid':
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<Text variant="body-sm" className="font-medium">
					{email}
				</Text>
				{emailValidation && (
					<Badge variant={getEmailValidationVariant(emailValidation.status)} size="sm">
						{emailValidation.label}
					</Badge>
				)}
			</div>
			{phone && (
				<Text variant="body-xs" className="text-ink-light">
					{phone}
				</Text>
			)}
			<div className="flex items-center gap-2">
				<Badge variant={getStatusVariant(status)} size="sm">
					{status}
				</Badge>
				<Text variant="body-xs" className="text-ink-light">
					Registered: {new Date(registrationDate).toLocaleDateString()}
				</Text>
			</div>
		</div>
	);
}
