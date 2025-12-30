'use client';

import { useState } from 'react';
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Input,
} from '@thrive/ui';
import { MdCampaign } from 'react-icons/md';

interface CreateCampaignDialogProps {
	onClose: () => void;
	dialogTitle?: string;
	dialogDescription?: string;
	onSubmit?: (data: { name: string; description: string }) => void;
}

export default function CreateCampaignDialog({
	onClose,
	dialogTitle = 'Create New Campaign',
	dialogDescription = 'Enter the details for your new campaign',
	onSubmit,
}: CreateCampaignDialogProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			return;
		}

		setIsSubmitting(true);

		try {
			if (onSubmit) {
				await onSubmit({ name, description });
			}
			onClose();
		} catch (error) {
			console.error('Failed to create campaign:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
						<MdCampaign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-4 py-4">
				<div>
					<label htmlFor="campaign-name" className="block text-sm font-medium text-ink mb-1">
						Campaign Name *
					</label>
					<Input
						id="campaign-name"
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="Enter campaign name"
						required
						autoFocus
					/>
				</div>

				<div>
					<label htmlFor="campaign-description" className="block text-sm font-medium text-ink mb-1">
						Description
					</label>
					<textarea
						id="campaign-description"
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder="Enter campaign description (optional)"
						rows={3}
						className="w-full px-3 py-2 border border-border rounded-md bg-bg text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<DialogFooter>
				<Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" variant="primary" disabled={!name.trim() || isSubmitting}>
					{isSubmitting ? 'Creating...' : 'Create Campaign'}
				</Button>
			</DialogFooter>
		</form>
	);
}
