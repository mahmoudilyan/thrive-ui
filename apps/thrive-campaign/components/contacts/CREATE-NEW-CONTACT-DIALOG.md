# Create New Contact Dialog

A comprehensive dialog component for creating new contacts with dynamic form fields and contact actions.

## Features

- **Required email input** - Primary contact identifier
- **Phone number input** - Optional contact phone
- **List selection** - Dropdown to select which list the contact belongs to
- **Dynamic form fields** - When a list is selected, additional form fields are loaded based on the list's configuration
- **Contact status selection** - Choose from: Unconfirmed, Active, Inactive, Unsubscribed, Bounced
- **Contact actions dropdown** - Quick access to contact management actions

## Usage

### Basic Usage

```tsx
import { useDialog } from '@thrive/ui';

function YourComponent() {
	const { openDialog } = useDialog();

	const handleCreateContact = () => {
		openDialog('createNewContact', {
			onSubmit: async contactData => {
				// Handle contact creation
				console.log('Creating contact:', contactData);
			},
		});
	};

	return <Button onClick={handleCreateContact}>Create New Contact</Button>;
}
```

### With Custom Props

```tsx
openDialog('createNewContact', {
	dialogTitle: 'Add New Team Member',
	dialogDescription: 'Create a new contact for your team',
	onSubmit: async contactData => {
		const response = await fetch('/api/contacts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(contactData),
		});

		if (response.ok) {
			// Handle success
			console.log('Contact created successfully');
		}
	},
});
```

## Props

| Prop                | Type                              | Default                                | Description                            |
| ------------------- | --------------------------------- | -------------------------------------- | -------------------------------------- |
| `onClose`           | `() => void`                      | -                                      | Function called when dialog is closed  |
| `dialogTitle`       | `string`                          | `'Create New Contact'`                 | Dialog title                           |
| `dialogDescription` | `string`                          | `'Add a new contact to your database'` | Dialog description                     |
| `onSubmit`          | `(data: ContactFormData) => void` | -                                      | Function called when form is submitted |

## ContactFormData Interface

```tsx
interface ContactFormData {
	email: string; // Required email address
	phone?: string; // Optional phone number
	listId?: string; // Selected list ID
	status: ContactStatus; // Contact status
	customFields?: Record<string, any>; // Dynamic form field values
}
```

## Contact Status Options

- `'Unconfirmed'` - New contact, not yet confirmed
- `'Active'` - Active contact
- `'Inactive'` - Inactive contact
- `'Unsubscribed'` - Contact has unsubscribed
- `'Bounced'` - Email has bounced

## Dynamic Form Fields

When a list is selected, the dialog automatically loads and renders additional form fields based on the list's configuration. The form fields are fetched from:

```
/api/App/Lists/GetFormBuilderFields/${listId}.json
```

### Supported Field Types

- `text` - Text input
- `email` - Email input
- `tel` - Phone number input
- `url` - URL input
- `textarea` - Multi-line text area
- `select` - Dropdown selection
- `digits` - Number input

## Contact Actions

The dialog includes a dropdown menu with quick access to contact management actions:

1. **Move to List** - Move contact to a different list
2. **Add to List** - Add contact to additional lists
3. **Validate Email** - Verify email address validity
4. **Enrich Contact** - Enhance contact data with additional information
5. **Delete Contact** - Remove contact from database

## Integration

The dialog is already integrated into the contacts page via the "Create Contact" button in the page header. The action is handled in `PageSectionWrapper`:

```tsx
// In page-section-wrapper.tsx
createContact: () => openDialog('createNewContact', {}),
```

## API Integration

To connect the dialog to your backend:

1. **Load Lists**: Replace the mock data in `useEffect` with actual API call to fetch available lists
2. **Load Form Fields**: Replace the mock data in the list selection `useEffect` with actual API call to `/api/App/Lists/GetFormBuilderFields/${listId}.json`
3. **Submit Contact**: Implement the actual contact creation API call in the `onSubmit` handler

## Styling

The dialog uses Chakra UI components and follows the design system patterns:

- Responsive design with max-height scrollable content
- Proper form validation and error states
- Consistent spacing and typography
- Material Design icons for visual elements

## Accessibility

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
