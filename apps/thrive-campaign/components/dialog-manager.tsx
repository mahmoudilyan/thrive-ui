'use client';

import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent } from '@thrive/ui';
import { useCustomDialog } from '@/hooks/use-custom-dialog';

// Map dialog types to their dynamically imported components
// This allows you to add app-specific dialogs without touching the UI package
const dialogComponents: Record<string, ComponentType<any>> = {
	// ========================================
	// Common dialogs (wrapping @thrive/ui components)
	// ========================================
	// messageComposer: dynamic(() => import('./common-dialogs/message-composer-dialog'), {
	// 	ssr: false,
	// }),

	// ========================================
	// App-specific dialogs
	// ========================================
	// Campaign dialogs
	deleteCampaign: dynamic(() => import('./campaigns/delete-campaign-dialog'), { ssr: false }),
	createCampaign: dynamic(() => import('./campaigns/create-campaign-dialog'), { ssr: false }),

	// Add more dialogs here as needed:
	// editCampaign: dynamic(() => import('./campaigns/edit-campaign-dialog'), { ssr: false }),
	// createFolder: dynamic(() => import('./common/create-folder-dialog'), { ssr: false }),
};

interface DialogManagerProps {
	// Optional: override default dialog components
	customComponents?: Record<string, ComponentType<any>>;
}

export default function DialogManager({ customComponents }: DialogManagerProps) {
	const { dialogType, dialogProps, dialogConfig, closeDialog } = useCustomDialog();

	if (!dialogType) return null;

	// Merge custom components with default ones
	const allComponents = { ...dialogComponents, ...customComponents };
	const SpecificDialog = allComponents[dialogType];

	if (!SpecificDialog) {
		console.warn(`Dialog type "${dialogType}" not found in dialogComponents map`);
		return null;
	}

	// Extract size from config if provided, otherwise use default
	// Map config sizes to DialogContent supported sizes
	const configSize = dialogConfig?.size;
	const size: 'md' | 'lg' | 'xl' | 'full' =
		configSize === 'xs' || configSize === 'sm'
			? 'md'
			: (configSize as 'md' | 'lg' | 'xl' | 'full') || 'md';

	// Special handling for dialogs that need custom close behavior
	// Add dialog types here that shouldn't close on outside click
	const needsCustomClose = dialogConfig?.closeOnInteractOutside === false;

	return (
		<Dialog
			open={!!dialogType}
			onOpenChange={open => {
				if (!open && !needsCustomClose) {
					closeDialog();
				}
			}}
		>
			<DialogContent size={size} showCloseButton={dialogConfig?.closeOnEscape !== false}>
				<SpecificDialog onClose={closeDialog} {...dialogProps} />
			</DialogContent>
		</Dialog>
	);
}
