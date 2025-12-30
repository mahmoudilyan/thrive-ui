'use client';

import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@thrive/ui';
import { MdDelete, MdWarning } from 'react-icons/md';

interface DeleteContactDialogProps {
	onClose: () => void;
	contactEmail: string;
	contactId: string;
	dialogTitle?: string;
	dialogDescription?: string;
	onConfirm?: (contactId: string) => void;
}

export default function DeleteContactDialog({
	onClose,
	contactEmail,
	contactId,
	dialogTitle = 'Delete Contact',
	dialogDescription = 'This action cannot be undone.',
	onConfirm,
}: DeleteContactDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleConfirm = async () => {
		setIsDeleting(true);

		try {
			if (onConfirm) {
				await onConfirm(contactId);
			}
			onClose();
		} catch (error) {
			console.error('Failed to delete contact:', error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20">
						<MdDelete className="w-5 h-5 text-red-600 dark:text-red-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="py-4">
				<div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
					<MdWarning className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
					<div className="space-y-2">
						<div className="text-sm font-medium text-red-800 dark:text-red-200">
							Are you sure you want to delete this contact?
						</div>
						<div className="text-sm text-red-700 dark:text-red-300">
							<div className="font-medium">Contact: {contactEmail}</div>
							<div className="mt-1">
								This will permanently remove the contact and all associated data from your account.
								This action cannot be undone.
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 p-3 bg-bg-subtle rounded-md">
					<div className="text-xs text-ink-light">
						<div>Contact ID: {contactId}</div>
						<div>Email: {contactEmail}</div>
					</div>
				</div>
			</div>

			<DialogFooter>
				<Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
					Cancel
				</Button>
				<Button type="button" variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
					{isDeleting ? 'Deleting...' : 'Delete Contact'}
				</Button>
			</DialogFooter>
		</>
	);
}
