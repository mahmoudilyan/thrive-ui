'use client';

import * as React from 'react';
import { MdOutlineFolder, MdOutlineList, MdSearch } from 'react-icons/md';
import type { TableState } from './types';
import { Flex } from '../flex';
import { DataTableFilters } from './data-table-filters';
import { DataTableColumnsDropdown } from './data-table-columns-dropdown';
import type { TableFilter } from './types';
import { Box } from '../box';
import { ToggleGroup, ToggleGroupItem } from '../toggle-group';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../input-group';
import { Text } from '../text';

type DataTableView = 'list' | 'folder';

interface DataTableHeaderProps {
	table: any;
	pageSize: number;
	total: number;
	dataType: string;
	searchPlaceholder?: string;
	hideSearch?: boolean;
	hideColumnsMenu?: boolean;
	hideViewMenu?: boolean;
	filters?: TableFilter[];
	className?: string;
	view?: DataTableView;
	onViewChange?: (view: DataTableView) => void;
	tableState?: TableState;
	setTableState?: (state: TableState) => void;
	onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
	onClearFilters?: () => void;
}

export function DataTableHeader({
	table,
	searchPlaceholder = 'Search...',
	hideSearch = false,
	hideColumnsMenu = false,
	hideViewMenu = false,
	filters = [],
	className,
	view = 'list',
	onViewChange,
	tableState,
	setTableState,
	pageSize,
	total,
	dataType,
	onColumnVisibilityChange,
	onClearFilters,
}: DataTableHeaderProps) {
	const [globalFilter, setGlobalFilter] = React.useState('');

	React.useEffect(() => {
		table?.setGlobalFilter?.(globalFilter);
	}, [globalFilter, table]);

	const handleViewChange = React.useCallback(
		(next: string) => {
			if (!onViewChange) return;
			onViewChange(next as DataTableView);
		},
		[onViewChange]
	);

	const columnGroups = React.useMemo(() => {
		const columns = table?.getAllColumns?.() ?? [];
		return columns.filter((column: any) => column.getCanHide?.());
	}, [table]);

	const activeFilters = tableState?.filters ? Object.keys(tableState.filters).length : 0;

	return (
		<Flex className="w-full md:w-auto justify-between">
			<Box className="flex items-center gap-2">
				<Text variant="body-sm" as="p">
					Showing {pageSize} of {total} {dataType}
				</Text>
			</Box>
			<Flex gap={'2'}>
				{!hideSearch && (
					<InputGroup size="sm">
						<InputGroupAddon align="inline-start">
							<MdSearch className="h-4 w-4 text-icon" />
						</InputGroupAddon>
						<InputGroupInput
							type="search"
							placeholder={searchPlaceholder}
							value={globalFilter}
							onChange={event => setGlobalFilter(event.target.value)}
							className="pl-9"
							size="sm"
						/>
					</InputGroup>
				)}

				{!hideColumnsMenu ? <DataTableColumnsDropdown table={table} /> : null}
				{!hideViewMenu ? (
					<ToggleGroup
						size="sm"
						type="single"
						onValueChange={handleViewChange}
						variant="secondary"
						value={view}
					>
						<ToggleGroupItem
							value="list"
							size="sm"
							onClick={() => handleViewChange('list')}
							data-state={view !== 'folder' && 'on'}
							leftIcon={<MdOutlineList />}
						>
							List view
						</ToggleGroupItem>
						<ToggleGroupItem
							value="folder"
							size="sm"
							onClick={() => handleViewChange('folder')}
							leftIcon={<MdOutlineFolder />}
						>
							Folder view
						</ToggleGroupItem>
					</ToggleGroup>
				) : null}
				<DataTableFilters
					filters={filters}
					tableState={tableState}
					setTableState={setTableState}
					className={className}
					buttonLabel="Filters"
				/>
			</Flex>
		</Flex>
	);
}
