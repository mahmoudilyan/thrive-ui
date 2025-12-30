'use client';

import { useMemo } from 'react';
import { Contact } from '@/types/contacts/index';
import { Badge, cn, HoverCard, HoverCardContent, HoverCardTrigger, Text } from '@thrive/ui';
import { getContrastTextColor } from '@/utils/color-contrast';
import { shouldUseLightText } from '@thrive/ui';

interface ContactsTableCellProps {
	value: any;
	field: string;
	contact: Contact;
}

function StatusBadge({
	status,
}: {
	status: {
		color: string;
		label: string;
		score: number;
	};
}) {
	const isLightText = shouldUseLightText(
		parseInt(status.color.substring(1, 3), 16),
		parseInt(status.color.substring(3, 5), 16),
		parseInt(status.color.substring(5, 7), 16)
	);
	return (
		<Badge
			variant="normal"
			className="w-fit"
			style={{
				backgroundColor: status.color,
				color: isLightText ? 'var(--color-white)' : 'var(--color-ink-dark)',
			}}
			size="sm"
		>
			{status.label}
			<span className="ml-1 border-l border-black/20 pl-1">{status.score}</span>
		</Badge>
	);
}

function TagsBadge({ tags }: { tags: string[] }) {
	return (
		<div className="flex flex-wrap gap-space-xs">
			{tags.slice(0, 3).map((tag, index) => (
				<Badge key={index} variant="normal">
					{tag}
				</Badge>
			))}
			{tags.length > 3 && <Badge variant="normal">+{tags.length - 3} more</Badge>}
		</div>
	);
}

function Lists({ lists }: { lists: string[] }) {
	return (
		<div className="flex items-center gap-space-xs">
			<HoverCard>
				<HoverCardTrigger asChild>
					<Text
						variant="body-xs"
						className="cursor-pointer underline decoration-dotted underline-offset-2"
					>
						{`${lists.length} Lists`}
					</Text>
				</HoverCardTrigger>
				<HoverCardContent className="p-0">
					<div className="bg-bg p-space-md">
						<Text variant="heading-xs" className="font-semibold">
							Lists
						</Text>
					</div>
					<div className="max-h-48 overflow-y-auto">
						{lists.map((list, index) => (
							<div key={index} className="border-t p-space-md py-space-2xs">
								<Text variant="body-sm">{list}</Text>
							</div>
						))}
					</div>
				</HoverCardContent>
			</HoverCard>
		</div>
	);
}

export function ContactsTableCell({ value, field, contact }: ContactsTableCellProps) {
	// Handle data fields with data_ prefix
	if (field.startsWith('data_')) {
		const fieldName = field.replace('data_', '');

		switch (fieldName) {
			case 'leadscore':
				return (
					<StatusBadge
						status={{
							...contact.data_leadstatus,
							score: contact.data_leadscore,
						}}
					/>
				);
			case 'leadstatus':
				return null;
			case 'tags':
				return <TagsBadge tags={value || []} />;
			case 'assignedto':
				return <Text variant="body-sm">{value || '-'}</Text>;
			case 'contactid':
				return <Text variant="body-sm">{value || '-'}</Text>;
			default:
				return <Text variant="body-sm">{value || '-'}</Text>;
		}
	}

	// Handle regular fields
	switch (field) {
		case 'lists':
		case 'list_name':
			return <Lists lists={value || []} />;
		case 'email':
			return <Text variant="body-sm">{value}</Text>;
		case 'phone':
			return <Text variant="body-sm">{value || '-'}</Text>;
		case 'status':
			// Handle contact status (Active, Inactive, etc.)
			return <Text variant="body-sm">{value || '-'}</Text>;
		case 'registrationdate':
			// Format date if needed
			return <Text variant="body-sm">{value || '-'}</Text>;
		default:
			// Handle all custom fields (field719, field164333, etc.)
			return <Text variant="body-sm">{value || '-'}</Text>;
	}
}
