# Contact Dialogs - Complete Implementation

This document provides an overview of all implemented contact dialogs and their usage.

## Overview

All contact dialogs have been implemented and registered in the dialog system. They can be accessed through the contacts list dropdown menu or programmatically using the `useDialog` hook.

## Available Dialogs

### 1. Create New Contact Dialog (`createNewContact`)

**Purpose**: Create a new contact with dynamic form fields based on list selection.

**Features**:

- Required email input with validation
- Optional phone number input
- List selection dropdown
- Contact status selection (Unconfirmed, Active, Inactive, Unsubscribed, Bounced)
- Dynamic form fields loaded from API based on selected list
- Contact actions dropdown (Move to List, Add to List, Validate Email, Enrich Contact, Delete Contact)

**Usage**:

```tsx
openDialog('createNewContact', {
	onSubmit: async contactData => {
		// Handle contact creation
		console.log('Creating contact:', contactData);
	},
});
```

**API Integration**: Uses `/api/App/Contacts/GetContactFormFields.json?listId=${listId}` for dynamic form fields.

### 2. View Profile Dialog (`viewProfile`)

**Purpose**: Display comprehensive contact information in read-only format.

**Features**:

- Basic information (email, phone, registration date, status)
- List information
- Email validation status
- Lead information (score, status)
- Custom fields display
- Organized in sections with proper styling

**Usage**:

```tsx
openDialog('viewProfile', {
	contact: contactData,
});
```

### 3. Edit Contact Dialog (`editContact`)

**Purpose**: Edit existing contact information.

**Features**:

- Editable email and phone fields
- Contact status selection
- Custom fields editing
- Contact metadata display (ID, registration date, lists)
- Form validation

**Usage**:

```tsx
openDialog('editContact', {
	contact: contactData,
	onSubmit: async updatedData => {
		// Handle contact update
		console.log('Updating contact:', updatedData);
	},
});
```

### 4. Add to List Dialog (`addToList`)

**Purpose**: Add or move contacts to different lists.

**Features**:

- List selection with checkboxes
- Add vs Move action selection
- Current list display
- Multiple list selection
- Real-time list loading

**Usage**:

```tsx
openDialog('addToList', {
	contact: contactData,
	onSubmit: async data => {
		// Handle list assignment
		console.log('List operation:', data);
	},
});
```

### 5. Send Email Dialog (`sendEmail`)

**Purpose**: Send emails to contacts with template support.

**Features**:

- Email template selection
- Subject and message fields
- Auto-fill based on template
- Character count
- Recipient information display

**Usage**:

```tsx
openDialog('sendEmail', {
	contact: contactData,
	onSubmit: async emailData => {
		// Handle email sending
		console.log('Sending email:', emailData);
	},
});
```

### 6. Delete Contact Dialog (`deleteContact`)

**Purpose**: Confirm and delete contacts with proper warnings.

**Features**:

- Confirmation dialog with warning
- Contact information display
- Destructive action styling
- Contact ID and email confirmation

**Usage**:

```tsx
openDialog('deleteContact', {
	dialogTitle: `Delete "${contact.email}"?`,
	dialogDescription: 'This action cannot be undone.',
	contactEmail: contact.email,
	contactId: contact.id,
	onConfirm: async id => {
		// Handle contact deletion
		console.log('Deleting contact:', id);
	},
});
```

## Integration Points

### Contacts List Integration

All dialogs are integrated into the contacts list dropdown menu:

```tsx
// In contacts-list.tsx
<DropdownMenuContent className="min-w-44">
  <DropdownMenuItem onClick={() => openDialog('viewProfile', { contact: contactData })}>
    <MdPersonOutline className="size-4 text-ink-icon" />
    View Profile
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => openDialog('editContact', { contact: contactData })}>
    <MdOutlineEdit className="size-4 text-ink-icon" />
    Edit Contact
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => openDialog('sendEmail', { contact: contactData })}>
    <MdOutlineEmail className="size-4 text-ink-icon" />
    Send Email
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => openDialog('addToList', { contact: contactData })}>
    <MdPersonAdd className="size-4 text-ink-icon" />
    Add to List
  </DropdownMenuItem>
  <DropdownMenuItem variant="destructive" onClick={() => openDialog('deleteContact', { ... })}>
    <MdDelete className="size-4 text-ink-icon" />
    Delete
  </DropdownMenuItem>
</DropdownMenuContent>
```

### Page Header Integration

The "Create Contact" button in the page header automatically opens the `createNewContact` dialog:

```tsx
// In page-section-wrapper.tsx
createContact: () => openDialog('createNewContact', {}),
```

## API Endpoints

### Implemented

- `GET /api/App/Contacts/GetContactFormFields.json?listId=${listId}` - Returns dynamic form fields for contact creation

### Required for Full Functionality

- `POST /api/App/Contacts/CreateContact.json` - Create new contact
- `PUT /api/App/Contacts/UpdateContact/${id}.json` - Update contact
- `DELETE /api/App/Contacts/DeleteContact/${id}.json` - Delete contact
- `POST /api/App/Contacts/MoveContact/${id}.json` - Move contact to lists
- `POST /api/App/Email/SendEmail.json` - Send email to contact

## Data Structures

### ContactFormData (Create New Contact)

```tsx
interface ContactFormData {
	email: string;
	phone?: string;
	listId?: string;
	status: ContactStatus;
	customFields?: Record<string, any>;
}
```

### EmailData (Send Email)

```tsx
interface EmailData {
	to: string;
	subject: string;
	message: string;
	template?: string;
}
```

### ListAssignmentData (Add to List)

```tsx
interface ListAssignmentData {
	contactId: string;
	listIds: string[];
	action: 'add' | 'move';
}
```

## Styling and UX

- All dialogs follow consistent design patterns
- Proper loading states and error handling
- Responsive design with scrollable content areas
- Material Design icons for visual consistency
- Proper form validation and user feedback
- Accessible with proper ARIA attributes and keyboard navigation

## Testing

To test the dialogs:

1. Navigate to `/contacts`
2. Click the "Create Contact" button to test the create dialog
3. Use the dropdown menu on any contact row to test other dialogs
4. Verify form validation and error handling
5. Test with different list selections to see dynamic form fields

## Future Enhancements

- Email template management
- Bulk contact operations
- Contact import/export dialogs
- Advanced contact search and filtering
- Contact merge functionality
- Contact activity history
