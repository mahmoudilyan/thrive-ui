import { TableFiltersState } from "@/components/data-table/types";
import { DialogConfig } from "./dialog";

export interface DataTableColumn {
  data: string;
  name?: string;
  searchable?: boolean;
  orderable?: boolean;
}


export interface TableState {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  sorting: {
    id: string;
    dir: 'asc' | 'desc';
    column: number;
  }[];
  filters: TableFiltersState;
  columns: DataTableColumn[]; // Add columns to table state
  view?: 'list' | 'folder';
  search?: string;
  folderId?: number;
}

export interface DataTableParams {
  draw?: number; 
  start: number; 
  length: number; 
  'search[value]'?: string;
  'search[regex]'?: boolean;
  order?: Array<{
    column: number;
    dir: 'asc' | 'desc';
  }>;
  columns: Array<{
    data: string;
    name?: string;
    searchable: boolean;
    orderable: boolean;
    search?: {
      value: string; 
      regex: boolean; 
    };
  }>;
  folderid?: number; // Folder ID
  view?: 'list' | 'folder'; // View type

  // Additional params for filters
  [key: `${string}[]`]:unknown; // Allow any additional array filters
  [key: `${string}`]: unknown; // Allow any additional non-array filters
}

export interface DataTableResponse<T> {
  data: T[];
  total: number;
  recordsFiltered: number;
  recordsTotal: number;
}

export interface ActionItem {
  text?: string;         
  className?: string;    
  goToView?: string;     
  href?: string;         
}

export interface ActionsList {
  [key: string]: ActionItem | "divider";
}

export interface ActionsStructure {
  master: ActionItem;
  list: ActionsList;
}

export interface TransformedAction {
  text: string;
  onClick: () => void;
  className?: string;
}

export interface TransformedActions {
  master: TransformedAction | null;
  list: Array<
      | { text: string; type: "button"; onClick: () => void ; isDelete?: boolean}
      | { type: "divider" }
  >;
}

export interface Callbacks {
  openDialog: (type: string, dialogProps?: Record<string, any>, config?: DialogConfig) => void;
  navigate: (path: string) => void;
}