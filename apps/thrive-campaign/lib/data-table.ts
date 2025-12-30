// Re-export data-table utilities from UI package
export * from '@thrive/ui';

import type { ContactsTableState, TableColumnConfig } from '@/types/contacts/index';
import type { TableState, DataTableColumn } from '@thrive/ui';

// Import with type assertion to use updated signature
// TODO: Remove type assertion after UI package is rebuilt
import { createServerParams as _createServerParams } from '@thrive/ui';
const createGenericServerParams = _createServerParams as (
	tableState: TableState,
	additionalParams?: Record<string, any>
) => any;

/**
 * Adapts ContactsTableState to generic TableState and creates DataTables-formatted server parameters
 * This is a thin wrapper around the generic createServerParams from the UI package
 */
export function createContactsServerParams(
	tableState: ContactsTableState,
	columns: TableColumnConfig[]
) {
	// Build columns array for visible columns only
	const visibleColumns = columns.filter(col => !col.id.startsWith('_') && col.id !== 'actions');

	// Convert ContactsTableState sorting format to generic TableState format
	const genericSorting = tableState.sorting.map(sort => {
		const columnIndex = visibleColumns.findIndex(col => col.id === sort.id);
		return {
			column: columnIndex >= 0 ? columnIndex : 0,
			dir: sort.desc ? ('desc' as const) : ('asc' as const),
		};
	});

	// Convert columns to generic DataTableColumn format
	const genericColumns: DataTableColumn[] = visibleColumns.map(col => ({
		data: col.key,
		searchable: true,
		orderable: col.sort ?? false,
	}));

	// Build generic TableState
	const genericTableState: TableState = {
		pagination: tableState.pagination,
		sorting: genericSorting,
		columns: genericColumns,
		search: tableState.search.value || '',
		view: 'list',
		filters: {
			// Map contacts filters to generic format
			...(tableState.filters?.lists && tableState.filters.lists.length > 0
				? { lists: tableState.filters.lists }
				: {}),
			...(tableState.filters?.audiences && tableState.filters.audiences.length > 0
				? { audiences: tableState.filters.audiences }
				: {}),
			...(tableState.filters?.dateRange ? { dateRange: tableState.filters.dateRange } : {}),
		},
	};

	// Additional contacts-specific params
	const additionalParams = {
		searchBy: tableState.searchBy || 'fields',
		isBDA: tableState.filters?.isBDA ? 1 : undefined,
	};

	// Use the generic function from UI package
	return createGenericServerParams(genericTableState, additionalParams);
}
