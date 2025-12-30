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
} from '@thrive/ui';

import { DataTable } from '@thrive/ui';
import { API_CONFIG } from '@/services/config/api';
import { TableMainCellFolder } from '@thrive/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDialog } from '@thrive/ui';
import { transformActions } from '@/lib/utils';
import { Callbacks } from '@/types/table';
import { TableHeaderCell } from '@thrive/ui';
import { CampaignDetails } from './campaign-details';
import { TargetDetails } from './target-details';
import CampaignStats from './campaign-stats';
import { PageSection, Text } from '@thrive/ui';
import type { TableState as UiTableState } from '@thrive/ui';
import CampaignActions from './campaign-actions';
import Table from '@mui/material/Table';
import { MdMoreHoriz } from 'react-icons/md';

interface CampaignItem {
	id: string;
	rowtype?: string;
	folderId?: string;
	campaign?: {
		name: string;
		subject: string;
		type: string;
		thumb: string;
		status: {
			name: string;
			scheduled: string;
		};
		from: string;
		fromname: string;
		replyto: string;
		details: any;
	};
	target?: {
		lists: string[];
		audiences: string[];
		folders: string[];
		total: number;
	};
	type?: string;
	date?: string;
	startsenddate?: string;
	endsenddate?: string;
	labels?: any;
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

interface CampaignsListProps {
	folderId?: string;
	view?: 'list' | 'folder';
}

export function CampaignsList({ folderId, view = 'list' }: CampaignsListProps) {
	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
	const { openDialog } = useDialog();
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const callbacks: Callbacks = {
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
		useDataTable<CampaignItem>(
			API_CONFIG.campaigns.getCampaigns,
			API_CONFIG.campaigns.getCampaignsHeaders,
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
	const columns = useMemo<ColumnDef<CampaignItem>[]>(() => {
		if (!headers.headers) return [];
		const allColumns = Object.entries(headers.headers).map(([key, value], index) => {
			const headerConfig = value as string | HeaderConfig;
			const title = typeof headerConfig === 'object' ? headerConfig.title : key;

			// Define proportional column sizes - these act as ratios to fill available space
			// Higher number = takes more space proportionally
			const columnSizes: Record<string, number> = {
				campaign: 350, // ~35% of space
				subject: 200, // ~20% of space
				target: 180, // ~18% of space
				details: 250, // ~25% of space
			};

			const sizeValue = columnSizes[key] || 150;

			return {
				id: key,
				// header label resolved below in header renderer
				header: ({ table }) =>
					key === 'campaign' ? (
						<TableMainHeaderCell label={title} columnIndex={0} table={table} />
					) : typeof headerConfig === 'object' ? (
						<TableHeaderCell label={headerConfig.title} columnIndex={0} />
					) : (
						<>{headerConfig || key}</>
					),
				enableSorting: true,
				enableHiding: key === 'campaign' ? false : true,
				enableResizing: false,
				size: sizeValue, // Proportional sizing - will auto-fit to container
				meta: {
					label: title || key,
					group: 'Campaign Information',
				},
				cell: info => {
					const isFolder = info.row.original.rowtype === 'folder';
					const cellValue = info.getValue();

					if (isFolder && key === 'campaign') {
						return (
							<TableMainCellFolder
								row={info.row}
								table={info.table}
								showRowCheckbox={false}
								onPrimaryClick={() => {
									router.push(`/campaigns?view=folder&folderId=${info.row.original.id}`);
								}}
							>
								<span className="truncate font-medium text-ink-dark">{info.row.original.name}</span>
								<span className="truncate font-medium text-ink-light">
									{`${info.row.original.folderItems} Campaigns`}
								</span>
							</TableMainCellFolder>
						);
					}

					if (key === 'campaign') {
						const campaignData = info.row.original;
						return (
							<TableMainCell row={info.row} table={info.table}>
								<CampaignDetails
									name={campaignData.campaign?.name || ''}
									type={campaignData.campaign?.type === 'ab' ? 'A/B Campaign' : 'Regular'}
									status={campaignData.campaign?.status?.name as 'draft' | 'sent' | 'paused'}
									sendingType={campaignData.labels?.warmup ? 'Predictive Sending' : undefined}
									startDate={campaignData.startsenddate}
									completedDate={campaignData.endsenddate}
									createdDate={campaignData.date}
								/>
							</TableMainCell>
						);
					}

					if (key === 'subject' && !isFolder) {
						return (
							<Text variant="body-sm" truncate className="max-w-[200px]" as="p">
								{info.row.original.campaign?.subject || '-'}
							</Text>
						);
					}

					if (key === 'target' && !isFolder) {
						return (
							<TargetDetails
								lists={info.row.original.target?.lists || []}
								audiences={info.row.original.target?.audiences || []}
							/>
						);
					}

					if (key === 'details' && !isFolder) {
						const row = info.row.original;
						const stats = {
							total: row.target.total,
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							totalA: row.target.a,
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							totalB: row.target.b,
							opened: row.campaign.details.email_opened,
							clicked: row.campaign.details.link_clicked,
							campaignInfo: {
								from: row.campaign.from,
								replyTo: row.campaign.replyto,
								subject: row.campaign.subject,
								fromName: row.campaign.fromname,
								status: row.campaign.status.name as 'draft' | 'sent' | 'scheduled',
							},
						};
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						return <CampaignStats stats={stats} campaignInfo={stats.campaignInfo} />;
					}

					return typeof cellValue === 'object'
						? cellValue.label || JSON.stringify(cellValue)
						: cellValue || '-';
				},
			};
		});

		// Find the main campaign column and other columns
		const campaignColumn = allColumns.find(col => col.id === 'campaign');
		const otherColumns = allColumns.filter(
			col => col.id !== 'campaign' && col.id !== 'actions' && col.id !== 'id'
		);

		// // Add actions column
		// const actionsColumn: ColumnDef<CampaignItem> = {
		// 	id: 'actions',
		// 	header: '',
		// 	enableSorting: false,
		// 	enableHiding: false,
		// 	size: 60,
		// 	cell: info => {
		// 		const isFolder = info.row.original.rowtype === 'folder';
		// 		if (isFolder) {
		// 			return (
		// 				<TableCellActions row={info.row} table={info.table}>
		// 					<ButtonGroup attached={true} size="sm">
		// 						<Button
		// 							variant="secondary"
		// 							onClick={() =>
		// 								router.push(`/campaigns?view=folder&folderId=${info.row.original.id}`)
		// 							}
		// 						>
		// 							View Folder
		// 						</Button>
		// 						<DropdownMenu>
		// 							<DropdownMenuTrigger asChild>
		// 								<IconButton
		// 									variant="secondary"
		// 									size="sm"
		// 									aria-label="More options"
		// 									icon={<MdMoreHoriz className="size-4" />}
		// 								/>
		// 							</DropdownMenuTrigger>
		// 							<DropdownMenuContent>
		// 								<DropdownMenuItem
		// 									onClick={() => openDialog('renameFolder', { campaign: campaignData })}
		// 								>
		// 									Rename Folder
		// 								</DropdownMenuItem>
		// 								<DropdownMenuItem
		// 									variant="destructive"
		// 									onClick={() =>
		// 										openDialog('deleteCampaign', {
		// 											dialogTitle: 'Delete Folder?',
		// 											dialogDescription:
		// 												'All campaigns in this folder will be moved to the root.',
		// 											campaignName: info.row.original.name,
		// 											campaignId: info.row.original.id,
		// 											onConfirm: (id: string) => {
		// 												console.log('Deleting folder:', id);
		// 												// Add your delete logic here
		// 											},
		// 										})
		// 									}
		// 								>
		// 									Delete Folder
		// 								</DropdownMenuItem>
		// 							</DropdownMenuContent>
		// 						</DropdownMenu>
		// 					</ButtonGroup>
		// 				</TableCellActions>
		// 			);
		// 		}

		// 		const campaignData = info.row.original;
		// 		return (
		// 			<TableCellActions row={info.row} table={info.table}>
		// 				<ButtonGroup attached={true} size="sm">
		// 					<Button variant="secondary">Analytics</Button>
		// 					<DropdownMenu>
		// 						<DropdownMenuTrigger asChild>
		// 							<IconButton
		// 								variant="secondary"
		// 								size="sm"
		// 								aria-label="More options"
		// 								icon={<MdMoreHoriz className="size-4" />}
		// 							/>
		// 						</DropdownMenuTrigger>
		// 						<DropdownMenuContent>
		// 							<DropdownMenuItem
		// 								onClick={() => openDialog('campaignDetails', { campaign: campaignData })}
		// 							>
		// 								View Details
		// 							</DropdownMenuItem>
		// 							<DropdownMenuItem>Analytics</DropdownMenuItem>
		// 							<DropdownMenuItem>Edit</DropdownMenuItem>
		// 							<DropdownMenuItem
		// 								variant="destructive"
		// 								onClick={() =>
		// 									openDialog('deleteCampaign', {
		// 										dialogTitle: `Delete "${campaignData.name}"?`,
		// 										dialogDescription: 'This action cannot be undone.',
		// 										campaignName: campaignData.name,
		// 										campaignId: campaignData.id,
		// 										onConfirm: (id: string) => {
		// 											console.log('Deleting campaign:', id);
		// 											// Add your delete logic here
		// 										},
		// 									})
		// 								}
		// 							>
		// 								Delete
		// 							</DropdownMenuItem>
		// 						</DropdownMenuContent>
		// 					</DropdownMenu>
		// 				</ButtonGroup>
		// 			</TableCellActions>
		// 		);
		// 	},
		// };

		return [
			...(campaignColumn ? [campaignColumn] : []),
			...otherColumns,
			// actionsColumn,
		] as ColumnDef<CampaignItem>[];
	}, [headers, tableState]);

	const getBreadcrumbs = () => {
		const baseBreadcrumb = {
			label: 'All Campaigns',
			href: `/campaigns?view=${view}`,
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
		<Box className="w-full p-4">
			{/* <PageSection
				showSidebarToggle
				breadcrumbs={getBreadcrumbs()}
				secondaryActions={[
					{ label: 'List', onClick: () => router.push('/campaigns?view=list') },
					{ label: 'Folder', onClick: () => router.push('/campaigns?view=folder') },
				]}
				otherActions={[
					{
						label: 'Create Folder',
						onClick: () =>
							openDialog('createFolder', {
								type: 'campaign',
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
					label: 'Create Campaign',
					onClick: () => router.push('/campaigns/create'),
				}}
			/> */}
			<DataTable<CampaignItem>
				columns={columns}
				data={data}
				total={total}
				dataType="campaign"
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
						id: 'status',
						label: 'Status',
						type: 'select',
						placeholder: 'Select status',
						options: [
							{ label: 'Draft', value: 'draft' },
							{ label: 'Sent', value: 'sent' },
							{ label: 'Scheduled', value: 'scheduled' },
							{ label: 'Paused', value: 'paused' },
						],
					},
					{
						id: 'lists',
						label: 'List(s)',
						type: 'multiselect',
						placeholder: 'Select lists',
						searchPlaceholder: 'Search lists...',
						searchable: true,
						options: async () => {
							// Simulate API call - replace with actual API call
							return [
								{ label: 'Newsletter Subscribers', value: '1' },
								{ label: 'Product Updates', value: '2' },
								{ label: 'VIP Members', value: '3' },
								{ label: 'Trial Users', value: '4' },
							];
						},
					},
					{
						id: 'type',
						label: 'Type',
						type: 'select',
						placeholder: 'Select type',
						options: [
							{ label: 'Regular', value: 'regular' },
							{ label: 'A/B Campaign', value: 'ab' },
						],
					},
					{
						id: 'warmup',
						label: 'Predictive Sending',
						type: 'boolean',
						trueLabel: 'Enabled',
						falseLabel: 'Disabled',
					},
				]}
				view={view}
				onViewChange={handleViewChange}
				useScrollArea={true}
			/>
		</Box>
	);
}
