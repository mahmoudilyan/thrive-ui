import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { useShallow } from 'zustand/shallow';
import { useApi, useApiMutation } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

// Types
interface List {
  id: string;
  name: string;
}

interface ListsTableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
}

interface StoreState {
  // Table State
  tableState: ListsTableState;
  
  // Selection
  selectedListIds: string[];
  
  // Actions
  setTableState: (state: Partial<ListsTableState>) => void;
  selectLists: (ids: string[]) => void;
  clearSelection: () => void;
}

// Constants
const STORE_NAME = 'lists-storage' as const;
const DEFAULT_PAGE_SIZE = 25;

// Create the store
const useListsStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      tableState: {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: 'name',
        sortOrder: 'asc',
        search: '',
      },
      selectedListIds: [],

      // Actions
      setTableState: (newState) =>
        set(
          produce((state) => {
            Object.assign(state.tableState, newState);
          })
        ),

      selectLists: (ids) =>
        set(
          produce((state) => {
            state.selectedListIds = ids;
          })
        ),

      clearSelection: () =>
        set(
          produce((state) => {
            state.selectedListIds = [];
          })
        ),
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tableState: state.tableState,
      }),
    }
  )
);

// Main hook that combines store and queries
export const useLists = () => {
  const store = useListsStore(useShallow((state) => state));
  
  const { data: lists, isLoading } = useApi<List[]>({
    queryKey: ['lists', store.tableState],
    url: API_CONFIG.ENDPOINTS.LISTS,
    params: {
      page: store.tableState.page,
      per_page: store.tableState.pageSize,
      sort_by: store.tableState.sortBy,
      sort_order: store.tableState.sortOrder,
      search: store.tableState.search,
    },
  });

  const deleteListMutation = useApiMutation({
    url: API_CONFIG.ENDPOINTS.LISTS,
    method: 'DELETE',
  });

  return {
    // State
    lists,
    isLoading,
    selectedListIds: store.selectedListIds,
    tableState: store.tableState,

    // Actions
    setTableState: store.setTableState,
    selectLists: store.selectLists,
    clearSelection: store.clearSelection,
    deleteList: deleteListMutation.mutateAsync,
  };
};

export default useLists;
