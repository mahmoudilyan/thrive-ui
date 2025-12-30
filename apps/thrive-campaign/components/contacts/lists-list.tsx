'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import type { ColumnDef } from '@tanstack/react-table';
import {
	Box,
	Button,
	ButtonGroup,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	IconButton,
	TableMainCell,
	TableMainHeaderCell,
	TableCellActions,
	Text,
	Flex,
} from '@thrive/ui';

import { DataTable } from '@thrive/ui';
import { API_CONFIG } from '@/services/config/api';
import { TableMainCellFolder } from '@thrive/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDialog } from '@thrive/ui';
import { TableHeaderCell } from '@thrive/ui';
import type { TableState as UiTableState } from '@thrive/ui';
import { MdMoreHoriz, MdFolderOpen } from 'react-icons/md';
import { ListDetails } from './list-details';
import type { List } from '@/types/lists';

interface HeaderConfig {
	title?: string;
	sort?: boolean;
	defaultsort?: boolean;
	isDefaultField?: boolean;
	enableHiding?: boolean;
	enablePinning?: boolean;
	toggle?: boolean;
}

interface ListsListProps {
	folderId?: string;
	view?: 'list' | 'folder';
}

export function ListsList({ folderId, view = 'list' }: ListsListProps) {
	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
	const { openDialog } = useDialog();
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const handleViewChange = (newView: 'list' | 'folder') => {
		const params = new URLSearchParams(searchParams);
		params.set('view', newView);

		// Clear folderId when switching to list view
		if (newView === 'list') {
			params.delete('folderId');
		}

		router.push(`${pathName}?${params.toString()}`);
	};

	// Initialize the data table hook with both data and headers
	const { data, total, tableState, setTableState, isLoadingBody, headers, isLoadingHeaders } =
		useDataTable<List>(API_CONFIG.lists.getLists, API_CONFIG.lists.getListsHeaders, {
			initialParams: {
				view,
				folderId: folderId ? Number(folderId) : undefined,
			},
		});

	useEffect(() => {
		setTableState({
			view,
			folderId: folderId ? Number(folderId) : undefined,
		});
	}, [view, folderId, setTableState]);

	// Use columns from headers
	const columns = useMemo<ColumnDef<List>[]>(() => {
		if (!headers.headers) return [];
		const allColumns = Object.entries(headers.headers).map(([key, value], index) => {
			const config = value as string | HeaderConfig;
			return {
				id: key,
				// header label resolved below in header renderer
				header: ({ table }) =>
					key === 'list' ? (
						<TableMainHeaderCell
							label={typeof config === 'object' ? config.title : key}
							columnIndex={0}
							table={table}
						/>
					) : typeof config === 'object' ? (
						<TableHeaderCell label={config.title} columnIndex={0} />
					) : (
						<>{config || key}</>
					),
				enableSorting: typeof config === 'object' ? config.sort : false,
				enableHiding: key === 'list' ? false : true,
				cell: info => {
					const isFolder = info.row.original.rowtype === 'folder';
					const cellValue = info.getValue();

					if (isFolder && key === 'list') {
						return (
							<TableMainCellFolder
								row={info.row}
								table={info.table}
								showRowCheckbox={false}
								onPrimaryClick={() => {
									router.push(`/contacts/lists?view=folder&folderId=${info.row.original.id}`);
								}}
							>
								<span className="truncate font-medium text-ink-dark">{info.row.original.name}</span>
								<span className="truncate font-medium text-ink-light">
									{`${info.row.original.folderItems} Lists`}
								</span>
							</TableMainCellFolder>
						);
					}

					if (key === 'list') {
						const listData = info.row.original;
						return (
							<TableMainCell row={info.row} table={info.table}>
								<ListDetails
									name={listData.list || 'Untitled List'}
									contactsCount={listData.contacts || 0}
									confirmed={listData.status_confirmed || 0}
									unconfirmed={listData.status_unconfirmed || 0}
									unsubscribed={listData.status_unsubscribed || 0}
									bounced={listData.status_bounced || 0}
									complaints={listData.status_complaint || 0}
									createdDate={listData.created_on}
									folderName={listData.folder_name}
								/>
							</TableMainCell>
						);
					}

					// Handle status columns
					if (
						key === 'status_confirmed' ||
						key === 'status_unconfirmed' ||
						key === 'status_unsubscribed' ||
						key === 'status_bounced' ||
						key === 'status_complaint'
					) {
						return (
							<Text variant="body-sm" className="text-ink-dark">
								{info.row.original[key] || '-'}
							</Text>
						);
					}

					if (key === 'contacts' && !isFolder) {
						return (
							<Text variant="body-sm" fontWeight="medium" className="text-ink-dark">
								{info.row.original[key] || 0}
							</Text>
						);
					}

					if (key === 'created_on' && !isFolder) {
						return (
							<Text variant="body-sm" className="text-ink-light">
								{info.row.original.created_on || '-'}
							</Text>
						);
					}

					return typeof cellValue === 'object'
						? cellValue.label || JSON.stringify(cellValue)
						: cellValue || '-';
				},
			};
		});

		// Find the main list column and other columns
		const listColumn = allColumns.find(col => col.id === 'list');
		const otherColumns = allColumns.filter(
			col => col.id !== 'list' && col.id !== 'actions' && col.id !== 'id'
		);

		// Add actions column
		const actionsColumn: ColumnDef<List> = {
			id: 'actions',
			header: '',
			enableSorting: false,
			enableHiding: false,
			size: 60,
			cell: info => {
				const isFolder = info.row.original.rowtype === 'folder';
				if (isFolder) {
					return (
						<TableCellActions row={info.row} table={info.table}>
							<ButtonGroup attached={true} size="sm">
								<Button
									variant="secondary"
									onClick={() =>
										router.push(`/contacts/lists?view=folder&folderId=${info.row.original.id}`)
									}
								>
									<MdFolderOpen className="size-4" />
									View Folder
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
									<DropdownMenuContent>
										<DropdownMenuItem
											onClick={() =>
												openDialog('renameFolder', {
													name: info.row.original.name,
													id: info.row.original.id,
												})
											}
										>
											Rename Folder
										</DropdownMenuItem>
										<DropdownMenuItem
											variant="destructive"
											onClick={() =>
												openDialog('deleteFolder', {
													dialogTitle: 'Delete Folder?',
													dialogDescription: 'All lists in this folder will be moved to the root.',
													folderName: info.row.original.name,
													folderId: info.row.original.id,
												})
											}
										>
											Delete Folder
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</ButtonGroup>
						</TableCellActions>
					);
				}

				const listData = info.row.original;
				return (
					<TableCellActions row={info.row} table={info.table}>
						<ButtonGroup attached={true} size="sm">
							<Button
								variant="secondary"
								onClick={() => router.push(`/contacts/lists/${listData.id}/form`)}
							>
								Fields & Form
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
								<DropdownMenuContent>
									<DropdownMenuItem>Rename</DropdownMenuItem>
									<DropdownMenuItem>Mass Import</DropdownMenuItem>
									<DropdownMenuItem>Export Contacts</DropdownMenuItem>
									<DropdownMenuItem>Merge List To</DropdownMenuItem>
									<DropdownMenuItem>Copy List</DropdownMenuItem>
									<DropdownMenuItem>Batch Validation</DropdownMenuItem>
									<DropdownMenuItem disabled>───────</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => router.push(`/contacts/lists/${listData.id}/form#settings`)}
									>
										Form Settings
									</DropdownMenuItem>
									<DropdownMenuItem>Form Preview</DropdownMenuItem>
									<DropdownMenuItem>Form Code</DropdownMenuItem>
									<DropdownMenuItem disabled>───────</DropdownMenuItem>
									<DropdownMenuItem>List Analytics</DropdownMenuItem>
									<DropdownMenuItem>Export History</DropdownMenuItem>
									<DropdownMenuItem disabled>───────</DropdownMenuItem>
									<DropdownMenuItem>Add To Folder</DropdownMenuItem>
									<DropdownMenuItem disabled>───────</DropdownMenuItem>
									<DropdownMenuItem
										variant="destructive"
										onClick={() =>
											openDialog('deleteList', {
												dialogTitle: `Delete "${listData.list}"?`,
												dialogDescription:
													'This action cannot be undone. All contacts will be removed.',
												listName: listData.list,
												listId: listData.id,
											})
										}
									>
										Delete List
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</ButtonGroup>
					</TableCellActions>
				);
			},
		};

		return [
			...(listColumn ? [listColumn] : []),
			...otherColumns,
			actionsColumn,
		] as ColumnDef<List>[];
	}, [headers, tableState, openDialog, router]);

	return (
		<Box className="w-full">
			<DataTable<List>
				columns={columns}
				data={data}
				total={total}
				dataType="list"
				isLoadingBody={isLoadingBody}
				isLoadingHeaders={isLoadingHeaders}
				tableState={tableState as unknown as UiTableState}
				setTableState={(s: UiTableState) => setTableState(s as any)}
				onColumnVisibilityChange={setColumnVisibility}
				pageSize={tableState.pagination.pageSize}
				currentPage={tableState.pagination.pageIndex}
				columnVisibility={columnVisibility}
				hideViewMenu={false}
				filters={[
					{
						id: 'folder',
						label: 'Folder',
						type: 'select',
						placeholder: 'Select folder',
						options: [
							{ label: 'All Folders', value: 'all' },
							{ label: 'No Folder', value: 'none' },
						],
					},
				]}
				view={view}
				onViewChange={handleViewChange}
			/>
		</Box>
	);
}
