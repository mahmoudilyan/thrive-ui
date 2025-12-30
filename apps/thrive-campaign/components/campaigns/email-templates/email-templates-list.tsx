'use client';

import { Box, Text, Image, HStack, Flex } from '@chakra-ui/react';
import { useState, useMemo, useEffect } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { TableColumn } from '@/components/data-table/types';
import { TableMainCell } from '@/components/data-table/table-main-cell';
import { TableMainHeaderCell } from '@/components/data-table/table-main-header-cell';

import { DataTable } from '@/components/data-table/data-table';
import { API_CONFIG } from '@/services/config/api';
import { TableMainCellFolder } from '@/components/data-table/table-main-cell-folder';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomDialog } from '@/hooks/use-custom-dialog';
import { transformActions } from '@/lib/utils';
import { Callbacks } from '@/types/table';
import { TableHeaderCell } from '@/components/data-table/table-header-cell';
import { DataNav } from '@thrive/ui';

interface EmailTemplateItem {
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

interface EmailTemplatesListProps {
	folderId?: string;
	view?: 'list' | 'folder';
}

export function EmailTemplatesList({ folderId, view = 'list' }: EmailTemplatesListProps) {
	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
	const { openDialog } = useCustomDialog();
	const router = useRouter();
	const pathName = usePathname();

	const callbacks: Callbacks = {
		openDialog,
		navigate: (path: string) => router.push(path),
	};

	// Initialize the data table hook with both data and headers
	const { data, total, tableState, setTableState, isLoadingBody, headers, isLoadingHeaders } =
		useDataTable<EmailTemplateItem>(
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
			folderId: folderId ? Number(folderId) : undefined,
		});
	}, [folderId, setTableState]);

	// Use columns from headers
	const columns = useMemo<TableColumn<EmailTemplateItem>[]>(() => {
		if (!headers.headers) return [];
		const allColumns = Object.entries(headers.headers).map(([key, value], index) => {
			const config = value as string | HeaderConfig;
			return {
				id: key,
				title: typeof config === 'object' ? config.title : config || key,
				defaultSort: typeof config === 'object' ? config.defaultsort : false,
				header: ({ table }) =>
					key === 'template' ? (
						<TableMainHeaderCell
							header={typeof config === 'object' ? config.title : key}
							table={table}
							canSort={typeof config === 'object' ? config.sort : false}
							setTableState={setTableState}
							columnIndex={index}
							tableState={tableState}
						/>
					) : typeof config === 'object' ? (
						<TableHeaderCell
							header={config.title}
							canSort={typeof config === 'object' ? config.sort : false}
							setTableState={setTableState}
							columnIndex={index}
							tableState={tableState}
						/>
					) : (
						<>{config || key}</>
					),
				enableSorting: false,
				enableHiding: key === 'template' ? false : true,
				cell: info => {
					const isFolder = info.row.original.rowtype === 'folder';
					const cellValue = info.getValue();

					if (isFolder && key === 'template') {
						return (
							<TableMainCellFolder
								value={info.row.original.name}
								folderInfo={`${info.row.original.folderItems} templates`}
								folderId={info.row.original.folderId}
								setTableState={setTableState}
								actions={transformActions(
									headers.actions,
									info.row.original.actionslist || null,
									info.row.original,
									callbacks,
									pathName,
									'template'
								)}
							/>
						);
					}

					if (key === 'template') {
						const templateData = info.row.original;
						return (
							<HStack gap={3}>
								<Image
									src={templateData.thumb}
									alt={templateData.template?.label}
									width="50px"
									height="50px"
									objectFit="cover"
									borderRadius="md"
								/>
								<Flex direction="column">
									<Text fontWeight="medium">{templateData.template?.label}</Text>
									<Text fontSize="sm" color="text.light">
										{templateData.template?.type}
									</Text>
								</Flex>
							</HStack>
						);
					}

					if (key === 'created_on' && !isFolder) {
						return <Text>{info.row.original.created_on}</Text>;
					}

					if (key === 'created_by' && !isFolder) {
						return (
							<Text fontSize="sm" color="text.light">
								{info.row.original.created_by}
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
		const otherColumns = allColumns.filter(col => col.id !== 'template' && col.id !== 'actions');

		return [...(templateColumn ? [templateColumn] : []), ...otherColumns];
	}, [headers, tableState]);

	const getBreadcrumbs = () => {
		const baseBreadcrumb = {
			label: 'All Templates',
			href: `/campaigns/email-templates?view=${view}`,
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
		<Box>
			<DataNav
				breadcrumbs={getBreadcrumbs()}
				actions={[
					{
						label: 'Create Folder',
						onClick: () =>
							openDialog('createFolder', {
								type: 'template',
							}),
					},
					{
						label: 'Manage Folders',
						onClick: () =>
							openDialog(
								'manageFolders',
								{},
								{
									size: 'xl',
								}
							),
					},
				]}
				primaryAction={{
					label: 'Create Template',
					onClick: () => router.push('/campaigns/email-templates/create'),
				}}
			/>
			<DataTable<EmailTemplateItem>
				columns={columns}
				data={data}
				total={total}
				dataType="template"
				isLoadingBody={isLoadingBody}
				isLoadingHeaders={isLoadingHeaders}
				tableState={tableState}
				setTableState={setTableState}
				onColumnVisibilityChange={setColumnVisibility}
				pageSize={tableState.pagination.pageSize}
				currentPage={tableState.pagination.pageIndex}
				searchValue={tableState.search}
				columnVisibility={columnVisibility}
			/>
		</Box>
	);
}
