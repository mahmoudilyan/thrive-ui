'use client';

import { useState, useEffect } from 'react';
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Checkbox,
} from '@thrive/ui';
import { MdPersonAdd, MdList } from 'react-icons/md';
import type { Contact } from '@/types/contacts';

interface List {
	id: string;
	name: string;
}

interface AddToListDialogProps {
	onClose: () => void;
	contact: Contact;
	dialogTitle?: string;
	dialogDescription?: string;
	onSubmit?: (data: { contactId: string; listIds: string[]; action: 'add' | 'move' }) => void;
}

export default function AddToListDialog({
	onClose,
	contact,
	dialogTitle = 'Add to List',
	dialogDescription = 'Add contact to one or more lists',
	onSubmit,
}: AddToListDialogProps) {
	const [selectedLists, setSelectedLists] = useState<string[]>([]);
	const [availableLists, setAvailableLists] = useState<List[]>([]);
	const [action, setAction] = useState<'add' | 'move'>('add');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Load available lists
	useEffect(() => {
		const loadLists = async () => {
			try {
				const response = await fetch('/mock/lists-all.json');
				const listsData = await response.json();
				
				const transformedLists: List[] = listsData.map((list: any) => ({
					id: list.id,
					name: list.name,
				}));
				
				setAvailableLists(transformedLists);
			} catch (error) {
				console.error('Failed to load lists:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadLists();
	}, []);

	const handleListToggle = (listId: string) => {
		setSelectedLists(prev => 
			prev.includes(listId)
				? prev.filter(id => id !== listId)
				: [...prev, listId]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (selectedLists.length === 0) {
			return;
		}

		setIsSubmitting(true);

		try {
			if (onSubmit) {
				await onSubmit({
					contactId: contact.id,
					listIds: selectedLists,
					action,
				});
			}
			onClose();
		} catch (error) {
			console.error('Failed to add contact to lists:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20">
						<MdPersonAdd className="w-5 h-5 text-green-600 dark:text-green-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-4 py-4">
				{/* Contact Info */}
				<div className="bg-bg-subtle p-3 rounded-md">
					<div className="flex items-center gap-2 text-sm">
						<MdPersonAdd className="w-4 h-4 text-ink-light" />
						<span className="font-medium">{contact.email}</span>
						{contact.phone && (
							<span className="text-ink-light">• {contact.phone}</span>
						)}
					</div>
					{contact.list_name?.labels && contact.list_name.labels.length > 0 && (
						<div className="mt-2 text-xs text-ink-light">
							Currently in: {contact.list_name.labels.join(', ')}
						</div>
					)}
				</div>

				{/* Action Type */}
				<div>
					<label className="block text-sm font-medium text-ink mb-2">Action</label>
					<div className="space-y-2">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="action"
								value="add"
								checked={action === 'add'}
								onChange={e => setAction(e.target.value as 'add' | 'move')}
								className="text-blue-600"
							/>
							<span className="text-sm">Add to lists (keep existing lists)</span>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="action"
								value="move"
								checked={action === 'move'}
								onChange={e => setAction(e.target.value as 'add' | 'move')}
								className="text-blue-600"
							/>
							<span className="text-sm">Move to lists (replace existing lists)</span>
						</label>
					</div>
				</div>

				{/* List Selection */}
				<div>
					<label className="block text-sm font-medium text-ink mb-2">
						Select Lists {selectedLists.length > 0 && `(${selectedLists.length} selected)`}
					</label>
					
					{isLoading ? (
						<div className="text-center py-4">
							<div className="text-sm text-ink-light">Loading lists...</div>
						</div>
					) : (
						<div className="max-h-48 overflow-y-auto border border-border rounded-md">
							{availableLists.length === 0 ? (
								<div className="p-4 text-center text-sm text-ink-light">
									No lists available
								</div>
							) : (
								<div className="space-y-1 p-2">
									{availableLists.map(list => (
										<label
											key={list.id}
											className="flex items-center gap-3 p-2 hover:bg-bg-subtle rounded cursor-pointer"
										>
											<Checkbox
												checked={selectedLists.includes(list.id)}
												onCheckedChange={() => handleListToggle(list.id)}
											/>
											<div className="flex items-center gap-2 flex-1">
												<MdList className="w-4 h-4 text-ink-light" />
												<span className="text-sm">{list.name}</span>
											</div>
										</label>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				{selectedLists.length > 0 && (
					<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
						<div className="text-sm text-blue-800 dark:text-blue-200">
							{action === 'add' ? 'Adding' : 'Moving'} contact to {selectedLists.length} list(s)
						</div>
					</div>
				)}
			</div>

			<DialogFooter>
				<Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button 
					type="submit" 
					variant="primary" 
					disabled={selectedLists.length === 0 || isSubmitting}
				>
					{isSubmitting ? 'Processing...' : `${action === 'add' ? 'Add to' : 'Move to'} Lists`}
				</Button>
			</DialogFooter>
		</form>
	);
}
