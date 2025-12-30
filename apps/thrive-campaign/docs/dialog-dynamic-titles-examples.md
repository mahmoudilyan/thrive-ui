# Dynamic Dialog Titles & Descriptions

## Usage

All dialog components can accept `dialogTitle` and `dialogDescription` as props to customize the dialog content dynamically.

## Basic Example

```tsx
import { useDialog } from '@thrive/ui';

function MyComponent() {
	const { openDialog } = useDialog();

	const handleDelete = () => {
		openDialog('deleteCampaign', {
			dialogTitle: 'Delete Campaign?',
			dialogDescription: 'This action cannot be undone',
			campaignName: 'Summer Sale',
			campaignId: '123',
			onConfirm: id => console.log('Deleted:', id),
		});
	};

	return <Button onClick={handleDelete}>Delete</Button>;
}
```

## Dynamic Title Based on Data

```tsx
// Example 1: Include entity name in title
const campaign = { id: '123', name: 'Summer Sale', status: 'draft' };

openDialog('deleteCampaign', {
	dialogTitle: `Delete "${campaign.name}"?`,
	dialogDescription: 'This will permanently remove the campaign.',
	campaignName: campaign.name,
	campaignId: campaign.id,
});

// Example 2: Different title based on status
openDialog('deleteCampaign', {
	dialogTitle: campaign.status === 'published' ? 'Unpublish and Delete?' : 'Delete Draft Campaign?',
	dialogDescription:
		campaign.status === 'published'
			? 'This campaign is currently live. It will be unpublished before deletion.'
			: 'This draft will be permanently deleted.',
	campaignName: campaign.name,
	campaignId: campaign.id,
});

// Example 3: Bulk action titles
const selectedCount = 5;
openDialog('deleteCampaign', {
	dialogTitle: `Delete ${selectedCount} Campaigns?`,
	dialogDescription: `You are about to delete ${selectedCount} campaigns. This action cannot be undone.`,
	campaignName: `${selectedCount} campaigns`,
	campaignId: 'bulk',
});
```

## Conditional Titles

```tsx
// Based on user permissions
const canRestore = true;

openDialog('deleteCampaign', {
	dialogTitle: canRestore ? 'Move to Trash?' : 'Delete Permanently?',
	dialogDescription: canRestore
		? 'You can restore this campaign from trash within 30 days.'
		: 'This campaign will be permanently deleted and cannot be recovered.',
	campaignName: campaign.name,
	campaignId: campaign.id,
});

// Based on folder/location
const isFolder = true;

openDialog('deleteCampaign', {
	dialogTitle: isFolder ? 'Delete Folder?' : 'Delete Campaign?',
	dialogDescription: isFolder
		? 'All campaigns in this folder will be moved to the root.'
		: 'This campaign will be permanently removed.',
	campaignName: item.name,
	campaignId: item.id,
});
```

## Without Title or Description

```tsx
// Omit dialogTitle to use the default
openDialog('deleteCampaign', {
	// Uses default: "Delete Campaign"
	campaignName: campaign.name,
	campaignId: campaign.id,
});

// Or set to empty string for no title
openDialog('deleteCampaign', {
	dialogTitle: '',
	dialogDescription: '',
	campaignName: campaign.name,
	campaignId: campaign.id,
});
```

## Create Dialog with Dynamic Titles

```tsx
// Different titles for create vs duplicate
const isDuplicate = true;
const existingCampaign = { name: 'Summer Sale' };

openDialog('createCampaign', {
	dialogTitle: isDuplicate ? 'Duplicate Campaign' : 'Create New Campaign',
	dialogDescription: isDuplicate
		? `Create a copy of "${existingCampaign.name}"`
		: 'Enter the details for your new campaign',
	onSubmit: data => {
		console.log('Created:', data);
	},
});

// Template-based creation
const template = { name: 'Newsletter Template' };

openDialog('createCampaign', {
	dialogTitle: `Create from "${template.name}"`,
	dialogDescription: 'This will create a new campaign using this template',
	onSubmit: data => {
		console.log('Created from template:', data);
	},
});
```

## Full Example in Context

```tsx
'use client';

import { useDialog } from '@thrive/ui';
import { Button } from '@thrive/ui';

interface Campaign {
	id: string;
	name: string;
	status: 'draft' | 'published' | 'archived';
	type: 'campaign' | 'folder';
}

export function CampaignActions({ campaign }: { campaign: Campaign }) {
	const { openDialog } = useDialog();

	const handleDelete = () => {
		// Build dynamic title and description
		let title = 'Delete Campaign?';
		let description = 'This action cannot be undone.';

		if (campaign.type === 'folder') {
			title = 'Delete Folder?';
			description = 'All campaigns in this folder will be moved to the root.';
		} else if (campaign.status === 'published') {
			title = 'Delete Published Campaign?';
			description =
				'This campaign is currently active. It will be immediately removed from all channels.';
		} else if (campaign.status === 'archived') {
			title = 'Delete Archived Campaign?';
			description = 'This archived campaign will be permanently deleted.';
		}

		openDialog('deleteCampaign', {
			dialogTitle: title,
			dialogDescription: description,
			campaignName: campaign.name,
			campaignId: campaign.id,
			onConfirm: async id => {
				console.log('Deleting:', id);
				// Your delete API call
			},
		});
	};

	const handleDuplicate = () => {
		openDialog('createCampaign', {
			dialogTitle: `Duplicate "${campaign.name}"`,
			dialogDescription: 'Create a copy of this campaign with a new name',
			onSubmit: async data => {
				console.log('Duplicating:', data);
				// Your duplicate API call
			},
		});
	};

	return (
		<div className="flex gap-2">
			<Button onClick={handleDuplicate}>Duplicate</Button>
			<Button variant="destructive" onClick={handleDelete}>
				Delete
			</Button>
		</div>
	);
}
```

## Best Practices

✅ **Use descriptive titles** that clearly state what will happen

```tsx
dialogTitle: `Delete "${campaignName}"?`; // Good
dialogTitle: 'Delete?'; // Too vague
```

✅ **Include important context** in the description

```tsx
dialogDescription: 'This campaign is published. It will be removed from all channels.'; // Good
dialogDescription: 'Are you sure?'; // Not helpful
```

✅ **Use question marks** for confirmation dialogs

```tsx
dialogTitle: 'Delete Campaign?'; // Good for confirmation
dialogTitle: 'Create New Campaign'; // Good for creation (no question mark)
```

✅ **Keep titles concise** - put details in the description

```tsx
dialogTitle: 'Delete Campaign?';
dialogDescription: 'This will permanently remove "Summer Sale" and all associated data.';
```

✅ **Use dynamic data** in titles when relevant

```tsx
dialogTitle: `Delete ${selectedCount} Campaigns?`; // Shows count
dialogTitle: `Edit "${campaign.name}"`; // Shows name
```

## Prop Naming Convention

All dialog components should use these specific prop names:

- `dialogTitle` - The main title of the dialog
- `dialogDescription` - Supporting text below the title

This avoids conflicts with other potential props like `title`, `name`, etc.

```tsx
interface YourDialogProps {
	onClose: () => void;
	dialogTitle?: string; // ✅ Use this
	dialogDescription?: string; // ✅ Use this
	// ... your other props
}

export default function YourDialog({
	onClose,
	dialogTitle = 'Default Title',
	dialogDescription = 'Default description',
	...otherProps
}: YourDialogProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>{dialogTitle}</DialogTitle>
				<DialogDescription>{dialogDescription}</DialogDescription>
			</DialogHeader>
			{/* rest of dialog */}
		</>
	);
}
```

## Summary

- ✅ Use `dialogTitle` and `dialogDescription` props
- ✅ Pass them through `openDialog()` second parameter
- ✅ Provide sensible defaults in your dialog component
- ✅ Make titles dynamic based on context
- ✅ Keep titles concise, descriptions detailed
- ✅ Use template literals for dynamic content
