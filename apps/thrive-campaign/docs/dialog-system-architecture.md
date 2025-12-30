# Dialog System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Component                            │
│  const { openDialog } = useCustomDialog();                      │
│  openDialog('deleteCampaign', { ... }, { ... })                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DialogProvider                              │
│  • Manages dialog stack (supports multiple dialogs)             │
│  • Provides openDialog, closeDialog, closeAllDialogs            │
│  • Located: providers/dialog-provider.tsx                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DialogManager                               │
│  • Renders the active dialog from the stack                     │
│  • Maps dialog types to components                              │
│  • Handles dialog configuration (size, close behavior)          │
│  • Located: components/dialog-manager.tsx                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  App-Specific Dialogs   │   │   Common Dialogs        │
│  ─────────────────────  │   │   ──────────────        │
│  • Delete Campaign      │   │  • Message Composer     │
│  • Create Campaign      │   │  • (Future dialogs)     │
│  • Edit Campaign        │   │                         │
│                         │   │  Wraps components from  │
│  Located in:            │   │  @thrive/ui package     │
│  components/campaigns/  │   │                         │
└─────────────────────────┘   └─────────────────────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              UI Components (@thrive/ui)                          │
│  ─────────────────────────────────────────                      │
│  • Dialog, DialogContent, DialogHeader, DialogFooter            │
│  • Button, Input, Badge, etc.                                   │
│  • MessageComposer (from common-dialogs/)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Opening a Dialog

```
1. Component calls openDialog('deleteCampaign', props, config)
                ↓
2. DialogProvider adds to dialog stack
                ↓
3. DialogManager detects new dialog
                ↓
4. DialogManager looks up 'deleteCampaign' in dialogComponents map
                ↓
5. Dynamically imports DeleteCampaignDialog component
                ↓
6. Wraps it in Dialog + DialogContent (from @thrive/ui)
                ↓
7. Renders with provided props and config
                ↓
8. User sees the dialog!
```

### Closing a Dialog

```
1. User clicks "Cancel" or "X" or presses ESC
                ↓
2. onClose() callback is called
                ↓
3. DialogProvider removes top dialog from stack
                ↓
4. DialogManager re-renders (no active dialog or previous dialog)
                ↓
5. Dialog closes with animation
```

## File Relationships

```
app/layout.tsx
└── components/ui/provider.tsx
    ├── QueryClientProvider
    ├── DialogProvider ←──────────┐
    │   └── DialogManager         │
    │       ├── Imports from:     │
    │       │   ├── ./campaigns/delete-campaign-dialog.tsx
    │       │   ├── ./campaigns/create-campaign-dialog.tsx
    │       │   └── ./common-dialogs/message-composer-dialog.tsx
    │       │       └── Uses: @thrive/ui/components/common-dialogs/compose/message-composer
    │       └── Uses: @thrive/ui (Dialog, DialogContent, Button, etc.)
    │
    └── SidebarProvider
        └── {children}
            └── Your Pages/Components
                └── use: useCustomDialog() ───┘
```

## Two Patterns for Using Dialogs

### Pattern 1: App-Specific Dialog (Define Your Own Content)

Perfect for dialogs unique to your app:

```tsx
// 1. Create the dialog component
// components/campaigns/delete-campaign-dialog.tsx
export default function DeleteCampaignDialog({ onClose, campaignName }) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Delete {campaignName}?</DialogTitle>
			</DialogHeader>
			<DialogFooter>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="destructive">Delete</Button>
			</DialogFooter>
		</>
	);
}

// 2. Register in dialog-manager.tsx
const dialogComponents = {
	deleteCampaign: dynamic(() => import('./campaigns/delete-campaign-dialog'), { ssr: false }),
};

// 3. Use anywhere
openDialog('deleteCampaign', { campaignName: 'Summer Sale' });
```

### Pattern 2: Common Dialog (Use Shared UI Components)

Perfect for reusable dialogs across multiple apps:

```tsx
// 1. UI package has the base component
// packages/ui/src/components/common-dialogs/compose/message-composer.tsx
export default function MessageComposer({ message, onMessageChange }) {
	return <textarea value={message} onChange={onMessageChange} />;
}

// 2. Create a wrapper in your app
// apps/thrive-campaign/components/common-dialogs/message-composer-dialog.tsx
import MessageComposer from '@thrive/ui/components/common-dialogs/compose/message-composer';

export default function MessageComposerDialog({ onClose, ...props }) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Compose</DialogTitle>
			</DialogHeader>
			<MessageComposer {...props} />
			<DialogFooter>
				<Button onClick={onClose}>Send</Button>
			</DialogFooter>
		</>
	);
}

// 3. Register in dialog-manager.tsx
const dialogComponents = {
	messageComposer: dynamic(() => import('./common-dialogs/message-composer-dialog'), {
		ssr: false,
	}),
};

// 4. Use anywhere
openDialog('messageComposer', {
	message: '',
	onMessageChange: setMessage,
	selectedChannels: ['twitter', 'facebook'],
});
```

## Benefits of This Architecture

✅ **Centralized Management** - All dialogs registered in one place

✅ **Type Safety** - Full TypeScript support with proper types

✅ **Code Splitting** - Dialogs loaded only when needed (dynamic imports)

✅ **Reusability** - Common dialogs shared across apps via UI package

✅ **Flexibility** - Easy to customize dialog wrapper per app

✅ **Stack Support** - Multiple dialogs can be open at once

✅ **Consistent API** - Same openDialog() call for all dialog types

✅ **No Provider Hell** - Single DialogProvider for all dialogs

✅ **Clean Separation** - UI package has components, apps have business logic

## Common Use Cases

| Use Case              | Pattern       | Example                           |
| --------------------- | ------------- | --------------------------------- |
| Delete confirmation   | App-specific  | `deleteCampaign`, `deleteContact` |
| Create/Edit forms     | App-specific  | `createCampaign`, `editProfile`   |
| Social media composer | Common dialog | `messageComposer`                 |
| File picker           | Common dialog | `mediaPicker`                     |
| Settings panel        | Common dialog | `accountSettings`                 |

## Next Steps

1. ✅ DialogProvider is set up
2. ✅ DialogManager is in your app
3. ✅ Example dialogs are created
4. ✅ useCustomDialog hook is ready

Now you can:

- Create more app-specific dialogs in `components/`
- Add common dialogs from UI package
- Register them in `dialog-manager.tsx`
- Use `openDialog()` anywhere in your app!
