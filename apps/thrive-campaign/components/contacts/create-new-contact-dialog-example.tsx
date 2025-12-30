'use client';

import { Button } from '@thrive/ui';
import { useDialog } from '@thrive/ui';
import { MdPersonAdd } from 'react-icons/md';

/**
 * Example component showing how to use the CreateNewContactDialog
 */
export function CreateNewContactDialogExample() {
	const { openDialog } = useDialog();

	const handleCreateContact = () => {
		openDialog('createNewContact', {
			dialogTitle: 'Add New Contact',
			dialogDescription: 'Create a new contact and add them to your database',
			onSubmit: async (contactData: any) => {
				console.log('Creating contact with data:', contactData);

				// Here you would typically make an API call to create the contact
				// Example:
				// const response = await fetch('/api/contacts', {
				//   method: 'POST',
				//   headers: { 'Content-Type': 'application/json' },
				//   body: JSON.stringify(contactData)
				// });

				// Show success message or handle errors
				alert('Contact created successfully!');
			},
		});
	};

	return (
		<Button onClick={handleCreateContact} variant="primary">
			<MdPersonAdd className="mr-2 w-4 h-4" />
			Create New Contact
		</Button>
	);
}
