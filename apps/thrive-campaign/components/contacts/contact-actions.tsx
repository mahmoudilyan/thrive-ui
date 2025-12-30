'use client';

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	IconButton,
} from '@thrive/ui';
import {
	MdMoreHoriz,
	MdEdit,
	MdDelete,
	MdEmail,
	MdPersonAdd,
	MdFileDownload,
} from 'react-icons/md';
import { useDialog } from '@thrive/ui';
import { Contact } from '@/types/contacts/index';

interface ContactActionsProps {
	contact: Contact;
}

export function ContactActions({ contact }: ContactActionsProps) {
	const { openDialog } = useDialog();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton
					variant="ghost"
					size="sm"
					aria-label="Contact actions"
					icon={<MdMoreHoriz className="size-4" />}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => openDialog('viewProfile', { contact })}>
					View Profile
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => openDialog('editContact', { contact })}>
					<MdEdit className="mr-2 size-4" />
					Edit Contact
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => openDialog('addToList', { contact })}>
					<MdPersonAdd className="mr-2 size-4" />
					Add to List
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => openDialog('sendEmail', { contact })}>
					<MdEmail className="mr-2 size-4" />
					Send Email
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => console.log('Export data', contact)}>
					<MdFileDownload className="mr-2 size-4" />
					Export Data
				</DropdownMenuItem>
				<DropdownMenuItem
					variant="destructive"
					onClick={() =>
						openDialog('deleteContact', {
							dialogTitle: `Delete "${contact.email}"?`,
							dialogDescription: 'This action cannot be undone.',
							contactEmail: contact.email,
							contactId: contact.id,
							onConfirm: (id: string) => {
								console.log('Deleting contact:', id);
								// Add your delete logic here
							},
						})
					}
				>
					<MdDelete className="mr-2 size-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
