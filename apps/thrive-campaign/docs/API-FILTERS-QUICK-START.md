# Quick Start: API Integration with DataTable Filters

This guide shows you how to quickly integrate API calls with DataTable filters.

## TL;DR - The Solution

```typescript
// 1. Make the API call
const lists = useApi(
  API_CONFIG.lists.getListsFilters,
  { jsonFile: 'lists-all.json' },
  {},
  {}
);

// 2. Use in filters
filters={[
  {
    id: 'lists',
    label: 'List(s)',
    type: 'multiselect',
    placeholder: lists.isLoading ? 'Loading lists...' : 'Select lists',
    searchPlaceholder: 'Search lists...',
    searchable: true,
    options: lists.isSuccess && Array.isArray(lists.data)
      ? lists.data.map((list: any) => ({ label: list.name, value: list.id }))
      : [],
  },
]}
```

## Step-by-Step Guide

### Step 1: Import Required Dependencies

```typescript
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
```

### Step 2: Call the API in Your Component

```typescript
export function ContactsList() {
	// Fetch data for filter options
	const lists = useApi(
		API_CONFIG.lists.getListsFilters, // API endpoint configuration
		{
			jsonFile: 'lists-all.json', // Mock data file (optional, for dev)
		},
		{}, // Request body (for POST requests)
		{} // Dependencies (triggers refetch)
	);

	// ... rest of component
}
```

### Step 3: Map API Data to Filter Options

The key is understanding your API response structure:

**For Array Response** (like `lists-all.json`):

```json
[
	{ "id": "1", "name": "List 1" },
	{ "id": "2", "name": "List 2" }
]
```

Use this mapping:

```typescript
options: lists.isSuccess && Array.isArray(lists.data)
  ? lists.data.map((list: any) => ({
      label: list.name,  // Display text
      value: list.id     // Value to send to API
    }))
  : [],
```

**For Object Response** (like `lists-list-view.json`):

```json
{
	"data": [
		{ "id": "1", "list": "List 1" },
		{ "id": "2", "list": "List 2" }
	]
}
```

Use this mapping:

```typescript
options: lists.isSuccess && lists.data?.data
  ? lists.data.data.map((list: any) => ({
      label: list.list,  // Note: property name is "list" not "name"
      value: list.id
    }))
  : [],
```

### Step 4: Add Loading State

Show loading feedback in the placeholder:

```typescript
placeholder: lists.isLoading ? 'Loading lists...' : 'Select lists',
```

### Step 5: Complete Filter Configuration

```typescript
filters={[
  {
    id: 'lists',                    // Filter ID (used in filter state)
    label: 'List(s)',              // Label shown in UI
    type: 'multiselect',           // Filter type
    placeholder: lists.isLoading
      ? 'Loading lists...'
      : 'Select lists',
    searchPlaceholder: 'Search lists...',
    searchable: true,              // Enable search in dropdown
    options: lists.isSuccess && Array.isArray(lists.data)
      ? lists.data.map((list: any) => ({
          label: list.name,
          value: list.id
        }))
      : [],
  },
]}
```

## Common Issues and Solutions

### Issue 1: "Cannot read properties of undefined (reading 'map')"

**Problem:** The API response structure doesn't match your mapping.

**Solution:**

1. Check your mock JSON file structure
2. Add proper null checks:
   ```typescript
   options: lists.isSuccess && Array.isArray(lists.data)
     ? lists.data.map(...)
     : [],
   ```

### Issue 2: Empty options array

**Problem:** Data loads but options don't show.

**Solution:** Check property names in your mapping:

```typescript
// Wrong - if API returns "name" property
label: list.list;

// Correct
label: list.name;
```

### Issue 3: Options show but wrong data

**Problem:** Mapping to wrong properties.

**Solution:** Console log the data to inspect structure:

```typescript
const lists = useApi(...);

console.log('Lists data:', lists.data);

// Then map to correct properties
```

## API Response Structures

### Simple Array (lists-all.json)

```typescript
// Response
[
	{ id: '152042', name: 'AI chatbot franchises' },
	{ id: '151947', name: 'Email Guide List' },
];

// Mapping
options: lists.data?.map((list: any) => ({
	label: list.name,
	value: list.id,
})) || [];
```

### Nested Object (lists-list-view.json)

```typescript
// Response
{
  "data": [
    { "id": "152042", "list": "AI chatbot franchises" },
    { "id": "151947", "list": "Email Guide List" }
  ]
}

// Mapping
options: lists.data?.data?.map((list: any) => ({
  label: list.list,  // Note: "list" not "name"
  value: list.id
})) || []
```

## useApi Return Values

```typescript
const lists = useApi(...);

// Available properties:
lists.data         // Response data
lists.isLoading    // Initial loading state
lists.isFetching   // Any loading (including refetch)
lists.isSuccess    // Request succeeded
lists.isError      // Request failed
lists.error        // Error object
lists.refetch()    // Manually refetch
```

## Best Practices Checklist

- ✅ Always check `isSuccess` before accessing data
- ✅ Use optional chaining (`?.`) when accessing nested properties
- ✅ Provide empty array fallback (`|| []`)
- ✅ Check if data is an array with `Array.isArray()`
- ✅ Show loading state in placeholder
- ✅ Use correct property names from API response
- ✅ Provide mock data file for development

## Complete Working Example

```typescript
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import { DataTable } from '@thrive/ui';

export function ContactsList() {
  // Fetch lists for filter
  const lists = useApi(
    API_CONFIG.lists.getListsFilters,
    { jsonFile: 'lists-all.json' },
    {},
    {}
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      filters={[
        // Static filter
        {
          id: 'status',
          label: 'Status',
          type: 'select',
          placeholder: 'Select status',
          options: [
            { label: 'Active', value: '1' },
            { label: 'Inactive', value: '0' },
          ],
        },
        // Dynamic filter from API
        {
          id: 'lists',
          label: 'List(s)',
          type: 'multiselect',
          placeholder: lists.isLoading ? 'Loading...' : 'Select lists',
          searchPlaceholder: 'Search lists...',
          searchable: true,
          options: lists.isSuccess && Array.isArray(lists.data)
            ? lists.data.map((list: any) => ({
                label: list.name,
                value: list.id
              }))
            : [],
        },
      ]}
    />
  );
}
```

## Next Steps

- Read the full [API-FILTERS-INTEGRATION.md](./API-FILTERS-INTEGRATION.md) for advanced patterns
- Check [use-api.ts](../hooks/use-api.ts) for hook implementation details
- See [api.ts](../services/config/api.ts) for API endpoint configurations


