import { ContactsList } from '@/components/contacts/contacts-list';
import { PageSectionWrapper } from '../page-section-wrapper';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
export default function ContactsPage() {
	return (
		<>
			<PageSectionWrapper
				pageTitle="Contacts"
				primaryAction={{
					label: 'Create Contact',
					action: 'createContact',
					icon: <MdOutlinePersonAddAlt />,
				}}
				otherActions={[
					{
						label: 'Import Contacts',
						action: 'importContacts',
					},
					{
						label: 'Export Contacts',
						action: 'exportContacts',
					},
					{
						label: 'Export History',
						action: 'exportContactsHistory',
					},
				]}
				showSidebarToggle={true}
				breadcrumbs={[
					{
						label: 'All Contacts',
						href: '/contacts',
					},
				]}
			/>
			<ContactsList />
		</>
	);
}
