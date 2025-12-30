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
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@thrive/ui';

import { DataTable } from '@thrive/ui';
import { API_CONFIG } from '@/services/config/api';
import { TableMainCellFolder } from '@thrive/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDialog } from '@thrive/ui';
import { TableHeaderCell } from '@thrive/ui';
import type { TableState as UiTableState } from '@thrive/ui';
import { MdMoreHoriz, MdVisibility } from 'react-icons/md';

interface TemplateItem {
	id: string;
	rowtype?: string;
	folderId?: string;
	template?: {
		label: string;
		type: string;
		builder_type: string;
		editable: boolean;
	};
	thumb?: string;
	created_on?: string;
	created_on_timestamp?: number;
	created_by?: string;
	folder_name?: string;
	folderItems?: number;
	name?: string;
	actions?: any;
	actionslist?: any;
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
}

interface TemplatesListProps {
	folderId?: string;
	view?: 'list' | 'folder';
}

export function TemplatesList({ folderId, view = 'list' }: TemplatesListProps) {
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
		useDataTable<TemplateItem>(
			API_CONFIG.email.getTemplates,
			API_CONFIG.email.getTemplatesHeaders,
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
	const columns = useMemo<ColumnDef<TemplateItem>[]>(() => {
		if (!headers.headers) return [];
		const allColumns = Object.entries(headers.headers).map(([key, value], index) => {
			const config = value as string | HeaderConfig;
			return {
				id: key,
				// header label resolved below in header renderer
				header: ({ table }) =>
					key === 'template' ? (
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
				enableHiding: key === 'template' ? false : true,
				cell: info => {
					const isFolder = info.row.original.rowtype === 'folder';
					const cellValue = info.getValue();

					if (isFolder && key === 'template') {
						return (
							<TableMainCellFolder
								row={info.row}
								table={info.table}
								showRowCheckbox={false}
								onPrimaryClick={() => {
									router.push(`/campaigns/templates?view=folder&folderId=${info.row.original.id}`);
								}}
							>
								<span className="truncate font-medium text-ink-dark">{info.row.original.name}</span>
								<span className="truncate font-medium text-ink-light">
									{`${info.row.original.folderItems} Templates`}
								</span>
							</TableMainCellFolder>
						);
					}

					if (key === 'template') {
						const templateData = info.row.original;
						return (
							<TableMainCell row={info.row} table={info.table}>
								<Flex gap="3" align="center">
									<Flex direction="col" gap="1" className="flex-1 min-w-0">
										<HoverCard>
											<HoverCardTrigger asChild>
												<Text
													variant="body-md"
													fontWeight="medium"
													truncate
													className="text-ink-dark cursor-pointer"
												>
													{templateData.template?.label || 'Untitled Template'}
												</Text>
											</HoverCardTrigger>
											<HoverCardContent className="p-1">
												<Flex className="flex flex-start gap-2">
													<img
														src={`https://app.vbout.com/${templateData.thumb}`}
														alt={templateData.template?.label || 'Template'}
														className="max-w-[400px] max-h-[600px] object-contain"
													/>
												</Flex>
											</HoverCardContent>
										</HoverCard>
										{/* <Text variant="body-sm" truncate className="text-ink-light">
											{templateData.template?.type || 'Unknown Type'}
											{templateData.template?.builder_type &&
												` • ${templateData.template.builder_type}`}
										</Text> */}
										{/* {templateData.created_on && (
											<Text variant="body-xs" truncate className="text-ink-lighter">
												Created: {templateData.created_on}
											</Text>
										)} */}
									</Flex>
								</Flex>
							</TableMainCell>
						);
					}

					if (key === 'created_by' && !isFolder) {
						return (
							<Text variant="body-sm" truncate className="max-w-[200px]">
								{info.row.original.created_by || '-'}
							</Text>
						);
					}

					if (key === 'created_on' && !isFolder) {
						return (
							<Text variant="body-sm" truncate className="max-w-[200px]">
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

		// Find the main template column and other columns
		const templateColumn = allColumns.find(col => col.id === 'template');
		const otherColumns = allColumns.filter(
			col => col.id !== 'template' && col.id !== 'actions' && col.id !== 'id'
		);

		// Add actions column
		const actionsColumn: ColumnDef<TemplateItem> = {
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
										router.push(`/campaigns/templates?view=folder&folderId=${info.row.original.id}`)
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
													dialogTitle: 'Delete Folder?',
													dialogDescription:
														'All templates in this folder will be moved to the root.',
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

				const templateData = info.row.original;
				return (
					<TableCellActions row={info.row} table={info.table}>
						<ButtonGroup attached={true} size="sm">
							<Button
								variant="secondary"
								onClick={() =>
									openDialog(
										'templatePreview',
										{
											templateId: templateData.id,
											templateName: templateData.template?.label,
										},
										{
											size: 'full',
										}
									)
								}
							>
								Preview
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
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem>Duplicate</DropdownMenuItem>
									<DropdownMenuItem>Add to Folder</DropdownMenuItem>
									<DropdownMenuItem
										variant="destructive"
										onClick={() =>
											openDialog('deleteTemplate', {
												dialogTitle: `Delete "${templateData.template?.label}"?`,
												dialogDescription: 'This action cannot be undone.',
												templateName: templateData.template?.label,
												templateId: templateData.id,
											})
										}
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</ButtonGroup>
					</TableCellActions>
				);
			},
		};

		return [
			...(templateColumn ? [templateColumn] : []),
			...otherColumns,
			actionsColumn,
		] as ColumnDef<TemplateItem>[];
	}, [headers, tableState, openDialog, router]);

	return (
		<Box className="w-full">
			<DataTable<TemplateItem>
				columns={columns}
				data={data}
				total={total}
				dataType="template"
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
						id: 'type',
						label: 'Type',
						type: 'select',
						placeholder: 'Select type',
						options: [
							{ label: 'Drag & Drop', value: 'dragdrop' },
							{ label: 'HTML', value: 'html' },
							{ label: 'Plain Text', value: 'text' },
						],
					},
					{
						id: 'builder_type',
						label: 'Builder',
						type: 'select',
						placeholder: 'Select builder',
						options: [
							{ label: 'New Builder', value: 'new' },
							{ label: 'Legacy Builder', value: 'legacy' },
						],
					},
				]}
				view={view}
				onViewChange={handleViewChange}
			/>
		</Box>
	);
}
