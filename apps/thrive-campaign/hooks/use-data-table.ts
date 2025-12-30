import { useCallback, useState } from 'react';
import { ApiEndpoint } from '@/services/config/api';
import { useApi } from './use-api';
import { DataTableResponse, TableState } from '@/types/table';

// Import with type assertion to use updated signature
// TODO: Remove type assertion after UI package is rebuilt
import { createServerParams as _createServerParams } from '@/lib/data-table';
const createServerParams = _createServerParams as unknown as (
	tableState: TableState,
	additionalParams?: Record<string, any>
) => any;

interface UseDataTableOptions<TParams = void> {
	initialParams?: Partial<TableState>;
	apiParams?: TParams;
	enabled?: boolean;
	jsonFile?: string;
	headersJsonFile?: string;
}

export function useDataTable<TData = any, TParams = void>(
	apiConfig: ApiEndpoint<TParams>,
	headersConfig?: ApiEndpoint<void>,
	options: UseDataTableOptions<TParams> = {}
) {
	const [drawCounter, setDrawCounter] = useState(1);
	const [tableState, setTableState] = useState<TableState>({
		pagination: {
			pageIndex: 0,
			pageSize: 10,
		},
		sorting: [],
		filters: {},
		columns: [],
		search: '',
		view: 'list',
		...options.initialParams,
	});

	// Wrap setTableState to increment draw counter
	const updateTableState = useCallback((newState: Partial<TableState>) => {
		setTableState(prev => {
			return { ...prev, ...newState };
		});
		setDrawCounter(prev => prev + 1);
	}, []);

	const serverParams = {
		draw: drawCounter,
		...createServerParams(tableState, options.apiParams as any),
	};

	// Data query
	const { data, isLoading, error, refetch } = useApi<DataTableResponse<TData>, TParams>(
		apiConfig,
		{
			params: {
				...options.apiParams,
				...tableState,
			} as any,
			enabled: options.enabled,
			jsonFile: options.jsonFile,
		},
		{
			...serverParams,
		},
		tableState
	);

	// Headers query
	const {
		data: headers,
		isLoading: isLoadingHeaders,
		error: headersError,
	} = useApi(headersConfig, {
		params: {
			...options.apiParams,
			...tableState,
		} as any,
		enabled: !!headersConfig,
		jsonFile: options.headersJsonFile,
	});

	return {
		data: data?.data ?? [],
		total: data?.recordsTotal ?? 0,
		filtered: data?.recordsFiltered ?? 0,
		isLoadingBody: isLoading,
		error,
		refetch,
		headers: headers ?? {},
		isLoadingHeaders,
		headersError,
		tableState,
		setTableState: updateTableState,
	};
}
