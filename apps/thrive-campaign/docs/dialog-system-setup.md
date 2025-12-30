# Dialog System Setup Guide

## Overview

The dialog system is built on a **base implementation in the UI package** (`@thrive/ui`) that apps **extend** with their own dialogs. This is similar to how `use-data-table` works - shared foundation, app-specific implementation.

```
┌─────────────────────────────────────────────────────────────┐
│                      @thrive/ui                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Base Implementation (Shared)                        │   │
│  │  • DialogProvider  (context & state)                 │   │
│  │  • DialogManager   (renderer)                        │   │
│  │  • useDialog       (hook)                            │   │
│  │  • useDialogState  (for DialogManager)               │   │
│  │  • Dialog UI components (Dialog, DialogContent...)   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Your App (apps/thrive-campaign)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  App-Specific Implementation                         │   │
│  │  • Dialog config (components/dialogs/index.tsx)      │   │
│  │  • Dialog components (components/campaigns/*.tsx)    │   │
│  │  • Use: useDialog() from @thrive/ui                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Setup (Already Done)

Your app already has the dialog system set up in `components/ui/provider.tsx`:

```tsx
import { DialogProvider, DialogManager } from '@thrive/ui';
import { appDialogConfig } from '@/components/dialogs';

export function Provider({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			<DialogProvider>
				{children}
				<DialogManager config={appDialogConfig} />
			</DialogProvider>
		</QueryClientProvider>
	);
}
```

### 2. Register Your Dialogs

All dialogs are registered in **one place**: `components/dialogs/index.tsx`

```tsx
import dynamic from 'next/dynamic';
import type { DialogManagerConfig } from '@thrive/ui';

export const appDialogConfig: DialogManagerConfig = {
	dialogs: {
		// Your dialog registry
		deleteCampaign: dynamic(() => import('../campaigns/delete-campaign-dialog'), {
			ssr: false,
		}),
		createCampaign: dynamic(() => import('../campaigns/create-campaign-dialog'), {
			ssr: false,
		}),
	},

	// Default settings for all dialogs
	defaultConfig: {
		size: 'md',
		closeOnEscape: true,
		closeOnInteractOutside: true,
	},
};
```

### 3. Use Dialogs Anywhere

```tsx
import { useDialog } from '@thrive/ui';

function MyComponent() {
	const { openDialog } = useDialog();

	return (
		<Button
			onClick={() => {
				openDialog('deleteCampaign', {
					campaignName: 'Summer Sale',
					campaignId: '123',
					onConfirm: id => console.log('Deleted:', id),
				});
			}}
		>
			Delete
		</Button>
	);
}
```

## Architecture

### What Lives in @thrive/ui

**✅ Shared across all apps:**

1. **DialogProvider** - Context provider for dialog state

   ```tsx
   export function DialogProvider({ children }: { children: ReactNode });
   ```

2. **DialogManager** - Renders dialogs from the registry

   ```tsx
   export function DialogManager({ config }: { config: DialogManagerConfig });
   ```

3. **useDialog** - Hook to open/close dialogs

   ```tsx
   const { openDialog, closeDialog, closeAllDialogs } = useDialog();
   ```

4. **useDialogState** - Internal hook for DialogManager

   ```tsx
   const { dialogType, dialogProps, dialogConfig, closeDialog } = useDialogState();
   ```

5. **Dialog UI Components** - Visual components
   ```tsx
   (Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter);
   ```

### What Lives in Your App

**✅ App-specific:**

1. **Dialog Configuration** (`components/dialogs/index.tsx`)
   - Dialog registry (maps string → component)
   - Default configuration

2. **Dialog Components** (`components/campaigns/`, `components/folders/`, etc.)
   - Individual dialog implementations
   - Must accept `onClose: () => void` prop

## Creating a New Dialog

### Step 1: Create the Dialog Component

```tsx
// components/campaigns/delete-campaign-dialog.tsx
'use client';

import { DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';

interface DeleteCampaignDialogProps {
	onClose: () => void;
	campaignName: string;
	campaignId: string;
	onConfirm?: (id: string) => void;
}

export default function DeleteCampaignDialog({
	onClose,
	campaignName,
	campaignId,
	onConfirm,
}: DeleteCampaignDialogProps) {
	const handleDelete = () => {
		if (onConfirm) {
			onConfirm(campaignId);
		}
		onClose();
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Delete {campaignName}?</DialogTitle>
			</DialogHeader>

			<div className="py-4">
				<p>This action cannot be undone.</p>
			</div>

			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="destructive" onClick={handleDelete}>
					Delete
				</Button>
			</DialogFooter>
		</>
	);
}
```

**Important:**

- ✅ Always accept `onClose: () => void` prop
- ✅ Use `DialogHeader`, `DialogFooter`, `Button` from `@thrive/ui`
- ✅ Export as default export
- ✅ Add 'use client' directive

### Step 2: Register in Dialog Config

```tsx
// components/dialogs/index.tsx
export const appDialogConfig: DialogManagerConfig = {
	dialogs: {
		deleteCampaign: dynamic(() => import('../campaigns/delete-campaign-dialog'), {
			ssr: false,
		}),
		// 👆 Add your new dialog here
	},
	defaultConfig: {
		/* ... */
	},
};
```

### Step 3: Use It

```tsx
import { useDialog } from '@thrive/ui';

function CampaignActions() {
	const { openDialog } = useDialog();

	return (
		<Button
			onClick={() => {
				openDialog('deleteCampaign', {
					campaignName: 'My Campaign',
					campaignId: '123',
					onConfirm: id => {
						// Your delete logic
						console.log('Deleted:', id);
					},
				});
			}}
		>
			Delete
		</Button>
	);
}
```

## Dialog Configuration

### Dialog Types

Register dialogs with unique string keys:

```tsx
dialogs: {
  // ✅ Good: camelCase, descriptive
  'deleteCampaign': DeleteCampaignDialog,
  'createFolder': CreateFolderDialog,
  'editProfile': EditProfileDialog,

  // ❌ Bad: kebab-case will cause issues
  'delete-campaign': DeleteCampaignDialog,
}
```

### Default Config

Set defaults for all dialogs:

```tsx
defaultConfig: {
  size: 'md',                    // 'md' | 'lg' | 'xl' | 'full'
  closeOnEscape: true,           // Allow ESC key to close
  closeOnInteractOutside: true,  // Click outside to close
}
```

### Per-Dialog Config

Override defaults when opening:

```tsx
openDialog(
	'createCampaign',
	{
		/* props */
	},
	{
		size: 'lg', // Larger dialog
		closeOnEscape: true,
		closeOnInteractOutside: false, // Prevent accidental close on forms
	}
);
```

## API Reference

### useDialog()

Returns dialog control functions:

```tsx
const {
	openDialog, // Open a dialog
	closeDialog, // Close the top dialog
	closeAllDialogs, // Close all dialogs in stack
} = useDialog();
```

### openDialog()

```tsx
openDialog(
  dialogType: string,           // Dialog type from registry
  props?: Record<string, any>,  // Props to pass to dialog component
  config?: {                    // Optional config override
    size?: 'md' | 'lg' | 'xl' | 'full';
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
  }
)
```

**Examples:**

```tsx
// Simple
openDialog('deleteCampaign', { campaignId: '123' });

// With config
openDialog(
	'createCampaign',
	{ initialName: 'New Campaign' },
	{ size: 'lg', closeOnInteractOutside: false }
);

// With callback
openDialog('deleteCampaign', {
	campaignId: '123',
	onConfirm: id => {
		deleteCampaign(id);
	},
});
```

## Common Patterns

### Confirmation Dialog

```tsx
openDialog('deleteItem', {
	itemName: item.name,
	itemId: item.id,
	onConfirm: async id => {
		await deleteItem(id);
		refetch();
	},
});
```

### Form Dialog

```tsx
openDialog(
	'createItem',
	{
		onSubmit: async data => {
			await createItem(data);
			refetch();
		},
	},
	{
		size: 'lg',
		closeOnInteractOutside: false, // Prevent accidental close
	}
);
```

### Multi-Step Dialog

```tsx
openDialog(
	'wizard',
	{
		onComplete: result => {
			console.log('Wizard completed:', result);
		},
	},
	{
		size: 'xl',
	}
);
```

## Advanced: Wrapping UI Package Components

For reusable components in `@thrive/ui/components/common-dialogs/`:

### 1. UI Package has the content component

```tsx
// packages/ui/src/components/common-dialogs/compose/message-composer.tsx
export default function MessageComposer({
	message,
	onMessageChange,
	selectedChannels,
}: MessageComposerProps) {
	return <textarea value={message} onChange={onMessageChange} />;
}
```

### 2. App wraps it in a dialog

```tsx
// apps/thrive-campaign/components/common-dialogs/message-composer-dialog.tsx
import { DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';
import MessageComposer from '@thrive/ui/components/common-dialogs/compose/message-composer';

interface MessageComposerDialogProps {
	onClose: () => void;
	initialMessage?: string;
	selectedChannels?: string[];
	onSubmit?: (message: string) => void;
}

export default function MessageComposerDialog({
	onClose,
	initialMessage = '',
	selectedChannels = [],
	onSubmit,
}: MessageComposerDialogProps) {
	const [message, setMessage] = useState(initialMessage);

	return (
		<>
			<DialogHeader>
				<DialogTitle>Compose Message</DialogTitle>
			</DialogHeader>

			<div className="py-4">
				<MessageComposer
					message={message}
					onMessageChange={setMessage}
					selectedChannels={selectedChannels}
				/>
			</div>

			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button
					onClick={() => {
						onSubmit?.(message);
						onClose();
					}}
				>
					Send
				</Button>
			</DialogFooter>
		</>
	);
}
```

### 3. Register and use

```tsx
// Register
dialogs: {
  messageComposer: dynamic(() => import('../common-dialogs/message-composer-dialog'), {
    ssr: false
  }),
}

// Use
openDialog('messageComposer', {
  selectedChannels: ['twitter', 'facebook'],
  onSubmit: (message) => postToSocial(message)
});
```

## Troubleshooting

### Dialog not showing

**Check:**

1. Is `DialogManager` in your provider tree?
2. Is the dialog registered in `components/dialogs/index.tsx`?
3. Does the dialog type match exactly? (camelCase!)
4. Check browser console for warnings

### TypeScript errors on import

**Solution:** Rebuild the UI package:

```bash
cd packages/ui && pnpm build
```

### Dialog closes unexpectedly

**Solution:** Set `closeOnInteractOutside: false`

```tsx
openDialog('myDialog', props, {
	closeOnInteractOutside: false,
});
```

### Multiple dialogs open

This is supported! Dialogs stack on top of each other:

- `closeDialog()` closes the top dialog
- `closeAllDialogs()` closes all

## Benefits of This Architecture

✅ **Reusable** - Base system shared across all apps in monorepo

✅ **Type-Safe** - Full TypeScript support with proper types

✅ **Code Splitting** - Dialogs loaded only when needed (dynamic imports)

✅ **Flexible** - Easy to extend per-app, shared foundation

✅ **Clean API** - Single config prop, simple `useDialog()` hook

✅ **Maintainable** - All dialogs registered in one place

✅ **Consistent** - Same patterns across all apps

## Migration from Old System

If you have old dialog code:

1. Move dialog provider to use `@thrive/ui`:

   ```tsx
   // Before
   import { DialogProvider } from '@/providers/dialog-provider';

   // After
   import { DialogProvider } from '@thrive/ui';
   ```

2. Change hook import:

   ```tsx
   // Before
   import { useCustomDialog } from '@/hooks/use-custom-dialog';

   // After
   import { useDialog } from '@thrive/ui';
   ```

3. Update dialog registration:

   ```tsx
   // Before (separate files)
   // components/dialog-manager.tsx with registry

   // After (single config)
   // components/dialogs/index.tsx
   export const appDialogConfig = { dialogs: {...}, defaultConfig: {...} };
   ```

4. Update DialogManager usage:

   ```tsx
   // Before
   <DialogManager dialogs={appDialogs} defaultConfig={config} />

   // After
   <DialogManager config={appDialogConfig} />
   ```

## File Structure

```
apps/thrive-campaign/
├── components/
│   ├── dialogs/
│   │   └── index.tsx              ← Dialog config (register all dialogs here)
│   ├── campaigns/
│   │   ├── delete-campaign-dialog.tsx
│   │   └── create-campaign-dialog.tsx
│   ├── common-dialogs/
│   │   └── message-composer-dialog.tsx  ← Wrappers for UI package components
│   └── ui/
│       └── provider.tsx           ← Setup: DialogProvider + DialogManager
└── any-component.tsx              ← Use: useDialog() hook

packages/ui/
└── src/
    ├── hooks/
    │   └── use-dialog.tsx         ← Base hook & provider
    ├── components/
    │   ├── dialog-manager.tsx     ← Base DialogManager
    │   ├── dialog.tsx             ← UI components
    │   └── common-dialogs/        ← Reusable content components
    └── index.ts                   ← Exports all dialog system
```

## Next Steps

1. ✅ Dialog system is set up
2. ✅ Example dialogs created
3. Create more dialogs as needed
4. Use `useDialog()` anywhere in your app

That's it! The dialog system is ready to use. 🎉
