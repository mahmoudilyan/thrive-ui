# Dialog System Usage Examples

This guide shows you how to use the dialog system in the thrive-campaign app.

## Overview

The dialog system consists of:

- **DialogProvider**: Context provider that manages dialog state
- **DialogManager**: Component that renders the active dialog
- **useCustomDialog**: Hook to interact with the dialog system
- **Dialog Components**: From `@thrive/ui` package (Dialog, DialogContent, DialogHeader, etc.)

## Basic Usage

### 1. Using `openDialog` in a Component

```tsx
'use client';

import { Button } from '@thrive/ui';
import { useCustomDialog } from '@/hooks/use-custom-dialog';

export default function CampaignActions() {
	const { openDialog } = useCustomDialog();

	// Open a simple delete confirmation dialog
	const handleDelete = (campaignId: string, campaignName: string) => {
		openDialog(
			'deleteCampaign',
			{
				campaignId,
				campaignName,
				onConfirm: (id: string) => {
					console.log('Deleting campaign:', id);
					// Your delete logic here
				},
			},
			{
				size: 'md',
				closeOnEscape: true,
				closeOnInteractOutside: true,
			}
		);
	};

	// Open a create campaign dialog
	const handleCreate = () => {
		openDialog(
			'createCampaign',
			{
				onSubmit: async (data: { name: string; description: string }) => {
					console.log('Creating campaign:', data);
					// Your create logic here
				},
			},
			{
				size: 'lg',
				closeOnEscape: true,
				closeOnInteractOutside: false, // Prevent closing when clicking outside
			}
		);
	};

	return (
		<div className="flex gap-2">
			<Button onClick={handleCreate}>Create Campaign</Button>
			<Button variant="outline" onClick={() => handleDelete('123', 'Summer Sale Campaign')}>
				Delete Campaign
			</Button>
		</div>
	);
}
```

### 2. Dialog Configuration Options

The third parameter of `openDialog` accepts configuration options:

```tsx
openDialog(
	'dialogType',
	{
		/* props */
	},
	{
		// Size of the dialog
		size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full',

		// Whether the dialog can be closed with Escape key
		closeOnEscape: true,

		// Whether the dialog closes when clicking outside
		closeOnInteractOutside: true,

		// Focus management
		trapFocus: true,

		// Prevent scrolling the body when dialog is open
		preventScroll: true,

		// Accessibility
		role: 'dialog' | 'alertdialog',
		'aria-label': 'Dialog description',
	}
);
```

### 3. Creating Your Own Dialog Component

Create a new dialog component in the appropriate folder:

```tsx
// components/campaigns/your-dialog.tsx
'use client';

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@thrive/ui';

interface YourDialogProps {
	onClose: () => void;
	// Add your custom props here
	title?: string;
	message?: string;
}

export default function YourDialog({
	onClose,
	title = 'Dialog Title',
	message = 'Dialog message',
}: YourDialogProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{message}</DialogDescription>
			</DialogHeader>

			<div className="py-4">{/* Your dialog content here */}</div>

			<DialogFooter>
				<Button variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="solid" onClick={onClose}>
					Confirm
				</Button>
			</DialogFooter>
		</>
	);
}
```

Then register it in `components/dialog-manager.tsx`:

```tsx
const dialogComponents: Record<string, ComponentType<any>> = {
	yourDialog: dynamic(() => import('./campaigns/your-dialog'), { ssr: false }),
	// ... other dialogs
};
```

### 4. Using Dialogs with Forms

For dialogs with forms, use the form pattern:

```tsx
'use client';

import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, Button, Input } from '@thrive/ui';

interface FormDialogProps {
	onClose: () => void;
	onSubmit: (data: FormData) => Promise<void>;
}

interface FormData {
	name: string;
	email: string;
}

export default function FormDialog({ onClose, onSubmit }: FormDialogProps) {
	const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			console.error('Form submission failed:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<DialogTitle>Form Dialog</DialogTitle>
			</DialogHeader>

			<div className="space-y-4 py-4">
				<Input
					value={formData.name}
					onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
					placeholder="Name"
					required
				/>
				<Input
					type="email"
					value={formData.email}
					onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
					placeholder="Email"
					required
				/>
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" variant="solid" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</Button>
			</DialogFooter>
		</form>
	);
}
```

### 5. Managing Multiple Dialogs (Stack)

The dialog system supports stacking multiple dialogs:

```tsx
const { openDialog, closeDialog, closeAllDialogs } = useCustomDialog();

// Open first dialog
openDialog('firstDialog', {});

// Open second dialog (on top of first)
openDialog('secondDialog', {});

// Close only the top dialog
closeDialog();

// Close all dialogs
closeAllDialogs();
```

### 6. Using Basic Dialog Components Directly

You can also use the basic dialog components from `@thrive/ui` directly without the dialog system:

```tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';

export default function SimpleComponent() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)}>Open Dialog</Button>

			<Dialog open={open} onOpenChange={details => setOpen(details.open)}>
				<DialogContent size="md">
					<DialogHeader>
						<DialogTitle>Simple Dialog</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						<p>This is a simple dialog using the basic components directly.</p>
					</div>

					<DialogFooter>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
```

## Available Dialog Components from @thrive/ui

- `Dialog` - Root dialog component
- `DialogContent` - Dialog content container (supports size prop)
- `DialogHeader` - Header section
- `DialogTitle` - Title text
- `DialogDescription` - Description text
- `DialogFooter` - Footer section for actions
- `DialogClose` - Close button component
- `DialogTrigger` - Trigger button (if using declarative API)

## Using Common Dialogs from @thrive/ui

The UI package provides reusable dialog components in `@thrive/ui/components/common-dialogs/`. These can be used across multiple apps in the monorepo.

### Available Common Dialogs

#### MessageComposer Dialog

A dialog for composing messages with character limits for different social media platforms:

```tsx
import { useCustomDialog } from '@/hooks/use-custom-dialog';

function MyComponent() {
	const { openDialog } = useCustomDialog();

	const handleComposeMessage = () => {
		openDialog(
			'messageComposer',
			{
				initialMessage: '',
				selectedChannels: ['twitter', 'facebook', 'linkedin'],
				onSubmit: async (message: string) => {
					console.log('Sending message:', message);
					// Handle message submission
				},
				title: 'Compose Social Post',
				description: 'Write your message for social media',
				submitButtonText: 'Post',
			},
			{
				size: 'lg',
				closeOnEscape: true,
				closeOnInteractOutside: false,
			}
		);
	};

	return <button onClick={handleComposeMessage}>Compose Message</button>;
}
```

**MessageComposer Props:**

- `initialMessage` - Initial message text (optional)
- `selectedChannels` - Array of platform names: 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'googlebusiness'
- `characterLimit` - Override automatic character limit calculation
- `onSubmit` - Callback when message is submitted
- `title` - Dialog title
- `description` - Dialog description
- `submitButtonText` - Custom submit button text

### Adding New Common Dialogs

To add a new common dialog from the UI package:

1. **Create the base component** in `packages/ui/src/components/common-dialogs/`:

```tsx
// packages/ui/src/components/common-dialogs/my-component.tsx
export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
	// Component content (without Dialog wrapper)
	return <div>...</div>;
}
```

2. **Create a wrapper dialog** in your app:

```tsx
// apps/thrive-campaign/components/common-dialogs/my-component-dialog.tsx
'use client';

import { DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';
import MyComponent from '@thrive/ui/components/common-dialogs/my-component';

interface MyComponentDialogProps {
	onClose: () => void;
	// Add your props
}

export default function MyComponentDialog({ onClose, ...props }: MyComponentDialogProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>My Dialog</DialogTitle>
			</DialogHeader>

			<div className="py-4">
				<MyComponent {...props} />
			</div>

			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="primary" onClick={onClose}>
					Confirm
				</Button>
			</DialogFooter>
		</>
	);
}
```

3. **Register it in DialogManager**:

```tsx
// apps/thrive-campaign/components/dialog-manager.tsx
const dialogComponents: Record<string, ComponentType<any>> = {
	myDialog: dynamic(() => import('./common-dialogs/my-component-dialog'), { ssr: false }),
	// ... other dialogs
};
```

This pattern allows you to:

- ✅ Reuse common UI components across apps
- ✅ Customize the dialog wrapper per app
- ✅ Use the same dialog system and provider
- ✅ Maintain separation between UI package and app logic

## Best Practices

1. **Always provide `onClose` prop** to your dialog components
2. **Use dynamic imports** in DialogManager for better code splitting
3. **Use meaningful dialog type names** (e.g., 'deleteCampaign', not 'dialog1')
4. **Handle async operations properly** with loading states
5. **Provide accessibility labels** for screen readers
6. **Use appropriate dialog sizes** based on content
7. **Prevent accidental closes** for forms with `closeOnInteractOutside: false`

## TypeScript Support

The dialog system is fully typed. You can extend the dialog types:

```tsx
// types/dialog.d.ts (already exists)
export interface DialogConfig {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	// ... other options
}
```

## Troubleshooting

**Dialog not showing:**

- Check that DialogManager is in your provider tree
- Verify the dialog type is registered in DialogManager
- Check browser console for warnings

**Dialog closes unexpectedly:**

- Set `closeOnInteractOutside: false` in config
- Check if there are competing click handlers

**Styling issues:**

- The dialogs use Tailwind classes
- Ensure `@thrive/ui/style.css` is imported in your layout
