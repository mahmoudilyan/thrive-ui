import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { useShallow } from 'zustand/shallow';
import { useApi, useApiMutation } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

// Types
interface Audience {
  id: string;
  name: string;
}

interface AudiencesTableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
}

interface StoreState {
  // Table State
  tableState: AudiencesTableState;
  
  // Selection
  selectedAudienceIds: string[];
  
  // Actions
  setTableState: (state: Partial<AudiencesTableState>) => void;
  selectAudiences: (ids: string[]) => void;
  clearSelection: () => void;
}

// Constants
const STORE_NAME = 'audiences-storage' as const;
const DEFAULT_PAGE_SIZE = 25;

// Create the store
const useAudiencesStore = create<StoreState>()(
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
      selectedAudienceIds: [],

      // Actions
      setTableState: (newState) =>
        set(
          produce((state) => {
            Object.assign(state.tableState, newState);
          })
        ),

      selectAudiences: (ids) =>
        set(
          produce((state) => {
            state.selectedAudienceIds = ids;
          })
        ),

      clearSelection: () =>
        set(
          produce((state) => {
            state.selectedAudienceIds = [];
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
export const useAudiences = () => {
  const store = useAudiencesStore(useShallow((state) => state));
  
  const { data: audiences, isLoading } = useApi<Audience[]>({
    queryKey: ['audiences', store.tableState],
    url: API_CONFIG.ENDPOINTS.AUDIENCES,
    params: {
      page: store.tableState.page,
      per_page: store.tableState.pageSize,
      sort_by: store.tableState.sortBy,
      sort_order: store.tableState.sortOrder,
      search: store.tableState.search,
    },
  });

  const deleteAudienceMutation = useApiMutation({
    url: API_CONFIG.ENDPOINTS.AUDIENCES,
    method: 'DELETE',
  });

  return {
    // State
    audiences,
    isLoading,
    selectedAudienceIds: store.selectedAudienceIds,
    tableState: store.tableState,

    // Actions
    setTableState: store.setTableState,
    selectAudiences: store.selectAudiences,
    clearSelection: store.clearSelection,
    deleteAudience: deleteAudienceMutation.mutateAsync,
  };
};

export default useAudiences;
