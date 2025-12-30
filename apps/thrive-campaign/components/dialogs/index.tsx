'use client';

import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { DialogManagerConfig } from '@thrive/ui';

/**
 * App-specific dialog configuration
 *
 * This config object contains:
 * 1. Dialog registry - maps dialog type strings to their components
 * 2. Default config - default settings applied to all dialogs
 *
 * Register all dialogs used in this app here.
 * The dialogs are dynamically imported for code splitting.
 */
export const appDialogConfig: DialogManagerConfig = {
	// Dialog registry
	dialogs: {
		// ========================================
		// Campaign dialogs
		// ========================================
		deleteCampaign: dynamic(() => import('../campaigns/delete-campaign-dialog'), { ssr: false }),
		createCampaign: dynamic(() => import('../campaigns/create-campaign-dialog'), { ssr: false }),
		campaignSettings: dynamic(() => import('../campaigns/campaign-general-settings-dialog'), {
			ssr: false,
		}),

		// ========================================
		// Template dialogs
		// ========================================
		templatePreview: dynamic(
			() =>
				import('../campaigns/template-preview-dialog').then(mod => ({
					default: mod.TemplatePreviewDialog,
				})),
			{
				ssr: false,
			}
		),

		// ========================================
		// Common dialogs (wrapping @thrive/ui components)
		// ========================================
		// messageComposer: dynamic(() => import('../common-dialogs/message-composer-dialog'), {
		// 	ssr: false,
		// }),

		// ========================================
		// Contact dialogs
		// ========================================
		createNewContact: dynamic(() => import('../contacts/create-new-contact-dialog'), {
			ssr: false,
		}),
		viewProfile: dynamic(() => import('../contacts/view-profile-dialog'), { ssr: false }),
		editContact: dynamic(() => import('../contacts/edit-contact-dialog'), { ssr: false }),
		addToList: dynamic(() => import('../contacts/add-to-list-dialog'), { ssr: false }),
		sendEmail: dynamic(() => import('../contacts/send-email-dialog'), { ssr: false }),
		deleteContact: dynamic(() => import('../contacts/delete-contact-dialog'), { ssr: false }),

		// ========================================
		// Add more dialogs here as needed
		// ========================================
		// editCampaign: dynamic(() => import('../campaigns/edit-campaign-dialog'), { ssr: false }),
		// createFolder: dynamic(() => import('../folders/create-folder-dialog'), { ssr: false }),
		// renameFolder: dynamic(() => import('../folders/rename-folder-dialog'), { ssr: false }),
		// deleteFolder: dynamic(() => import('../folders/delete-folder-dialog'), { ssr: false }),
		// campaignDetails: dynamic(() => import('../campaigns/campaign-details-dialog'), { ssr: false }),
	},

	// Default configuration for all dialogs
	defaultConfig: {
		size: 'md',
		closeOnEscape: true,
		closeOnInteractOutside: true,
	},
};
