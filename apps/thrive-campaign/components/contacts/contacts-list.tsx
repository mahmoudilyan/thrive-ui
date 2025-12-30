'use client';

import { useMemo, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
	Box,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	IconButton,
	TableCellActions,
	Button,
	ButtonGroup,
	TableMainHeaderCell,
} from '@thrive/ui';
import { API_CONFIG } from '@/services/config/api';
import { DataTable } from '@thrive/ui';
import { useRouter } from 'next/navigation';
import { useDialog } from '@thrive/ui';
import type { TableState as UiTableState } from '@thrive/ui';
import { Contact } from '@/types/contacts/index';
import { ContactsTableCell } from './contacts-table-cell';
import ContactAvatarCheckbox from './contact-avatar-checkbox';
import {
	MdMoreHoriz,
	MdDelete,
	MdEmail,
	MdPersonAdd,
	MdOutlineEdit,
	MdOutlineEmail,
	MdPersonOutline,
	MdOutlineDelete,
	MdOutlinePersonAdd,
} from 'react-icons/md';
import Link from 'next/link';
import { useContacts } from '@/store/contacts/use-contacts-store';
import { useApi } from '@/hooks/use-api';

interface ContactsListProps {
	listId?: string;
	view?: 'list' | 'folder';
}

export function ContactsList({ listId, view = 'list' }: ContactsListProps) {
	const { openDialog } = useDialog();
	const router = useRouter();

	// Use the contacts store
	const {
		contacts,
		totalContacts,
		activeContacts,
		isLoading,
		columns,
		isLoadingFields,
		isLoadingActions,
		defaultFields,
		dataFields,
		updateColumnVisibility,
		setFields,
		contactHeadersAndActions,
		tableState,
		setTableState,
		setFilters,
	} = useContacts();

	// Initialize fields when loaded
	useEffect(() => {
		if (!isLoadingFields && defaultFields.length > 0 && dataFields.length > 0) {
			setFields({ defaultFields, dataFields });
		}
	}, [isLoadingFields, defaultFields, dataFields, setFields]);

	// Fetch lists for filter options
	const lists = useApi(API_CONFIG.lists.getListsFilters);

	const audiences = useApi(API_CONFIG.audiences.getAudiencesList);

	// Build columns from store columns configuration
	const tableColumns = useMemo<ColumnDef<Contact>[]>(() => {
		if (!columns.all || columns.all.length === 0) {
			return [];
		}

		// Find email and phone columns from store
		const emailCol = columns.all.find(col => col.secret === 'email');
		const phoneCol = columns.all.find(col => col.secret === 'phone');

		// Email column (pinned - shows email with avatar, checkbox, and actions)
		// This always uses 'email' as the accessor key regardless of field ID
		const emailColumn: ColumnDef<Contact> = {
			id: 'email',
			header: ({ table }) => (
				<TableMainHeaderCell label={emailCol?.name || 'Email'} columnIndex={0} table={table} />
			),
			accessorKey: 'email',
			cell: info => {
				const contactData = info.row.original;
				return (
					<div className="flex items-center gap-1.5 w-full group/row">
						<div className="flex-shrink-0">
							<ContactAvatarCheckbox row={info.row} />
						</div>
						<div className="flex-1 min-w-0 overflow-hidden">
							<Link
								href={`/contacts/${contactData.id}`}
								className="no-underline text-ink-dark hover:text-primary block truncate"
								title={contactData.email}
							>
								{contactData.email}
							</Link>
						</div>
						<div className="flex-shrink-0 opacity-0 group-hover/row:opacity-100 has-[button[data-state=open]]:opacity-100 transition-opacity">
							<TableCellActions row={info.row} table={info.table}>
								<ButtonGroup attached={true} size="sm">
									<Button
										variant="secondary"
										onClick={() => router.push(`/contacts/${contactData.id}`)}
									>
										View
									</Button>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<IconButton
												variant="secondary"
												size="sm"
												aria-label="More options"
												icon={<MdMoreHoriz className="size-4" />}
											/>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="min-w-52">
											<DropdownMenuItem
												onClick={() => openDialog('viewProfile', { contact: contactData })}
											>
												<MdPersonOutline />
												View Profile
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openDialog('editContact', { contact: contactData })}
											>
												<MdOutlineEdit />
												Edit Contact
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openDialog('sendEmail', { contact: contactData })}
											>
												<MdOutlineEmail />
												Send Email
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openDialog('addToList', { contact: contactData })}
											>
												<MdOutlinePersonAdd />
												Add to List
											</DropdownMenuItem>
											<DropdownMenuItem
												variant="destructive"
												onClick={() =>
													openDialog('deleteContact', {
														dialogTitle: `Delete "${contactData.email}"?`,
														dialogDescription: 'This action cannot be undone.',
														contactEmail: contactData.email,
														contactId: contactData.id,
														onConfirm: (id: string) => {
															console.log('Deleting contact:', id);
														},
													})
												}
											>
												<MdOutlineDelete />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</ButtonGroup>
							</TableCellActions>
						</div>
					</div>
				);
			},
			enableSorting: true,
			enableHiding: false,
			size: 400,
		};

		// Phone column (if exists in fields)
		const phoneColumn: ColumnDef<Contact> | null = phoneCol
			? {
					id: phoneCol.id,
					header: () => <div className="px-2">{phoneCol.name}</div>,
					accessorKey: 'phone',
					cell: ({ row }) => {
						const cellValue = row.original.phone;
						return (
							<div className="px-2 py-2">
								<ContactsTableCell value={cellValue || ''} field="phone" contact={row.original} />
							</div>
						);
					},
					enableSorting: phoneCol.sort || false,
					enableHiding: !phoneCol.isFixed,
					meta: {
						label: phoneCol.name,
						group: phoneCol.group,
					},
					size: phoneCol.width || 150,
				}
			: null;

		// Dynamic columns from store configuration (exclude email, phone with secrets, and actions)
		const dynamicColumns = columns.all
			.filter(
				col =>
					col.id !== 'actions' &&
					col.secret !== 'email' && // Exclude email field (we handle it separately with avatar)
					col.secret !== 'phone' && // Exclude phone field (we handle it separately)
					col.secret !== 'leadstatus' // Exclude lead status field (we handle it separately) because we combined it with lead score
			)
			.map(col => {
				return {
					id: col.id,
					header: () => <div className="px-2">{col.name}</div>,
					accessorKey: col.key,
					cell: ({ row }) => {
						const cellValue = row.original[col.key];

						// Special handling for list_name field
						if (col.key === 'list_name' && cellValue?.labels) {
							return (
								<div className="px-2 py-2">
									<ContactsTableCell
										value={cellValue.labels}
										field="lists"
										contact={row.original}
									/>
								</div>
							);
						}

						// Special handling for data fields (lead score, lead status, etc.)
						if (col.key.startsWith('data_')) {
							return (
								<div className="px-2 py-2">
									<ContactsTableCell
										value={cellValue || ''}
										field={col.key}
										contact={row.original}
									/>
								</div>
							);
						}

						return (
							<div className="px-2 py-2">
								<ContactsTableCell value={cellValue || ''} field={col.key} contact={row.original} />
							</div>
						);
					},
					enableSorting: col.sort || false,
					enableHiding: !col.isFixed,
					meta: {
						label: col.name,
						group: col.group,
					},
					size: col.width || 150,
				} as ColumnDef<Contact>;
			});

		// Column order: email (with avatar and actions), phone (if exists), then all other columns
		return [emailColumn, ...(phoneColumn ? [phoneColumn] : []), ...dynamicColumns];
	}, [columns.all, router, openDialog]);

	// Convert store tableState to UI tableState format
	const uiTableState: UiTableState = useMemo(
		() => ({
			pagination: tableState.pagination,
			sorting: [],
			filters: tableState.filters || {},
			columns: [],
			search: tableState.search?.value || '',
			view: 'list',
		}),
		[tableState]
	);

	const handleTableStateChange = (newState: Partial<UiTableState>) => {
		const updates: Partial<typeof tableState> = {};

		if (newState.pagination) {
			updates.pagination = newState.pagination;
		}

		if (newState.search !== undefined) {
			updates.search = {
				value: newState.search,
				regex: false,
			};
		}

		if (newState.filters !== undefined) {
			// Use setFilters instead of direct setTableState
			setFilters(newState.filters);
			return; // setFilters handles state update
		}

		if (Object.keys(updates).length > 0) {
			setTableState(updates as any);
		}
	};

	// Handle column visibility changes from TanStack Table
	const handleColumnVisibilityChange = (updaterOrValue: any) => {
		// TanStack Table passes either an updater function or the new value directly
		const newVisibility =
			typeof updaterOrValue === 'function' ? updaterOrValue(columns.visibility) : updaterOrValue;

		updateColumnVisibility(newVisibility);
	};

	return (
		<Box className="w-full px-space-2xl py-space-md">
			<DataTable<Contact>
				columns={tableColumns}
				data={contacts}
				total={totalContacts}
				dataType="contact"
				isLoadingBody={isLoading}
				isLoadingHeaders={isLoadingActions}
				tableState={uiTableState}
				setTableState={handleTableStateChange}
				onColumnVisibilityChange={handleColumnVisibilityChange}
				pageSize={tableState.pagination.pageSize}
				currentPage={tableState.pagination.pageIndex}
				columnVisibility={columns.visibility}
				hideViewMenu={true}
				filters={[
					{
						id: 'lists',
						label: 'List(s)',
						type: 'multiselect',
						placeholder: lists.isLoading ? 'Loading lists...' : 'Select lists',
						searchPlaceholder: 'Search lists...',
						searchable: true,
						options:
							lists.isSuccess && Array.isArray(lists.data)
								? lists.data.map((list: any) => ({ label: list.name, value: list.id }))
								: [],
					},
					{
						id: 'audiences',
						label: 'Audiences',
						type: 'multiselect',
						placeholder: audiences.isLoading ? 'Loading audiences...' : 'Select audiences',
						searchPlaceholder: 'Search audiences...',
						searchable: true,
						options:
							audiences.isSuccess && Array.isArray(audiences.data)
								? audiences.data.map((audience: any) => ({
										label: audience.name,
										value: audience.id,
									}))
								: [],
					},
					{
						id: 'dateRange',
						label: 'Sign Up Date',
						type: 'date',
						placeholder: 'Select sign up date',
						mode: 'range',
					},
				]}
				actionBarActions={selectedContacts => (
					<ButtonGroup attached={false} size="sm">
						<Button
							variant="secondary"
							size="sm"
							leftIcon={<MdEmail />}
							onClick={() => {
								console.log('Send email to:', selectedContacts);
								openDialog('sendEmail', { contacts: selectedContacts });
							}}
						>
							Send Email
						</Button>
						<Button
							variant="secondary"
							size="sm"
							leftIcon={<MdPersonAdd />}
							onClick={() => {
								console.log('Add to list:', selectedContacts);
								openDialog('addToList', { contacts: selectedContacts });
							}}
						>
							Add to List
						</Button>
						<Button
							variant="destructive"
							size="sm"
							leftIcon={<MdDelete />}
							onClick={() => {
								console.log('Delete contacts:', selectedContacts);
								openDialog('deleteContact', {
									dialogTitle: `Delete ${selectedContacts.length} contact${selectedContacts.length === 1 ? '' : 's'}?`,
									dialogDescription: 'This action cannot be undone.',
									contacts: selectedContacts,
								});
							}}
						>
							Delete
						</Button>
						<IconButton variant="secondary" size="sm" icon={<MdMoreHoriz />} />
					</ButtonGroup>
				)}
			/>
		</Box>
	);
}
