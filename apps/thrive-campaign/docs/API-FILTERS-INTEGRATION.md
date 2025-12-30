# API Integration with DataTable Filters

This guide explains how to integrate API calls with DataTable filters using the `useApi` hook.

## Basic Pattern

### 1. Make the API Call

Use the `useApi` hook to fetch data for your filter options:

```typescript
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

// Inside your component
const lists = useApi(
  API_CONFIG.lists.getListsFilters,
  {
    jsonFile: 'lists.json', // Optional: for mock data in dev mode with ?dummyData=yes
  },
  {}, // Request body (for POST requests)
  {}  // Dependencies object (triggers refetch when changed)
);
```

### 2. Use the API Data in Filters

Transform the API response into filter options:

```typescript
filters={[
  {
    id: 'lists',
    label: 'List(s)',
    type: 'multiselect',
    placeholder: 'Select lists',
    searchPlaceholder: 'Search lists...',
    searchable: true,
    // Map API data to filter options
    options: lists.isSuccess
      ? lists.data?.lists.map((list: any) => ({
          label: list.list,
          value: list.id,
        }))
      : [],
    // Show loading state
    loading: lists.isLoading,
    // Show error state
    error: lists.error,
  },
]}
```

## Complete Example

Here's a complete example from `contacts-list.tsx`:

```typescript
export function ContactsList({ listId, view = 'list' }: ContactsListProps) {
  // Fetch lists for filter options
  const lists = useApi(
    API_CONFIG.lists.getListsFilters,
    {
      jsonFile: 'lists.json',
    },
    {},
    {}
  );

  // Fetch audiences for filter options
  const audiences = useApi(
    API_CONFIG.audiences.getAudiences,
    {
      jsonFile: 'audiences.json',
    },
    {},
    {}
  );

  return (
    <DataTable
      columns={tableColumns}
      data={contacts}
      filters={[
        // Static options
        {
          id: 'status',
          label: 'Status',
          type: 'select',
          placeholder: 'Select status',
          options: [
            { label: 'Active', value: '1' },
            { label: 'Inactive', value: '0' },
            { label: 'Unsubscribed', value: '2' },
            { label: 'Bounced', value: '3' },
          ],
        },
        // Dynamic options from API
        {
          id: 'lists',
          label: 'List(s)',
          type: 'multiselect',
          placeholder: 'Select lists',
          searchPlaceholder: 'Search lists...',
          searchable: true,
          options: lists.isSuccess
            ? lists.data?.lists.map((list: any) => ({
                label: list.list,
                value: list.id,
              }))
            : [],
          loading: lists.isLoading,
          error: lists.error,
        },
        // Another dynamic filter
        {
          id: 'audiences',
          label: 'Audiences',
          type: 'multiselect',
          placeholder: 'Select audiences',
          searchPlaceholder: 'Search audiences...',
          searchable: true,
          options: audiences.isSuccess
            ? audiences.data?.audiences.map((audience: any) => ({
                label: audience.name,
                value: audience.id,
              }))
            : [],
          loading: audiences.isLoading,
          error: audiences.error,
        },
      ]}
    />
  );
}
```

## Advanced Patterns

### 1. Dependent Filters

When one filter depends on another:

```typescript
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

// Second API call depends on first selection
const subcategories = useApi(
  API_CONFIG.subcategories.getByCategory,
  {
    params: { categoryId: selectedCategory },
    enabled: !!selectedCategory, // Only fetch when category is selected
  },
  {},
  { categoryId: selectedCategory } // Refetch when dependency changes
);

filters={[
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: categories.data?.map(cat => ({
      label: cat.name,
      value: cat.id,
    })) || [],
    onChange: (value) => setSelectedCategory(value),
  },
  {
    id: 'subcategory',
    label: 'Subcategory',
    type: 'select',
    disabled: !selectedCategory,
    options: subcategories.data?.map(sub => ({
      label: sub.name,
      value: sub.id,
    })) || [],
    loading: subcategories.isLoading,
  },
]}
```

### 2. Async Options (Server-Side Search)

For filters with server-side search:

```typescript
filters={[
  {
    id: 'users',
    label: 'Users',
    type: 'multiselect',
    searchable: true,
    searchPlaceholder: 'Search users...',
    // Return a promise that resolves to options
    options: async (searchQuery: string) => {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      return data.users.map(user => ({
        label: user.name,
        value: user.id,
      }));
    },
  },
]}
```

### 3. Cached Options with React Query

The `useApi` hook uses React Query under the hood, which provides automatic caching:

```typescript
// First call - fetches from API
const lists1 = useApi(API_CONFIG.lists.getListsFilters, {}, {}, {});

// Second call with same key - uses cached data
const lists2 = useApi(API_CONFIG.lists.getListsFilters, {}, {}, {});

// Force refetch
lists1.refetch();
```

### 4. Handling Errors

Display error states in your UI:

```typescript
const lists = useApi(API_CONFIG.lists.getListsFilters, {}, {}, {});

if (lists.isError) {
  return <div>Error loading lists: {lists.error?.message}</div>;
}

filters={[
  {
    id: 'lists',
    label: 'List(s)',
    type: 'multiselect',
    options: lists.data?.lists.map(...) || [],
    loading: lists.isLoading,
    error: lists.error,
    // The DataTable component will handle displaying the error
  },
]}
```

## API Configuration

To add a new endpoint for filters, update `/apps/thrive-campaign/services/config/api.ts`:

```typescript
export const API_CONFIG = {
  // ... existing config
  myResource: {
    getFilters: {
      createKey: () => ['myResource', 'filters'],
      url: `${baseUrl}/MyResource/GetFilters.json`,
      method: 'GET', // or 'POST' if needed
      contentType: 'json', // or 'form' for form data
    } satisfies ApiEndpoint<void>,
  },
};
```

## useApi Hook Parameters

```typescript
useApi<TResponse, TParams>(
  apiConfig: ApiEndpoint<TParams>,
  options?: {
    params?: TParams,        // URL/query parameters
    jsonFile?: string,       // Mock data file (for dev mode)
    enabled?: boolean,       // Enable/disable query
  },
  body?: object,            // Request body (for POST/PUT/PATCH)
  dependencies?: object     // Trigger refetch when changed
)
```

## Return Values

The `useApi` hook returns a React Query result object:

```typescript
{
  data: TResponse | undefined,     // Response data
  isLoading: boolean,              // Initial loading state
  isFetching: boolean,             // Any loading state (including refetch)
  isSuccess: boolean,              // Request succeeded
  isError: boolean,                // Request failed
  error: Error | null,             // Error object
  refetch: () => void,             // Manually refetch
  // ... other React Query properties
}
```

## Best Practices

1. **Always check `isSuccess`** before mapping data to avoid runtime errors
2. **Provide fallback empty arrays** for options to prevent undefined errors
3. **Use `loading` prop** to show loading states in filters
4. **Use `error` prop** to display error messages
5. **Use `enabled` option** for dependent queries to avoid unnecessary requests
6. **Use `dependencies` parameter** to trigger refetch when related data changes
7. **Provide `jsonFile`** for development with mock data
8. **Use proper TypeScript types** for API responses

## Common Pitfalls

1. ❌ **Don't forget the optional chaining:**
   ```typescript
   options: lists.data.lists.map(...) // Will crash if data is undefined
   ```
   
   ✅ **Use optional chaining and fallback:**
   ```typescript
   options: lists.data?.lists?.map(...) || []
   ```

2. ❌ **Don't use async functions directly in options:**
   ```typescript
   options: async () => { /* fetch data */ } // Won't work with useApi pattern
   ```
   
   ✅ **Use useApi hook instead:**
   ```typescript
   const data = useApi(API_CONFIG.endpoint, {}, {}, {});
   options: data.data?.items || []
   ```

3. ❌ **Don't forget to handle loading states:**
   ```typescript
   options: lists.data?.lists.map(...) // Shows empty while loading
   ```
   
   ✅ **Add loading prop:**
   ```typescript
   options: lists.data?.lists.map(...) || [],
   loading: lists.isLoading,
   ```



