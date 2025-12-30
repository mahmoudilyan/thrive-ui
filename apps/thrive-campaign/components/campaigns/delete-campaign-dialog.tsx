'use client';

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@thrive/ui';
import { MdWarning } from 'react-icons/md';

interface DeleteCampaignDialogProps {
	onClose: () => void;
	dialogTitle?: string;
	dialogDescription?: string;
	campaignName?: string;
	campaignId?: string;
	onConfirm?: (campaignId: string) => void;
}

export default function DeleteCampaignDialog({
	onClose,
	dialogTitle = 'Delete Campaign',
	dialogDescription = 'This action cannot be undone.',
	campaignName = 'this campaign',
	campaignId = '',
	onConfirm,
}: DeleteCampaignDialogProps) {
	const handleDelete = () => {
		if (onConfirm && campaignId) {
			onConfirm(campaignId);
		}
		onClose();
	};

	return (
		<>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20">
						<MdWarning className="w-5 h-5 text-red-600 dark:text-red-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="py-4">
				<p className="text-sm text-ink-light">
					Are you sure you want to delete{' '}
					<span className="font-semibold text-ink">{campaignName}</span>? This will permanently
					remove the campaign and all associated data.
				</p>
			</div>

			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="destructive" onClick={handleDelete}>
					Delete Campaign
				</Button>
			</DialogFooter>
		</>
	);
}
