export interface Campaign {
  id: string;
  type: string;
  campaign: {
    name: string;
    subject: string;
    from: string;
    fromname: string;
    replyto: string;
    type: string;
    thumb: string;
    details: {
      email_opened?: { r: number } | [];
      link_clicked?: { r: number } | [];
    };
    status: {
      name: string;
      scheduled: string;
    };
  };
  target: {
    lists: string[];
    audiences: string[];
    folders: string[];
    total?: number;
  };
  labels: Record<string, string>;
  actions: Record<
    string,
    {
      text?: string;
      className?: string;
      href?: string;
      data?: Record<string, unknown>;
    }
  >;
  date?: string;
  startsenddate?: string;
  endsenddate?: string;
  folder_name: string;
}

export interface Folder {
  indexid: string;
  rowtype: string;
  folderId: string;
  folderName: string;
  folderItems: number;
  id: string;
  name: string;
  actionslist: {
    master: {
      text: string;
      goToView: string;
    };
    list: Record<
      string,
      {
        text: string;
        className: string;
      }
    >;
  };
  created_on: string;
  'status-label': string;
}

export interface TableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (value: any) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    accessorKey?: keyof T;
    accessorFn?: (row: T) => unknown;
    cell?: (value: unknown) => React.ReactNode;
  }[];
}
