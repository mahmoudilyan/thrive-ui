# Dialog Header Patterns

## Two Header Styles

Based on the Figma designs, there are two distinct header patterns for dialogs:

### Pattern 1: Dialog with Bordered Header (Settings/Large Dialogs)

Use this for complex dialogs with tabs or multi-section content:

```tsx
<>
	{/* Header with border bottom */}
	<div className="border-b border-[#e7ebee] px-6 py-3 -mx-6 -mt-6">
		<DialogHeader>
			<DialogTitle className="text-xl font-medium text-[#2b384a]">{dialogTitle}</DialogTitle>
		</DialogHeader>
	</div>

	{/* Content */}
	<div className="py-6">{/* Your content */}</div>

	{/* Footer with border top */}
	<div className="border-t border-[#e7ebee] px-6 py-4 -mx-6 -mb-6 mt-auto">
		<DialogFooter>
			<Button variant="secondary" onClick={onClose}>
				Cancel
			</Button>
			<Button variant="primary" onClick={onSave}>
				Save
			</Button>
		</DialogFooter>
	</div>
</>
```

**Characteristics:**

- Title only (no description in header)
- Border bottom: `border-b border-[#e7ebee]`
- Padding: `px-6 py-3`
- Negative margins to extend to dialog edges: `-mx-6 -mt-6`
- Used for: Settings dialogs, multi-tab dialogs, complex forms

### Pattern 2: Dialog without Bordered Header (Simple Dialogs)

Use this for simple confirmation dialogs or single-purpose dialogs:

```tsx
<>
	{/* Title and description together in content area */}
	<div className="flex items-start justify-between gap-6">
		<div className="flex-1">
			<DialogTitle className="text-xl font-medium text-[#2b384a] mb-2">{dialogTitle}</DialogTitle>
			{dialogDescription && (
				<DialogDescription className="text-base text-[#364152]">
					{dialogDescription}
				</DialogDescription>
			)}
		</div>
	</div>

	{/* Additional content */}
	<div className="mt-10">{/* Your content */}</div>

	{/* Footer */}
	<DialogFooter>
		<Button variant="secondary" onClick={onClose}>
			Cancel
		</Button>
		<Button variant="destructive" onClick={onConfirm}>
			Delete
		</Button>
	</DialogFooter>
</>
```

**Characteristics:**

- Title AND description together
- No border separating header from content
- Normal padding (uses DialogContent default)
- Used for: Confirmations, simple forms, delete dialogs

## Complete Examples

### Example 1: Settings Dialog with Tabs

```tsx
'use client';

import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, Button } from '@thrive/ui';

interface SettingsDialogProps {
	onClose: () => void;
	dialogTitle?: string;
}

export default function SettingsDialog({ onClose, dialogTitle = 'Settings' }: SettingsDialogProps) {
	const [activeTab, setActiveTab] = useState('general');

	return (
		<>
			{/* Header with border */}
			<div className="border-b border-[#e7ebee] px-6 py-3 -mx-6 -mt-6">
				<DialogHeader>
					<DialogTitle className="text-xl font-medium text-[#2b384a]">{dialogTitle}</DialogTitle>
				</DialogHeader>
			</div>

			{/* Content with sidebar tabs */}
			<div className="flex gap-6 h-[541px] -mx-6">
				{/* Sidebar */}
				<div className="bg-[#f6f8f9] w-[227px] p-5">
					<button
						onClick={() => setActiveTab('general')}
						className={activeTab === 'general' ? 'bg-[#e8ecef]' : ''}
					>
						General
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 py-6 pr-6">{/* Tab content */}</div>
			</div>

			{/* Footer with border */}
			<div className="border-t border-[#e7ebee] px-6 py-4 -mx-6 -mb-6">
				<DialogFooter>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="primary">Save Changes</Button>
				</DialogFooter>
			</div>
		</>
	);
}
```

### Example 2: Simple Confirmation Dialog

```tsx
'use client';

import { DialogTitle, DialogDescription, DialogFooter, Button } from '@thrive/ui';

interface ConfirmDialogProps {
	onClose: () => void;
	dialogTitle?: string;
	dialogDescription?: string;
	onConfirm: () => void;
}

export default function ConfirmDialog({
	onClose,
	dialogTitle = 'Confirm Action',
	dialogDescription = 'Are you sure?',
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<>
			{/* Title and description - no border */}
			<div className="flex items-start justify-between gap-6">
				<div className="flex-1">
					<DialogTitle className="text-xl font-medium text-[#2b384a] mb-2">
						{dialogTitle}
					</DialogTitle>
					<DialogDescription className="text-base text-[#364152]">
						{dialogDescription}
					</DialogDescription>
				</div>
			</div>

			{/* Optional content */}
			<div className="mt-10">{/* Additional content if needed */}</div>

			{/* Footer */}
			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant="destructive"
					onClick={() => {
						onConfirm();
						onClose();
					}}
				>
					Confirm
				</Button>
			</DialogFooter>
		</>
	);
}
```

## When to Use Each Pattern

### Use Bordered Header Pattern When:

- ✅ Dialog has multiple tabs or sections
- ✅ Complex settings or configuration
- ✅ Need clear visual separation of header/content/footer
- ✅ Dialog is large (xl or full size)
- ✅ Content has its own background colors

**Examples:** Campaign Settings, Account Settings, Preferences, Multi-step wizards

### Use Simple Pattern When:

- ✅ Simple confirmation or deletion
- ✅ Single form without tabs
- ✅ Quick action dialogs
- ✅ Dialog is small to medium (sm, md, lg)
- ✅ Title and description are closely related

**Examples:** Delete confirmations, Quick edits, Simple forms, Alerts

## Styling Reference

### Colors from Figma

```css
/* Text */
--color-heading: #2b384a /* Dialog titles */ --color-text: #364152 /* Body text */
	--color-text-light: #8493a8 /* Helper text */ --color-red-500: #d13f36 /* Required asterisk */
	/* Backgrounds */ --color-bg-panel: #ffffff /* Dialog background */ --color-bg: #f6f8f9
	/* Sidebar background */ --color-bg-secondary: #e8ecef /* Active tab background */ /* Borders */
	--color-border: #d1d7de /* Input borders */ border-[#e7ebee] /* Header/Footer separator */;
```

### Typography

```css
/* Title */
font-family: Inter
font-weight: 500 (Medium)
font-size: 20px
line-height: 28px

/* Body */
font-family: Inter
font-weight: 400 (Regular)
font-size: 16px (P2) or 13px (P3)
line-height: 24px (P2) or 20px (P3)
```

### Spacing

```css
/* Header padding */
px-6 py-3  (24px horizontal, 12px vertical)

/* Content padding */
py-6 pr-6  (24px vertical, 24px right)

/* Footer padding */
px-6 py-4  (24px horizontal, 16px vertical)

/* Sidebar width */
w-[227px]

/* Gap between sidebar and content */
gap-6  (24px)
```

## Usage with DialogManager

The DialogManager automatically handles:

- `dialogTitle` - passed to all dialogs
- `dialogDescription` - passed to all dialogs
- Dialog size configuration

You choose the header pattern in your dialog component:

```tsx
// Call with size config
openDialog(
	'settingsDialog',
	{
		/* props */
	},
	{
		size: 'xl', // Large dialog = use bordered header pattern
		closeOnEscape: true,
		closeOnInteractOutside: false,
	}
);

openDialog(
	'deleteDialog',
	{
		/* props */
	},
	{
		size: 'md', // Small dialog = use simple pattern
		closeOnEscape: true,
	}
);
```

## Summary

| Pattern             | Use Case            | Size       | Has Border | Title Location | Description Location  |
| ------------------- | ------------------- | ---------- | ---------- | -------------- | --------------------- |
| **Bordered Header** | Settings, Complex   | xl, full   | Yes        | Header         | Optional in content   |
| **Simple**          | Confirmation, Forms | sm, md, lg | No         | Content        | With title in content |

Choose the pattern that best fits your dialog's complexity and purpose!
