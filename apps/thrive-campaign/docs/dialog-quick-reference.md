# Dialog System Quick Reference

## How to Use openDialog in Your App

### Basic Usage

```tsx
import { useCustomDialog } from '@/hooks/use-custom-dialog';

function YourComponent() {
	const { openDialog, closeDialog, closeAllDialogs } = useCustomDialog();

	const handleOpen = () => {
		openDialog(
			'dialogType', // 1. Dialog type (registered in dialog-manager.tsx)
			{
				/* props */
			}, // 2. Props to pass to the dialog component
			{
				/* config */
			} // 3. Optional configuration
		);
	};
}
```

## Two Types of Dialogs

### 1. App-Specific Dialogs (Your Own Content)

Create dialogs specific to your app in `components/`:

```tsx
// components/campaigns/my-dialog.tsx
'use client';

import { DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';

interface MyDialogProps {
	onClose: () => void;
	// Your custom props
}

export default function MyDialog({ onClose }: MyDialogProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>My Dialog</DialogTitle>
			</DialogHeader>
			<div className="py-4">{/* Your content */}</div>
			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="primary" onClick={onClose}>
					OK
				</Button>
			</DialogFooter>
		</>
	);
}
```

Register in `components/dialog-manager.tsx`:

```tsx
const dialogComponents: Record<string, ComponentType<any>> = {
	myDialog: dynamic(() => import('./campaigns/my-dialog'), { ssr: false }),
};
```

Use it:

```tsx
openDialog('myDialog', {
	/* your props */
});
```

### 2. Common Dialogs (From @thrive/ui Package)

Use shared dialogs from the UI package:

#### Step 1: Create a wrapper in your app

```tsx
// components/common-dialogs/message-composer-dialog.tsx
import { DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';
import MessageComposer from '@thrive/ui/components/common-dialogs/compose/message-composer';

export default function MessageComposerDialog({ onClose, ...props }) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Compose Message</DialogTitle>
			</DialogHeader>
			<div className="py-4">
				<MessageComposer {...props} />
			</div>
			<DialogFooter>
				<Button onClick={onClose}>Close</Button>
			</DialogFooter>
		</>
	);
}
```

#### Step 2: Register it

```tsx
const dialogComponents: Record<string, ComponentType<any>> = {
	messageComposer: dynamic(() => import('./common-dialogs/message-composer-dialog'), {
		ssr: false,
	}),
};
```

#### Step 3: Use it

```tsx
openDialog('messageComposer', {
	message: '',
	selectedChannels: ['twitter', 'facebook'],
	onSubmit: message => console.log(message),
});
```

## Configuration Options

```tsx
openDialog('dialogType', props, {
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full',
	closeOnEscape: true, // Can close with ESC key
	closeOnInteractOutside: false, // Prevent closing by clicking outside
	// ... other Radix Dialog options
});
```

## Available Components from @thrive/ui

Use these in your dialog components:

```tsx
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Input,
} from '@thrive/ui';
```

## Button Variants

Available button variants:

- `primary` - Blue primary button
- `secondary` - Gray secondary button with border
- `destructive` - Red destructive button
- `ghost` - Transparent with hover
- `ghost-body` - Transparent with body background on hover
- `link` - Text link style

## File Structure

```
apps/thrive-campaign/
├── components/
│   ├── dialog-manager.tsx          ← Register all dialogs here
│   ├── campaigns/
│   │   ├── delete-campaign-dialog.tsx
│   │   └── create-campaign-dialog.tsx
│   └── common-dialogs/             ← Wrappers for UI package dialogs
│       └── message-composer-dialog.tsx
├── providers/
│   └── dialog-provider.tsx         ← Already set up
└── hooks/
    └── use-custom-dialog.tsx       ← Already set up
```

## Complete Example

```tsx
'use client';

import { Button } from '@thrive/ui';
import { useCustomDialog } from '@/hooks/use-custom-dialog';

export function MyComponent() {
	const { openDialog } = useCustomDialog();

	return (
		<Button
			onClick={() => {
				openDialog(
					'deleteCampaign',
					{
						campaignId: '123',
						campaignName: 'My Campaign',
						onConfirm: id => {
							console.log('Deleting:', id);
						},
					},
					{
						size: 'md',
						closeOnEscape: true,
					}
				);
			}}
		>
			Delete Campaign
		</Button>
	);
}
```

## Key Points

✅ **DialogManager** is already in your provider tree (in `components/ui/provider.tsx`)

✅ **DialogProvider** provides the context for all dialogs

✅ **useCustomDialog** hook gives you access to `openDialog()`, `closeDialog()`, `closeAllDialogs()`

✅ Create app-specific dialogs in `components/`

✅ Wrap UI package dialogs in `components/common-dialogs/`

✅ Register all dialogs in `components/dialog-manager.tsx`

✅ Use `@thrive/ui` components (DialogHeader, DialogFooter, Button, etc.) inside your dialogs
