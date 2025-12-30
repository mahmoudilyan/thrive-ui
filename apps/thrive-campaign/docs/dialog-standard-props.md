# Standard Dialog Props

## Overview

**All dialogs automatically receive `dialogTitle` and `dialogDescription` props** from the DialogManager. You don't need to add them to your dialog's interface - they're always available!

## How It Works

The `DialogManager` in `@thrive/ui` automatically extracts and passes these props to every dialog:

```tsx
// In DialogManager (you don't need to do this)
const { dialogTitle, dialogDescription, ...remainingProps } = dialogProps;

<SpecificDialog
	onClose={closeDialog}
	dialogTitle={dialogTitle} // ✅ Automatically passed
	dialogDescription={dialogDescription} // ✅ Automatically passed
	{...remainingProps} // Your custom props
/>;
```

## Using in Your Dialogs

### Option 1: Use TypeScript Interface (Recommended)

Add them to your interface for TypeScript autocomplete and type safety:

```tsx
interface MyDialogProps {
	onClose: () => void;
	dialogTitle?: string; // Optional - automatically provided
	dialogDescription?: string; // Optional - automatically provided
	// Your custom props
	myCustomProp: string;
}

export default function MyDialog({
	onClose,
	dialogTitle = 'Default Title',
	dialogDescription,
	myCustomProp,
}: MyDialogProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>{dialogTitle}</DialogTitle>
				{dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
			</DialogHeader>
			{/* Rest of your dialog */}
		</>
	);
}
```

### Option 2: Use Without Interface

The props are available even if not in your interface (TypeScript will accept them):

```tsx
export default function MyDialog(props: any) {
	const { onClose, dialogTitle = 'Default Title', dialogDescription, ...otherProps } = props;

	return (
		<>
			{dialogTitle && (
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					{dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
				</DialogHeader>
			)}
			{/* Rest of your dialog */}
		</>
	);
}
```

## Calling Dialogs

Simply pass `dialogTitle` and `dialogDescription` when opening any dialog:

```tsx
import { useDialog } from '@thrive/ui';

function MyComponent() {
	const { openDialog } = useDialog();

	return (
		<Button
			onClick={() => {
				openDialog('anyDialog', {
					dialogTitle: 'My Dynamic Title',
					dialogDescription: 'My dynamic description',
					// ... other props
				});
			}}
		>
			Open Dialog
		</Button>
	);
}
```

## Complete Example

### 1. Create Dialog Component

```tsx
// components/campaigns/edit-campaign-dialog.tsx
'use client';

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@thrive/ui';
import { useState } from 'react';

interface EditCampaignDialogProps {
	onClose: () => void;
	dialogTitle?: string; // ✅ Automatically provided
	dialogDescription?: string; // ✅ Automatically provided
	campaignId: string;
	initialName?: string;
	onSave?: (name: string) => void;
}

export default function EditCampaignDialog({
	onClose,
	dialogTitle = 'Edit Campaign',
	dialogDescription = 'Update campaign details',
	campaignId,
	initialName = '',
	onSave,
}: EditCampaignDialogProps) {
	const [name, setName] = useState(initialName);

	const handleSave = () => {
		if (onSave) {
			onSave(name);
		}
		onClose();
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>{dialogTitle}</DialogTitle>
				{dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
			</DialogHeader>

			<div className="py-4 space-y-4">
				<Input value={name} onChange={e => setName(e.target.value)} placeholder="Campaign name" />
			</div>

			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleSave}>
					Save Changes
				</Button>
			</DialogFooter>
		</>
	);
}
```

### 2. Register Dialog

```tsx
// components/dialogs/index.tsx
import dynamic from 'next/dynamic';
import type { DialogManagerConfig } from '@thrive/ui';

export const appDialogConfig: DialogManagerConfig = {
	dialogs: {
		editCampaign: dynamic(() => import('../campaigns/edit-campaign-dialog'), {
			ssr: false,
		}),
	},
	defaultConfig: {
		/* ... */
	},
};
```

### 3. Use with Different Titles

```tsx
// components/campaigns/campaign-list.tsx
import { useDialog } from '@thrive/ui';

function CampaignList() {
	const { openDialog } = useDialog();

	// Example 1: Edit mode
	const handleEdit = (campaign: Campaign) => {
		openDialog('editCampaign', {
			dialogTitle: `Edit "${campaign.name}"`,
			dialogDescription: 'Make changes to your campaign',
			campaignId: campaign.id,
			initialName: campaign.name,
			onSave: name => console.log('Saved:', name),
		});
	};

	// Example 2: Rename mode
	const handleRename = (campaign: Campaign) => {
		openDialog('editCampaign', {
			dialogTitle: 'Rename Campaign',
			dialogDescription: 'Choose a new name for this campaign',
			campaignId: campaign.id,
			initialName: campaign.name,
			onSave: name => console.log('Renamed:', name),
		});
	};

	// Example 3: Duplicate mode
	const handleDuplicate = (campaign: Campaign) => {
		openDialog('editCampaign', {
			dialogTitle: `Duplicate "${campaign.name}"`,
			dialogDescription: 'Create a copy with a new name',
			campaignId: campaign.id,
			initialName: `${campaign.name} (Copy)`,
			onSave: name => console.log('Duplicated:', name),
		});
	};

	return (
		<div>
			<Button onClick={() => handleEdit(campaign)}>Edit</Button>
			<Button onClick={() => handleRename(campaign)}>Rename</Button>
			<Button onClick={() => handleDuplicate(campaign)}>Duplicate</Button>
		</div>
	);
}
```

## Benefits

✅ **No Boilerplate** - Don't need to add these props to every dialog

✅ **Consistent API** - All dialogs work the same way

✅ **Type Safe** - Full TypeScript support when you add them to interface

✅ **Flexible** - Can ignore them if you want a completely custom dialog

✅ **DRY** - Define once in DialogManager, use everywhere

## Pattern: Dialogs Without Standard Header

If your dialog needs a completely custom layout, you can simply ignore these props:

```tsx
interface CustomDialogProps {
	onClose: () => void;
	// Don't include dialogTitle/dialogDescription
	customContent: ReactNode;
}

export default function CustomDialog({ onClose, customContent }: CustomDialogProps) {
	// Completely custom layout - no DialogHeader
	return (
		<div className="custom-dialog-layout">
			{customContent}
			<button onClick={onClose}>Close</button>
		</div>
	);
}
```

The props are still passed, but you're not required to use them!

## Pattern: Conditional Header

```tsx
export default function FlexibleDialog({
	onClose,
	dialogTitle,
	dialogDescription,
	content,
}: FlexibleDialogProps) {
	return (
		<>
			{/* Only render header if title is provided */}
			{dialogTitle && (
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					{dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
				</DialogHeader>
			)}

			<div className="py-4">{content}</div>

			<DialogFooter>
				<Button onClick={onClose}>Close</Button>
			</DialogFooter>
		</>
	);
}
```

## Migration from Old Dialogs

If you have existing dialogs that manually define these props:

### Before

```tsx
interface MyDialogProps {
	onClose: () => void;
	title?: string; // ❌ Non-standard name
	description?: string; // ❌ Non-standard name
}
```

### After

```tsx
interface MyDialogProps {
	onClose: () => void;
	dialogTitle?: string; // ✅ Standard name (automatically provided)
	dialogDescription?: string; // ✅ Standard name (automatically provided)
}
```

Just rename `title` → `dialogTitle` and `description` → `dialogDescription`, and they'll work automatically!

## Summary

**Key Points:**

1. ✅ `dialogTitle` and `dialogDescription` are **automatically available** in ALL dialogs
2. ✅ Add them to your interface for TypeScript support (optional but recommended)
3. ✅ Provide default values in your component if desired
4. ✅ Pass them through `openDialog()` to customize dynamically
5. ✅ Completely optional - ignore them for custom layouts

**This is now the standard way to handle titles in all dialogs!** 🎉
