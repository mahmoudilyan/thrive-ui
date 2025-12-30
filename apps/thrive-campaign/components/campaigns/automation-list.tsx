// @ts-nocheck
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
	Switch,
} from '@thrive/ui';

import { DataTable } from '@thrive/ui';
import { API_CONFIG } from '@/services/config/api';
import { TableMainCellFolder } from '@thrive/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDialog } from '@thrive/ui';
import { TableHeaderCell } from '@thrive/ui';
import { AutomationDetails } from './automation-details';
import { Text } from '@thrive/ui';
import type { TableState as UiTableState } from '@thrive/ui';
import { MdMoreHoriz } from 'react-icons/md';

interface AutomationItem {
	id: string;
	rowtype?: string;
	folderId?: string;
	name?: string;
	folderName?: string;
	folderItems?: number;
	completed?: string;
	pending?: string;
	created_on?: string;
	status?: number;
	actions?: any;
	actionslist?: any;
	folder_name?: string;
	[key: string]: any;
}

interface HeaderConfig {
	title?: string;
	sort?: boolean;
	defaultsort?: boolean;
	isDefaultField?: boolean;
	enableHiding?: boolean;
	enablePinning?: boolean;
	toggle?: boolean;
	className?: string;
}

interface AutomationListProps {
	folderId?: string;
	view?: 'list' | 'folder';
}

export function AutomationList({ folderId, view = 'list' }: AutomationListProps) {
	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
	const { openDialog } = useDialog();
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const callbacks = {
		openDialog,
		navigate: (path: string) => router.push(path),
	};

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
		useDataTable<AutomationItem>(
			API_CONFIG.automations.getAutomations,
			API_CONFIG.automations.getAutomationsHeaders,
			{
				initialParams: {
					view,
					folderId: folderId ? Number(folderId) : undefined,
				},
			}
		);

	useEffect(() => {
		setTableState({
			view,
			folderId: folderId ? Number(folderId) : undefined,
		});
	}, [view, folderId, setTableState]);

	// Use columns from headers
	const columns = useMemo<ColumnDef<AutomationItem>[]>(() => {
		if (!headers.headers) return [];
		const allColumns = Object.entries(headers.headers).map(([key, value], index) => {
			const config = value as string | HeaderConfig;
			return {
				id: key,
				header: ({ table }) =>
					key === 'name' ? (
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
				enableSorting: true,
				enableHiding: key === 'name' ? false : true,
				cell: info => {
					const isFolder = info.row.original.rowtype === 'folder';
					const cellValue = info.getValue();

					if (isFolder && key === 'name') {
						return (
							<TableMainCellFolder
								row={info.row}
								table={info.table}
								showRowCheckbox={false}
								onPrimaryClick={() => {
									router.push(`/automation?view=folder&folderId=${info.row.original.id}`);
								}}
							>
								<span className="truncate font-medium text-ink-dark">{info.row.original.name}</span>
								<span className="truncate font-medium text-ink-light">
									{`${info.row.original.folderItems} Automations`}
								</span>
							</TableMainCellFolder>
						);
					}

					if (key === 'name' && !isFolder) {
						const automationData = info.row.original;
						return (
							<TableMainCell row={info.row} table={info.table}>
								<AutomationDetails
									name={automationData.name || ''}
									status={automationData.status || 0}
									createdDate={automationData.created_on}
									completed={automationData.completed}
									pending={automationData.pending}
									folderName={automationData.folder_name}
								/>
							</TableMainCell>
						);
					}

					if (key === 'completed' && !isFolder) {
						return (
							<Text variant="body-sm" as="p">
								{cellValue !== '-' ? cellValue : '-'}
							</Text>
						);
					}

					if (key === 'pending' && !isFolder) {
						return (
							<Text variant="body-sm" as="p">
								{cellValue !== '-' ? cellValue : '-'}
							</Text>
						);
					}

					if (key === 'created_on' && !isFolder) {
						return (
							<Text variant="body-sm" as="p">
								{cellValue || '-'}
							</Text>
						);
					}

					if (key === 'status' && !isFolder) {
						return (
							<Switch
								checked={info.row.original.status === 1}
								onCheckedChange={checked => {
									// Handle status toggle
									console.log('Toggle status for automation:', info.row.original.id, checked);
								}}
							/>
						);
					}

					return typeof cellValue === 'object'
						? cellValue.label || JSON.stringify(cellValue)
						: cellValue || '-';
				},
			};
		});

		// Find the main name column and other columns
		const nameColumn = allColumns.find(col => col.id === 'name');
		const otherColumns = allColumns.filter(
			col => col.id !== 'name' && col.id !== 'actions' && col.id !== 'id'
		);

		// Add actions column
		const actionsColumn: ColumnDef<AutomationItem> = {
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
										router.push(`/automation?view=folder&folderId=${info.row.original.id}`)
									}
								>
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
													name: info.row.original.name,
													id: info.row.original.id,
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

				const automationData = info.row.original;
				return (
					<TableCellActions row={info.row} table={info.table}>
						<ButtonGroup attached={true} size="sm">
							<Button variant="secondary">Analytics</Button>
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
										onClick={() => openDialog('automationDetails', { automation: automationData })}
									>
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem>Duplicate</DropdownMenuItem>
									<DropdownMenuItem>Copy To Account</DropdownMenuItem>
									<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</ButtonGroup>
					</TableCellActions>
				);
			},
		};

		return [
			...(nameColumn ? [nameColumn] : []),
			...otherColumns,
			actionsColumn,
		] as ColumnDef<AutomationItem>[];
	}, [headers, tableState]);

	const getBreadcrumbs = () => {
		const baseBreadcrumb = {
			label: 'All Automations',
			href: `/automation?view=${view}`,
			onClick: () => {
				setTableState({ folderId: undefined });
			},
		};

		if (!folderId) {
			return [baseBreadcrumb];
		}

		return [
			baseBreadcrumb,
			{
				label: 'Child Folder Name',
				actions: [
					{
						label: 'Rename',
						onClick: () => openDialog('renameFolder', { name: 'Child Folder Name', id: folderId }),
					},
					{
						label: 'Delete',
						onClick: () => openDialog('deleteFolder', { name: 'Child Folder Name', id: folderId }),
						isDelete: true,
					},
				],
			},
		];
	};

	return (
		<Box className="w-full">
			<DataTable<AutomationItem>
				columns={columns}
				data={data}
				total={total}
				dataType="automation"
				isLoadingBody={isLoadingBody}
				isLoadingHeaders={isLoadingHeaders}
				tableState={tableState as unknown as UiTableState}
				setTableState={(s: UiTableState) => setTableState(s as any)}
				onColumnVisibilityChange={setColumnVisibility}
				pageSize={tableState.pagination.pageSize}
				currentPage={tableState.pagination.pageIndex}
				columnVisibility={columnVisibility}
				hideViewMenu={false}
				filters={[]}
				view={view}
				onViewChange={handleViewChange}
			/>
		</Box>
	);
}
