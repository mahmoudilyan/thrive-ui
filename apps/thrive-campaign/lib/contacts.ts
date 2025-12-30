import { DateRange ,ContactsTableState} from "@/types/contacts/index";

const parseDateRange = (dateRange: string): DateRange | undefined => {
  if (!dateRange) return undefined;
  
  const [start, end] = dateRange.split(' - ');
  if (!start || !end) return undefined;

  return {
    start,
    end
  };
};


export const mapApiParamsToTableState = (params: Record<string, any>): ContactsTableState => {
  // Extract columns
  const columns = [];
  let i = 0;
  while (params[`columns[${i}][data]`] !== undefined) {
    columns.push({
      data: params[`columns[${i}][data]`],
      name: params[`columns[${i}][name]`] || undefined,
      searchable: params[`columns[${i}][searchable]`] === 'true',
      orderable: params[`columns[${i}][orderable]`] === 'true',
      search: {
        value: params[`columns[${i}][search][value]`] || '',
        regex: params[`columns[${i}][search][regex]`] === 'true'
      }
    });
    i++;
  }

  // Extract ordering
  const sorting = [];
  i = 0;
  while (params[`order[${i}][column]`] !== undefined) {
    const columnIndex = parseInt(params[`order[${i}][column]`], 10);
    if (!isNaN(columnIndex) && columns[columnIndex]) {
      sorting.push({
        id: columns[columnIndex].data,
        desc: params[`order[${i}][dir]`] === 'desc'
      });
    }
    i++;
  }

  return {
    // Pagination
    pagination: {
      pageIndex: Math.floor(parseInt(params.start, 10) / parseInt(params.length, 10)),
      pageSize: parseInt(params.length, 10)
    },

    // Columns
    columnsQueries: columns,

    // Sorting
    sorting,

    // Search
    search: params['search[value]'] || '',
    searchBy: params.searchBy || 'fields',

    // Filters
    filters: {
      lists: params['lists[]'] ? 
        Array.isArray(params['lists[]']) ? 
          params['lists[]'] : 
          [params['lists[]']] : 
        undefined,
      
      audiences: params['audiences[]'] ?
        Array.isArray(params['audiences[]']) ?
          params['audiences[]'] :
          [params['audiences[]']] :
        undefined,
      
      dateRange: params.dateRange ? 
        parseDateRange(params.dateRange) :
        undefined,
      
      isBDA: params.isBDA === '1'
    }
  };
};