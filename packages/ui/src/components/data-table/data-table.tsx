'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { MdKeyboardArrowUp, MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	RowSelectionState,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	ColumnResizeMode,
} from '@tanstack/react-table';
import { TableProps } from './types';
import { DataTableHeader } from './data-table-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableActionBar } from './data-table-action-bar';
import { DataTableSkeleton } from './data-table-skeleton';
import { DataTableEmpty } from './data-table-empty';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './table';
import { ScrollArea, ScrollBar } from '../scroll-area';

// Helper function for common pinning styles
const getCommonPinningStyles = (column: any, isHeader = false): React.CSSProperties => {
	const isPinned = column.getIsPinned();
	if (!isPinned) return {};

	const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
	const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

	return {
		position: 'sticky' as const,
		left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
		right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
		zIndex: isPinned ? (isHeader ? 30 : 10) : isHeader ? 20 : 1,
	};
};

export function DataTable<T>({
	columns,
	data,
	dataType = 'Item',
	total,
	isLoadingBody,
	isLoadingHeaders,
	onColumnVisibilityChange,
	pageSize = 10,
	currentPage = 0,
	columnVisibility = {},
	size = 'md',
	filters,
	tableState,
	setTableState,
	searchPlaceholder = 'Search...',
	hideSearch = false,
	hideColumnsMenu = false,
	hideViewMenu = false,
	onRowSelectionChange,
	className,
	view = 'list',
	onViewChange,
	useScrollArea = true,
	maxHeight = 'var(--data-table-content-height)',
	actionBarActions,
	showDefaultActionBarActions = true,
}: TableProps<T>) {
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [selectedRowsData, setSelectedRowsData] = React.useState<T[]>([]);
	const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');
	const [columnSizing, setColumnSizing] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		columnResizeMode,
		state: {
			rowSelection,
			columnVisibility,
			columnSizing,
			pagination: {
				pageIndex: currentPage,
				pageSize,
			},
			columnPinning: {
				left: ['select', 'email'],
			},
		},
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange,
		onColumnSizingChange: setColumnSizing,
		enableRowSelection: true,
		enableColumnResizing: true,
		manualPagination: true,
		pageCount: total ? Math.ceil(total / pageSize) : 0,
	});

	// Update selected rows data when row selection changes
	React.useEffect(() => {
		const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
		setSelectedRowsData(selectedRows);
		onRowSelectionChange?.(selectedRows);
	}, [rowSelection, onRowSelectionChange, table]);

	const sizeClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
	};

	const hasSelectedRows = Object.keys(rowSelection).length > 0;

	if (isLoadingHeaders) {
		return <DataTableSkeleton />;
	}

	return (
		<div className={cn('space-y-4', className)}>
			<DataTableHeader
				table={table}
				pageSize={pageSize}
				total={total}
				dataType={dataType}
				searchPlaceholder={searchPlaceholder}
				hideSearch={hideSearch}
				hideColumnsMenu={hideColumnsMenu}
				hideViewMenu={hideViewMenu}
				filters={filters}
				view={view}
				onViewChange={onViewChange}
				tableState={tableState}
				setTableState={setTableState}
			/>

			{hasSelectedRows && (
				<DataTableActionBar
					selectedCount={Object.keys(rowSelection).length}
					dataType={dataType}
					onClearSelection={() => setRowSelection({})}
					selectedRowsData={selectedRowsData}
					actions={
						typeof actionBarActions === 'function'
							? actionBarActions(selectedRowsData)
							: actionBarActions
					}
					showDefaultActions={showDefaultActionBarActions}
				/>
			)}

			{useScrollArea ? (
				<div className="scrollbar-custom overflow-auto" style={{ height: maxHeight }}>
					<Table
						className={cn(sizeClasses[size])}
						containerless={true}
						style={{
							minWidth: '100%',
							width: `${table.getTotalSize()}px`,
							tableLayout: 'fixed',
						}}
					>
						<TableHeader className="sticky top-0 bg-bg z-20">
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(header => (
										<TableHead
											key={header.id}
											className={cn(
												'relative',
												header.column.getIsPinned() === 'left' &&
													header.column.getIsLastColumn('left') &&
													'after:absolute after:top-0 after:right-0 after:bottom-[-1px] after:w-[1px] after:bg-gradient-to-r after:from-transparent after:via-border/50 after:to-transparent after:shadow-[2px_0_8px_rgba(0,0,0,0.1)]'
											)}
											style={{
												width: `${(header.getSize() / table.getTotalSize()) * 100}%`,
												...getCommonPinningStyles(header.column, true),
											}}
										>
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
												<div
													className={cn(
														header.column.getCanSort() &&
															'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
													)}
													onClick={header.column.getToggleSortingHandler()}
													onKeyDown={e => {
														// Enhanced keyboard handling for sorting
														if (
															header.column.getCanSort() &&
															(e.key === 'Enter' || e.key === ' ')
														) {
															e.preventDefault();
															header.column.getToggleSortingHandler()?.(e);
														}
													}}
													tabIndex={header.column.getCanSort() ? 0 : undefined}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{{
														asc: (
															<MdOutlineExpandLess
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
														desc: (
															<MdOutlineExpandMore
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											) : (
												flexRender(header.column.columnDef.header, header.getContext())
											)}
											{header.column.getCanResize() && (
												<div
													onDoubleClick={e => {
														e.stopPropagation();
														header.column.resetSize();
													}}
													onMouseDown={e => {
														e.stopPropagation();
														header.getResizeHandler()(e);
													}}
													onTouchStart={e => {
														e.stopPropagation();
														header.getResizeHandler()(e);
													}}
													onClick={e => e.stopPropagation()}
													className="absolute top-0 h-full w-4 cursor-col-resize select-none touch-none -right-2 z-50 flex justify-center before:absolute before:w-[3px] before:inset-y-0 before:-translate-x-1/2 [&:hover::before]:bg-primary-solid [&:active::before]:bg-primary-solid-hover"
													style={{
														userSelect: 'none',
													}}
												/>
											)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoadingBody ? (
								<TableRow>
									<TableCell colSpan={columns.length}>
										<div className="flex items-center justify-center space-x-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
											<span className="text-muted-foreground">Loading...</span>
										</div>
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() ? 'selected' : undefined}
										className="group"
									>
										{row.getVisibleCells().map(cell => (
											<TableCell
												key={cell.id}
												className={cn(
													'relative',
													cell.column.getIsPinned() &&
														'bg-panel group-hover:bg-bg group-data-[state=selected]:bg-bg',
													cell.column.getIsPinned() === 'left' &&
														cell.column.getIsLastColumn('left') &&
														'after:absolute after:top-0 after:right-0 after:bottom-[-1px] after:w-[1px] after:bg-gradient-to-r after:from-transparent after:via-border/50 after:to-transparent after:shadow-[2px_0_8px_rgba(0,0,0,0.1)]'
												)}
												style={{
													width: `${(cell.column.getSize() / table.getTotalSize()) * 100}%`,
													...getCommonPinningStyles(cell.column, false),
												}}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										<DataTableEmpty dataType={dataType} />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className="overflow-auto" style={{ maxHeight }}>
					<Table
						className={cn(sizeClasses[size])}
						style={{
							minWidth: '100%',
							width: `${table.getTotalSize()}px`,
							tableLayout: 'fixed',
						}}
					>
						<TableHeader className="sticky top-0 bg-bg z-20 border-b shadow-sm">
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(header => (
										<TableHead
											key={header.id}
											className={cn('relative')}
											style={{
												width: `${(header.getSize() / table.getTotalSize()) * 100}%`,
												...getCommonPinningStyles(header.column),
											}}
										>
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
												<div
													className={cn(
														header.column.getCanSort() &&
															'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
													)}
													onClick={header.column.getToggleSortingHandler()}
													onKeyDown={e => {
														// Enhanced keyboard handling for sorting
														if (
															header.column.getCanSort() &&
															(e.key === 'Enter' || e.key === ' ')
														) {
															e.preventDefault();
															header.column.getToggleSortingHandler()?.(e);
														}
													}}
													tabIndex={header.column.getCanSort() ? 0 : undefined}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{{
														asc: (
															<MdOutlineExpandLess
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
														desc: (
															<MdOutlineExpandMore
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											) : (
												flexRender(header.column.columnDef.header, header.getContext())
											)}
											{header.column.getCanResize() && (
												<div
													onDoubleClick={e => {
														e.stopPropagation();
														header.column.resetSize();
													}}
													onMouseDown={e => {
														e.stopPropagation();
														header.getResizeHandler()(e);
													}}
													onTouchStart={e => {
														e.stopPropagation();
														header.getResizeHandler()(e);
													}}
													onClick={e => e.stopPropagation()}
													className="absolute top-0 h-full w-4 cursor-col-resize select-none touch-none -right-2 z-50 flex justify-center before:absolute before:w-[3px] before:inset-y-0 before:-translate-x-1/2 [&:hover::before]:bg-primary-solid [&:active::before]:bg-primary-solid-hover"
													style={{
														userSelect: 'none',
													}}
												/>
											)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoadingBody ? (
								<TableRow>
									<TableCell colSpan={columns.length}>
										<div className="flex items-center justify-center space-x-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
											<span className="text-muted-foreground">Loading...</span>
										</div>
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() ? 'selected' : undefined}
										className="group"
									>
										{row.getVisibleCells().map(cell => (
											<TableCell
												key={cell.id}
												className={cn(
													cell.column.getIsPinned() &&
														'bg-panel group-hover:bg-bg group-data-[state=selected]:bg-bg'
												)}
												style={{
													width: `${(cell.column.getSize() / table.getTotalSize()) * 100}%`,
													...getCommonPinningStyles(cell.column, false),
												}}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										<DataTableEmpty dataType={dataType} />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}

			<DataTablePagination
				dataType={dataType}
				table={table}
				total={total}
				currentPage={currentPage}
				pageSize={pageSize}
			/>
		</div>
	);
}
