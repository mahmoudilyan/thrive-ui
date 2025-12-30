'use client';

import { Button } from '@thrive/ui';
import { useDialog } from '@thrive/ui';
import { MdAdd, MdDelete, MdMessage } from 'react-icons/md';

/**
 * Example component showing how to use the dialog system
 *
 * This demonstrates:
 * 1. App-specific dialogs (deleteCampaign, createCampaign)
 * 2. Common dialogs from UI package (messageComposer)
 * 3. Different dialog configurations
 */
export function DialogUsageExample() {
	const { openDialog } = useDialog();

	// Example 1: Open a simple delete confirmation dialog
	const handleDeleteCampaign = () => {
		openDialog(
			'deleteCampaign',
			{
				campaignId: '123',
				campaignName: 'Summer Sale Campaign',
				onConfirm: (id: string) => {
					console.log('Deleting campaign:', id);
					// Your delete API call here
				},
			},
			{
				size: 'md',
				closeOnEscape: true,
				closeOnInteractOutside: true,
			}
		);
	};

	// Example 2: Open a create campaign form dialog
	const handleCreateCampaign = () => {
		openDialog(
			'createCampaign',
			{
				onSubmit: async (data: { name: string; description: string }) => {
					console.log('Creating campaign:', data);
					// Your create API call here
					// await api.createCampaign(data);
				},
			},
			{
				size: 'lg',
				closeOnEscape: true,
				closeOnInteractOutside: false, // Prevent accidental close on forms
			}
		);
	};

	// Example 3: Open campaign settings dialog (large with tabs)
	const handleCampaignSettings = () => {
		openDialog(
			'campaignSettings',
			{
				campaignId: '123',
				initialSettings: {
					replyTo: 'noreply@example.com',
					from: 'info@example.com',
					fromName: 'https://www.example.com',
					preventAutoReplies: true,
				},
				onSave: (settings: any) => {
					console.log('Saving settings:', settings);
					// Your save API call here
				},
			},
			{
				size: 'xl',
				closeOnEscape: true,
				closeOnInteractOutside: false,
			}
		);
	};

	return (
		<div className="p-6 space-y-4">
			<h2 className="text-2xl font-bold text-ink">Dialog System Examples</h2>

			<div className="space-y-3">
				<div>
					<h3 className="text-sm font-semibold text-ink-light mb-2">App-Specific Dialogs</h3>
					<div className="flex gap-2">
						<Button variant="primary" leftIcon={<MdAdd />} onClick={handleCreateCampaign}>
							Create Campaign
						</Button>
						<Button variant="destructive" leftIcon={<MdDelete />} onClick={handleDeleteCampaign}>
							Delete Campaign
						</Button>
					</div>
				</div>

				<div>
					<h3 className="text-sm font-semibold text-ink-light mb-2">Settings Dialogs (Large)</h3>
					<div className="flex gap-2">
						<Button variant="primary" leftIcon={<MdMessage />} onClick={handleCampaignSettings}>
							Campaign Settings
						</Button>
					</div>
				</div>
			</div>

			<div className="mt-6 p-4 bg-panel rounded-lg border border-border">
				<h3 className="text-sm font-semibold text-ink mb-2">How it works:</h3>
				<ul className="text-sm text-ink-light space-y-1 list-disc list-inside">
					<li>
						Use <code className="text-xs bg-bg px-1 py-0.5 rounded">useDialog()</code> hook from{' '}
						<code className="text-xs bg-bg px-1 py-0.5 rounded">@thrive/ui</code> to access{' '}
						<code className="text-xs bg-bg px-1 py-0.5 rounded">openDialog</code>
					</li>
					<li>
						Call{' '}
						<code className="text-xs bg-bg px-1 py-0.5 rounded">
							openDialog(type, props, config)
						</code>{' '}
						to open any registered dialog
					</li>
					<li>
						App-specific dialogs are in{' '}
						<code className="text-xs bg-bg px-1 py-0.5 rounded">components/</code>
					</li>
					<li>
						Common dialogs are in{' '}
						<code className="text-xs bg-bg px-1 py-0.5 rounded">@thrive/ui</code> package
					</li>
					<li>
						All dialogs are registered in{' '}
						<code className="text-xs bg-bg px-1 py-0.5 rounded">components/dialogs/index.tsx</code>
					</li>
				</ul>
			</div>
		</div>
	);
}
