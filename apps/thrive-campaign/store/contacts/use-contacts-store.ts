import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';

import type {
	ContactsTableState,
	DataField,
	DefaultFieldGroup,
	TableColumns,
	ContactsColumnVisibility,
	TableColumnConfig,
} from '@/types/contacts/index';
import { useApi, useApiMutation } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import { createContactsServerParams } from '@/lib/data-table';

// Constants
const STORE_NAME = 'contacts-storage' as const;

const DEFAULT_PAGE_SIZE = 25;

// Store Types
interface StoreState {
	// Table State
	tableState: ContactsTableState;

	// Column Configuration
	columns: {
		all: TableColumns;
		fixed: TableColumns;
		default: TableColumns;
		custom: TableColumns;
		visibility: ContactsColumnVisibility;
	};

	//  Selection
	selectedContactIds: string[];

	// Actions
	setTableState: (state: Partial<ContactsTableState>) => void;
	setFilters: (filters: Partial<ContactsTableState['filters']>) => void;
	selectContacts: (ids: string[]) => void;
	clearSelection: () => void;
	updateColumnVisibility: (updates: Partial<ContactsColumnVisibility>) => void;
	resetColumnVisibility: () => void;
	reorderColumns: (startIndex: number, endIndex: number) => void;
	setFields: (fields: { defaultFields: DefaultFieldGroup[]; dataFields: DataField[] }) => void;
}

// Helpers
const transformDefaultFieldsToColumns = (groups: DefaultFieldGroup[]): TableColumnConfig[] => {
	return groups.flatMap(group =>
		group.fields.map(field => ({
			id: `field${field.field_id}`,
			key: `field${field.field_id}`,
			name: field.field_name,
			title: field.field_name,
			visibility: field.field_visibility === 1,
			group: group.name,
			isDefaultField: true,
			secret: field.field_secret,
			sort: true,
		}))
	);
};

const transformDataFieldsToColumns = (fields: DataField[]): TableColumnConfig[] => {
	return fields.map(field => ({
		id: field.id,
		key: `data_${field.id}`,
		name: `${field.name}`,
		title: field.name,
		visibility: field.visibility === 1,
		group: 'Lead Data',
		sort: true,
	}));
};

// const UNTOGGLED_COLUMNS = [
// 	{
// 		id: 'registrationdate',
// 		key: 'registrationdate',
// 		name: 'Registration Date',
// 		visibility: true,
// 		isFixed: true,
// 		sort: true,
// 		defaultSort: true,
// 		title: 'Sign Up Date',
// 		group: 'Contact Information',
// 	},
// 	{
// 		id: 'list_name',
// 		key: 'list_name',
// 		name: 'Lists',
// 		visibility: true,
// 		sort: false,
// 		defaultSort: false,
// 		title: 'Lists',
// 		group: 'Contact Information',
// 	},
// 	{
// 		id: 'status',
// 		key: 'status',
// 		name: 'Status',
// 		visibility: true,
// 		sort: true,
// 		defaultSort: false,
// 		title: 'Status',
// 		group: 'Contact Information',
// 	},
// ];

// Create the store
export const useContactsStore = create<StoreState>()(
	persist(
		set => ({
			// Initial state
			tableState: {
				sorting: [],
				pagination: {
					pageIndex: 0,
					pageSize: DEFAULT_PAGE_SIZE,
				},
				columnsQueries: [],
				search: {
					value: '',
					regex: false,
				},
				searchBy: 'fields',
				filters: {},
			},
			columns: {
				all: [],
				fixed: [],
				default: [],
				custom: [],
				visibility: {},
			},
			filters: {},
			selectedContactIds: [],

			// Actions
			setTableState: newState =>
				set(
					produce(state => {
						state.tableState = { ...state.tableState, ...newState };
						// Auto-update columnsQueries when sorting or columns change
						if (newState.sorting !== undefined || state.columns.all.length > 0) {
							state.tableState.columnsQueries = state.columns.all
								.filter(col => state.columns.visibility[col.id] !== false)
								.map(col => ({
									data: col.key,
									searchable: true,
									orderable: col.sort ?? false,
									search: { value: '', regex: false },
								}));
						}
					})
				),

			setFilters: newFilters =>
				set(
					produce(state => {
						// If newFilters is empty object, clear all filters
						// Otherwise, merge with existing filters
						if (
							Object.keys(newFilters).length === 0 &&
							Object.keys(state.tableState.filters).length > 0
						) {
							state.tableState.filters = {};
						} else {
							state.tableState.filters = { ...state.tableState.filters, ...newFilters };
						}
						state.tableState.pagination.pageIndex = 0;
					})
				),

			selectContacts: ids =>
				set(
					produce(state => {
						state.selectedContactIds = ids;
					})
				),

			clearSelection: () =>
				set(
					produce(state => {
						state.selectedContactIds = [];
					})
				),

			updateColumnVisibility: updates =>
				set(
					produce(state => {
						state.columns.visibility = { ...state.columns.visibility, ...updates };
						// Update columnsQueries to reflect visible columns
						state.tableState.columnsQueries = state.columns.all
							.filter(col => state.columns.visibility[col.id] !== false)
							.map(col => ({
								data: col.key,
								searchable: true,
								orderable: col.sort ?? false,
								search: { value: '', regex: false },
							}));
					})
				),

			resetColumnVisibility: () =>
				set(
					produce(state => {
						state.columns.visibility = Object.fromEntries(
							state.columns.all.map(col => [col.id, col.visibility ?? true])
						);
					})
				),

			reorderColumns: (startIndex: number, endIndex: number) =>
				set(
					produce(state => {
						const result = Array.from(state.columns.all);
						const [removed] = result.splice(startIndex, 1);
						result.splice(endIndex, 0, removed);
						state.columns.all = result;
					})
				),

			setFields: ({ defaultFields, dataFields }) =>
				set(
					produce(state => {
						const defaultColumns = transformDefaultFieldsToColumns(defaultFields);
						const customColumns = transformDataFieldsToColumns(dataFields);

						// Check if phone field exists in default fields
						const phoneField = defaultColumns.find(col => col.secret === 'phone');
						const emailField = defaultColumns.find(col => col.secret === 'email');

						// Build all columns array
						const allColumns = [
							// Add email if not in default fields
							...(!emailField
								? [
										{
											title: 'Email',
											id: 'email',
											key: 'email',
											name: 'Email',
											visibility: true,
											isFixed: true,
											secret: 'email',
											sort: true,
											defaultSort: false,
											group: 'Contact Information',
										},
									]
								: []),
							// Add phone if not in default fields
							...(!phoneField
								? [
										{
											id: 'phone',
											key: 'phone',
											name: 'Phone',
											visibility: true,
											isFixed: true,
											secret: 'phone',
											sort: true,
											defaultSort: false,
											title: 'Phone Number',
											group: 'Personal Data',
										},
									]
								: []),
							...defaultColumns,
							...customColumns,
							//...UNTOGGLED_COLUMNS,
						];

						// Build visibility object with all columns
						const newVisibility: ContactsColumnVisibility = {
							...Object.fromEntries(allColumns.map(col => [col.id, col.visibility ?? true])),
						};

						state.columns = {
							fixed: state.columns.fixed,
							default: defaultColumns,
							custom: customColumns,
							all: allColumns,
							visibility: newVisibility,
						};

						// Initialize columnsQueries for visible columns
						state.tableState.columnsQueries = allColumns
							.filter(col => newVisibility[col.id] !== false)
							.map(col => ({
								data: col.key,
								searchable: true,
								orderable: col.sort ?? false,
								search: { value: '', regex: false },
							}));
					})
				),
		}),
		{
			name: STORE_NAME,
			storage: createJSONStorage(() => sessionStorage),
			partialize: state => ({
				tableState: {
					sorting: state.tableState.sorting,
					pagination: {
						pageSize: state.tableState.pagination.pageSize,
					},
					columnsQueries: state.tableState.columnsQueries,
					search: state.tableState.search,
					searchBy: state.tableState.searchBy,
					// Don't persist filters - they contain Date objects and other complex types
					// that don't serialize well, and users don't typically want filters to persist
					// filters: state.tableState.filters,
				},
			}),
		}
	)
);

// Main hook that combines store and queries
export function useContacts() {
	const store = useContactsStore();

	// Extract necessary state with shallow comparison
	const { tableState, selectedContactIds, columns } = useContactsStore(
		useShallow(state => ({
			tableState: state.tableState,
			selectedContactIds: state.selectedContactIds,
			columns: state.columns,
		}))
	);

	// Create properly formatted server params
	// Note: columns.all is used but not in deps because columnsQueries in tableState
	// is already updated when columns change (via updateColumnVisibility and setFields)
	const serverParams = useMemo(
		() => createContactsServerParams(tableState, columns.all),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tableState]
	);

	// Queries
	const { data: contactsData, isLoading: isLoadingContacts } = useApi(
		API_CONFIG.contacts.getContacts,
		{
			params: tableState as any,
		},
		serverParams,
		serverParams
	);

	const { data: contactFieldsData, isLoading: isLoadingContactFields } = useApi<{
		defaultFields: DefaultFieldGroup[];
		dataFields: DataField[];
	}>(API_CONFIG.contacts.getAllFields);

	const { data: contactLoadHeadersData, isLoading: isLoadingContactLoadHeaders } = useApi(
		API_CONFIG.contacts.getAllHeadersAndActions
	);

	// Note: We don't need to update visibility from headers anymore
	// The visibility is properly set from contact-fields.json in setFields

	// Mutations
	const mutations = {
		create: useApiMutation(API_CONFIG.contacts.createContact),

		update: useApiMutation(API_CONFIG.contacts.updateContact),

		delete: useApiMutation(API_CONFIG.contacts.deleteContact),

		move: useApiMutation(API_CONFIG.contacts.moveContacts),

		copy: useApiMutation(API_CONFIG.contacts.copyContacts),
	};

	return {
		// Store state and actions
		tableState: store.tableState,
		setTableState: store.setTableState,
		setFilters: store.setFilters,
		selectedContactIds,
		selectContacts: store.selectContacts,
		clearSelection: store.clearSelection,

		// Column management
		columns,
		setFields: store.setFields,

		updateColumnVisibility: store.updateColumnVisibility,
		resetColumnVisibility: store.resetColumnVisibility,
		reorderColumns: store.reorderColumns,

		// Query data
		contacts: contactsData?.data ?? [],
		totalContacts: contactsData?.contactsTotal ?? 0,
		activeContacts: contactsData?.contactsActive ?? 0,
		defaultFields: contactFieldsData?.defaultFields ?? [],
		dataFields: contactFieldsData?.dataFields ?? [],
		contactHeadersAndActions: contactLoadHeadersData ?? {},

		// Loading states
		isLoading: isLoadingContacts,
		isLoadingFields: isLoadingContactFields,
		isLoadingActions: isLoadingContactLoadHeaders,

		// Mutations
		createContact: mutations.create.mutate,
		updateContact: mutations.update.mutate,
		deleteContact: mutations.delete.mutate,
		moveContacts: mutations.move.mutate,
		copyContacts: mutations.copy.mutate,

		// Mutation states
		isCreating: mutations.create.isPending,
		isUpdating: mutations.update.isPending,
		isDeleting: mutations.delete.isPending,
		isMoving: mutations.move.isPending,
		isCopying: mutations.copy.isPending,
	};
}
