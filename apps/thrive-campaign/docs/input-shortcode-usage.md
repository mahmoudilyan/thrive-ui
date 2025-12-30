# InputShortcode Component - Usage Guide

## Overview

`InputShortcode` is a single text input component with shortcode and emoji picker support. It inserts shortcodes at the cursor position.

## Component Details

- **Value Type**: `string` (single text value)
- **Display**: Regular text input with action buttons
- **Features**:
  - Insert shortcodes at cursor position
  - Emoji picker (optional)
  - Lazy loading of shortcodes

## Usage with useApi

### Basic Example

```tsx
'use client';

import { useState, useCallback } from 'react';
import { InputShortcode } from '@thrive/ui';
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import { Theme as EmojiTheme } from 'emoji-picker-react';

interface ShortcodeItem {
	text: string;
	icon?: string;
	value: string;
}

interface ShortcodeGroup {
	id: string;
	section: string;
	text: string;
	listid?: string;
	class?: string;
	style?: string;
	menu: ShortcodeItem[];
}

export default function MyComponent() {
	const [subject, setSubject] = useState('');

	// Load shortcodes using useApi (lazy loading)
	const { data: shortcodesData, refetch: refetchShortcodes } = useApi<
		ShortcodeGroup[],
		{ types: string; listId: number; listsOnly: number }
	>(API_CONFIG.lists.getShortcodes as any, {
		params: { types: '', listId: 0, listsOnly: 0 },
		enabled: false, // Lazy load - don't fetch on mount
		jsonFile: 'shortcodes.json',
	});

	// Create loadShortcodes callback
	const loadShortcodes = useCallback(async (): Promise<ShortcodeGroup[]> => {
		if (shortcodesData && shortcodesData.length > 0) {
			return shortcodesData;
		}
		const result = await refetchShortcodes();
		return result.data || [];
	}, [shortcodesData, refetchShortcodes]);

	return (
		<InputShortcode
			value={subject}
			onChange={setSubject}
			placeholder="Enter subject line..."
			onLoadShortcodes={loadShortcodes}
			enableEmoji
			emojiPickerTheme={EmojiTheme.AUTO}
		/>
	);
}
```

### In a Form

```tsx
export default function CampaignForm() {
	const [formData, setFormData] = useState({
		subject: '',
		preheader: '',
	});

	// Single useApi call - reuse across multiple inputs
	const { data: shortcodesData, refetch: refetchShortcodes } = useApi<
		ShortcodeGroup[],
		{ types: string; listId: number; listsOnly: number }
	>(API_CONFIG.lists.getShortcodes as any, {
		params: { types: '', listId: 0, listsOnly: 0 },
		enabled: false,
		jsonFile: 'shortcodes.json',
	});

	const loadShortcodes = useCallback(async (): Promise<ShortcodeGroup[]> => {
		if (shortcodesData && shortcodesData.length > 0) {
			return shortcodesData;
		}
		const result = await refetchShortcodes();
		return result.data || [];
	}, [shortcodesData, refetchShortcodes]);

	return (
		<div className="space-y-4">
			{/* Subject field */}
			<InputShortcode
				value={formData.subject}
				onChange={value => setFormData(prev => ({ ...prev, subject: value }))}
				placeholder="Enter subject..."
				onLoadShortcodes={loadShortcodes}
				enableEmoji
			/>

			{/* Preheader field */}
			<InputShortcode
				value={formData.preheader}
				onChange={value => setFormData(prev => ({ ...prev, preheader: value }))}
				placeholder="Enter preheader..."
				onLoadShortcodes={loadShortcodes}
			/>
		</div>
	);
}
```

## Props

| Prop               | Type                              | Required | Default | Description                                  |
| ------------------ | --------------------------------- | -------- | ------- | -------------------------------------------- |
| `value`            | `string`                          | ✅       | -       | The input value                              |
| `onChange`         | `(value: string) => void`         | ✅       | -       | Value change handler                         |
| `onLoadShortcodes` | `() => Promise<ShortcodeGroup[]>` | -        | -       | Function to lazy load shortcodes             |
| `enableEmoji`      | `boolean`                         | -        | `false` | Show emoji picker button                     |
| `emojiPickerTheme` | `Theme`                           | -        | -       | Emoji picker theme (from emoji-picker-react) |
| `placeholder`      | `string`                          | -        | -       | Input placeholder text                       |
| `disabled`         | `boolean`                         | -        | `false` | Disable the input                            |
| `readOnly`         | `boolean`                         | -        | `false` | Make input read-only                         |
| ...all Input props | -                                 | -        | -       | Inherits all standard Input props            |

## How Lazy Loading Works

1. **On Mount**: Shortcodes are NOT loaded (enabled: false)
2. **User Clicks Shortcode Button**: `onLoadShortcodes` is called
3. **First Call**: Fetches data from API using `refetch()`
4. **Subsequent Calls**: Returns cached data from React Query
5. **Result**: Fast performance, no unnecessary API calls

## Best Practices

### ✅ DO

- Use `enabled: false` for lazy loading
- Reuse the same `loadShortcodes` function across multiple inputs in a form
- Use `useCallback` to memoize the `loadShortcodes` function
- Specify the correct type parameters for `useApi`

### ❌ DON'T

- Don't create multiple `useApi` calls for the same shortcodes
- Don't use `enabled: true` unless you need shortcodes immediately on mount
- Don't forget to specify the `jsonFile` for mock data in development

## Mock Data

The component automatically uses mock data in development mode when `?dummyData=yes` is in the URL.

Mock file location: `/mock/shortcodes.json`

## TypeScript Types

```tsx
interface ShortcodeItem {
	text: string;
	icon?: string;
	value: string;
}

interface ShortcodeGroup {
	id: string;
	section: string;
	text: string;
	listid?: string;
	class?: string;
	style?: string;
	menu: ShortcodeItem[];
}
```

## Integration with React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

function MyForm() {
	const { control } = useForm();
	const { data, refetch } = useApi<
		ShortcodeGroup[],
		{
			/* params */
		}
	>(API_CONFIG.lists.getShortcodes as any, { enabled: false, jsonFile: 'shortcodes.json' });

	const loadShortcodes = useCallback(async () => {
		if (data?.length) return data;
		const result = await refetch();
		return result.data || [];
	}, [data, refetch]);

	return (
		<Controller
			name="subject"
			control={control}
			render={({ field }) => (
				<InputShortcode
					value={field.value}
					onChange={field.onChange}
					onLoadShortcodes={loadShortcodes}
				/>
			)}
		/>
	);
}
```
