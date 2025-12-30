# How to Add a New API Endpoint for Filters

This guide shows you how to add a new API endpoint and use it in DataTable filters.

## Step 1: Add API Configuration

Edit `/apps/thrive-campaign/services/config/api.ts`:

```typescript
export const API_CONFIG = {
	// ... existing config

	// Add your new resource
	myResource: {
		getFilters: {
			createKey: () => ['myResource', 'filters'],
			url: `${baseUrl}/MyResource/GetFilters.json`,
			method: 'GET', // or 'POST' if needed
			contentType: 'json', // or 'form' for form data
		} satisfies ApiEndpoint<void>,

		// If you need parameters
		getFiltersByCategory: {
			createKey: (categoryId: string) => ['myResource', 'filters', categoryId],
			url: (categoryId: string) => `${baseUrl}/MyResource/GetFilters.json?category=${categoryId}`,
			method: 'GET',
		} satisfies ApiEndpoint<string>,
	},
};
```

## Step 2: Create Mock Data (Optional)

Create `/apps/server-mock/mock/my-resource-filters.json`:

```json
[
	{
		"id": "1",
		"name": "Option 1",
		"description": "First option"
	},
	{
		"id": "2",
		"name": "Option 2",
		"description": "Second option"
	}
]
```

## Step 3: Use in Component

```typescript
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

export function MyComponent() {
  // Simple API call (no parameters)
  const myFilters = useApi(
    API_CONFIG.myResource.getFilters,
    {
      jsonFile: 'my-resource-filters.json',
    },
    {},
    {}
  );

  // API call with parameters
  const categoryFilters = useApi(
    API_CONFIG.myResource.getFiltersByCategory,
    {
      params: 'category-123',
      jsonFile: 'my-resource-filters.json',
    },
    {},
    {}
  );

  return (
    <DataTable
      filters={[
        {
          id: 'myFilter',
          label: 'My Filter',
          type: 'multiselect',
          placeholder: myFilters.isLoading ? 'Loading...' : 'Select option',
          searchable: true,
          options: myFilters.isSuccess && Array.isArray(myFilters.data)
            ? myFilters.data.map((item: any) => ({
                label: item.name,
                value: item.id,
                description: item.description,  // Optional
              }))
            : [],
        },
      ]}
    />
  );
}
```

## API Endpoint Configuration Options

### Basic GET Endpoint

```typescript
getFilters: {
  createKey: () => ['resource', 'filters'],
  url: `${baseUrl}/Resource/GetFilters.json`,
  method: 'GET',  // Optional, defaults to GET
} satisfies ApiEndpoint<void>,
```

### GET with URL Parameters

```typescript
getFiltersByCategory: {
  createKey: (params: { categoryId: string; type: string }) =>
    ['resource', 'filters', params.categoryId, params.type],
  url: (params: { categoryId: string; type: string }) =>
    `${baseUrl}/Resource/GetFilters.json?category=${params.categoryId}&type=${params.type}`,
  method: 'GET',
} satisfies ApiEndpoint<{ categoryId: string; type: string }>,
```

### POST with Form Data

```typescript
getFilters: {
  createKey: () => ['resource', 'filters'],
  url: `${baseUrl}/Resource/GetFilters.json`,
  method: 'POST',
  contentType: 'form',  // Sends as application/x-www-form-urlencoded
} satisfies ApiEndpoint<void>,
```

### POST with JSON Body

```typescript
getFilters: {
  createKey: () => ['resource', 'filters'],
  url: `${baseUrl}/Resource/GetFilters.json`,
  method: 'POST',
  contentType: 'json',  // Sends as application/json
} satisfies ApiEndpoint<void>,
```

## Using Different Parameter Types

### No Parameters

```typescript
const data = useApi(
	API_CONFIG.resource.getFilters,
	{
		jsonFile: 'filters.json',
	},
	{},
	{}
);
```

### URL Parameters (GET)

```typescript
const data = useApi(
	API_CONFIG.resource.getFiltersByCategory,
	{
		params: { categoryId: '123', type: 'active' },
		jsonFile: 'filters.json',
	},
	{},
	{}
);
```

### Request Body (POST)

```typescript
const data = useApi(
	API_CONFIG.resource.getFilters,
	{
		jsonFile: 'filters.json',
	},
	{
		// Request body
		status: 'active',
		limit: 100,
	},
	{}
);
```

### With Dependencies (Auto-refetch)

```typescript
const [selectedCategory, setSelectedCategory] = useState('123');

const data = useApi(
	API_CONFIG.resource.getFiltersByCategory,
	{
		params: { categoryId: selectedCategory },
		jsonFile: 'filters.json',
	},
	{},
	{ categoryId: selectedCategory } // Refetch when this changes
);
```

### Conditional Fetching

```typescript
const [enabled, setEnabled] = useState(false);

const data = useApi(
	API_CONFIG.resource.getFilters,
	{
		jsonFile: 'filters.json',
		enabled: enabled, // Only fetch when enabled is true
	},
	{},
	{}
);
```

## Response Structure Examples

### Simple Array Response

```json
[
	{ "id": "1", "name": "Option 1" },
	{ "id": "2", "name": "Option 2" }
]
```

Mapping:

```typescript
options: data.isSuccess && Array.isArray(data.data)
	? data.data.map((item: any) => ({ label: item.name, value: item.id }))
	: [];
```

### Nested Object Response

```json
{
	"filters": [
		{ "id": "1", "name": "Option 1" },
		{ "id": "2", "name": "Option 2" }
	]
}
```

Mapping:

```typescript
options: data.isSuccess && data.data?.filters
	? data.data.filters.map((item: any) => ({ label: item.name, value: item.id }))
	: [];
```

### Complex Response with Metadata

```json
{
	"data": [{ "id": "1", "label": "Option 1", "meta": { "count": 10 } }],
	"total": 100,
	"page": 1
}
```

Mapping:

```typescript
options: data.isSuccess && data.data?.data
	? data.data.data.map((item: any) => ({
			label: `${item.label} (${item.meta.count})`,
			value: item.id,
		}))
	: [];
```

## Testing with Mock Data

### Enable Mock Data

Add `?dummyData=yes` to your URL:

```
http://localhost:3000/contacts?dummyData=yes
```

### Mock Data Location

Place mock JSON files in:

```
/apps/server-mock/mock/your-file.json
```

### Reference in useApi

```typescript
const data = useApi(
	API_CONFIG.resource.getFilters,
	{
		jsonFile: 'your-file.json', // Matches filename in mock folder
	},
	{},
	{}
);
```

## Complete Real-World Example

### 1. API Configuration

```typescript
// services/config/api.ts
export const API_CONFIG = {
	tags: {
		getAllTags: {
			createKey: () => ['tags', 'all'],
			url: `${baseUrl}/Tags/GetAllTags.json`,
			method: 'GET',
		} satisfies ApiEndpoint<void>,

		getTagsByType: {
			createKey: (type: string) => ['tags', 'byType', type],
			url: (type: string) => `${baseUrl}/Tags/GetTags.json?type=${type}`,
			method: 'GET',
		} satisfies ApiEndpoint<string>,
	},
};
```

### 2. Mock Data

```json
// server-mock/mock/tags-all.json
[
	{
		"id": "1",
		"name": "VIP",
		"color": "#FF5733",
		"count": 150
	},
	{
		"id": "2",
		"name": "Newsletter",
		"color": "#33FF57",
		"count": 1200
	}
]
```

### 3. Component Usage

```typescript
// components/contacts/contacts-list.tsx
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

export function ContactsList() {
  // Fetch tags for filter
  const tags = useApi(
    API_CONFIG.tags.getAllTags,
    {
      jsonFile: 'tags-all.json',
    },
    {},
    {}
  );

  return (
    <DataTable
      columns={columns}
      data={contacts}
      filters={[
        {
          id: 'tags',
          label: 'Tags',
          type: 'multiselect',
          placeholder: tags.isLoading ? 'Loading tags...' : 'Select tags',
          searchPlaceholder: 'Search tags...',
          searchable: true,
          options: tags.isSuccess && Array.isArray(tags.data)
            ? tags.data.map((tag: any) => ({
                label: `${tag.name} (${tag.count})`,
                value: tag.id,
              }))
            : [],
        },
      ]}
    />
  );
}
```

## Troubleshooting

### Issue: API not called

**Check:**

1. Is `enabled` set to `false`?
2. Are there TypeScript errors?
3. Is the component mounted?

### Issue: Mock data not loading

**Check:**

1. Is `?dummyData=yes` in URL?
2. Is file in `/apps/server-mock/mock/`?
3. Is filename correct in `jsonFile` option?
4. Is `NODE_ENV` set to `development`?

### Issue: Wrong data structure

**Solution:**

1. Console log the response:
   ```typescript
   const data = useApi(...);
   console.log('API Response:', data.data);
   ```
2. Adjust your mapping accordingly

### Issue: TypeScript errors

**Solution:**
Add proper types:

```typescript
interface Tag {
	id: string;
	name: string;
	color?: string;
	count?: number;
}

const tags = useApi<Tag[]>(API_CONFIG.tags.getAllTags, { jsonFile: 'tags-all.json' }, {}, {});
```

## Best Practices

1. **Naming Convention:**
   - API Config: `getFilters`, `getAllTags`, `getListsFilters`
   - Mock Files: `resource-filters.json`, `tags-all.json`

2. **Query Keys:**
   - Include all parameters that affect the response
   - Use consistent ordering

   ```typescript
   createKey: params => ['resource', 'filters', params.id, params.type];
   ```

3. **Error Handling:**

   ```typescript
   options: tags.isSuccess && Array.isArray(tags.data)
     ? tags.data.map(...)
     : tags.isError
     ? [{ label: 'Error loading tags', value: '' }]
     : []
   ```

4. **Loading States:**

   ```typescript
   placeholder: tags.isLoading
   	? 'Loading tags...'
   	: tags.isError
   		? 'Error loading tags'
   		: 'Select tags';
   ```

5. **Caching:**
   - React Query automatically caches responses
   - Same query key = cached data
   - Use dependencies to trigger refetch

## Summary Checklist

- [ ] Add API endpoint to `api.ts`
- [ ] Create mock JSON file (if needed)
- [ ] Import `useApi` and `API_CONFIG`
- [ ] Call `useApi` with correct parameters
- [ ] Map response to filter options
- [ ] Handle loading state
- [ ] Test with mock data (`?dummyData=yes`)
- [ ] Test with real API
- [ ] Add error handling
- [ ] Add TypeScript types (optional but recommended)


