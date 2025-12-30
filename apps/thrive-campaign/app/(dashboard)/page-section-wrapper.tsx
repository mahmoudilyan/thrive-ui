'use client';

import { PageSection, useDialog, type PageSectionProps } from '@thrive/ui';
import { useRouter } from 'next/navigation';

// Define available action types that can be used from server components
type ActionType =
	| 'createCampaign'
	| 'createContact'
	| 'exportContactsHistory'
	| 'campaignSettings'
	| 'manageFolders'
	| 'importContacts'
	| 'exportContacts'
	| 'listSettings'
	| 'listPreview'
	| 'listEmbedCode'
	| 'listStats'
	| 'listExportHistory';

interface SerializableAction {
	label: string;
	href?: string;
	action?: ActionType; // Use action identifier instead of onClick
	icon?: React.ReactNode;
}

interface PageSectionWrapperProps
	extends Omit<PageSectionProps, 'otherActions' | 'primaryAction' | 'secondaryActions'> {
	primaryAction?: SerializableAction;
	secondaryActions?: SerializableAction[];
	otherActions?: SerializableAction[];
}

export function PageSectionWrapper({
	primaryAction,
	secondaryActions,
	otherActions,
	...props
}: PageSectionWrapperProps) {
	const { openDialog } = useDialog();
	const router = useRouter();
	// Map action types to actual onClick handlers
	const getActionHandler = (actionType?: ActionType) => {
		if (!actionType) return undefined;

		const actionHandlers: Record<ActionType, () => void> = {
			campaignSettings: () => openDialog('campaignSettings', {}),
			createCampaign: () => router.push('/campaigns/create'),
			manageFolders: () => openDialog('manageFolders', {}),
			createContact: () => openDialog('createNewContact', {}),
			exportContactsHistory: () => router.push('/contacts/export-history'),
			exportContacts: () => openDialog('exportContacts', {}),
			importContacts: () => router.push('/campaigns/import-contacts'),
			listSettings: () => router.push('/lists/settings'),
			listPreview: () => router.push('/lists/preview'),
			listEmbedCode: () => openDialog('listEmbedCode', {}),
			listStats: () => router.push('/lists/stats'),
			listExportHistory: () => router.push('/lists/export-history'),
		};

		return actionHandlers[actionType];
	};

	// Convert serializable actions to actual PageSection actions
	const convertAction = (action?: SerializableAction) => {
		if (!action) return undefined;
		return {
			label: action.label,
			onClick: getActionHandler(action.action),
			icon: action.icon,
		};
	};

	const convertActions = (actions?: SerializableAction[]) => {
		return actions?.map(convertAction);
	};

	return (
		<PageSection
			{...props}
			primaryAction={convertAction(primaryAction)}
			secondaryActions={convertActions(secondaryActions)}
			otherActions={convertActions(otherActions)}
		/>
	);
}
