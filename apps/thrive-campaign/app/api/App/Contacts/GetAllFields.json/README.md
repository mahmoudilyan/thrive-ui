# GetAllFields API Endpoint

## Overview

This endpoint returns all contact fields configuration including default fields (Personal Data, Social Data, Company Data) and data fields (Lead Data).

## Endpoint Details

**URL:** `/api/App/Contacts/GetAllFields.json`

**Base URL (Development):** `http://localhost:3000/api/App/Contacts/GetAllFields.json`

**Methods:**

- `GET` - Retrieve all contact fields
- `POST` - Retrieve all contact fields (alternative method)

**Authentication:** Not required (for development)

## Response Format

### Success Response (200 OK)

```json
{
	"defaultFields": [
		{
			"id": 1,
			"name": "Personal Data",
			"fields": [
				{
					"field_id": 719,
					"field_name": "First Name",
					"field_visibility": 1,
					"field_secret": ""
				},
				{
					"field_id": 164333,
					"field_name": "Full Name",
					"field_visibility": 1,
					"field_secret": ""
				}
				// ... more fields
			]
		},
		{
			"id": 2,
			"name": "Social Data",
			"fields": [
				{
					"field_id": 164345,
					"field_name": "LinkedIn",
					"field_visibility": 0,
					"field_secret": ""
				}
				// ... more fields
			]
		},
		{
			"id": 3,
			"name": "Company Data",
			"fields": [
				{
					"field_id": 164352,
					"field_name": "Company Name",
					"field_visibility": 1,
					"field_secret": ""
				}
				// ... more fields
			]
		}
	],
	"dataFields": [
		{
			"id": "contactid",
			"name": "Contact ID",
			"visibility": 0
		},
		{
			"id": "leadscore",
			"name": "Lead Score",
			"visibility": 1
		},
		{
			"id": "leadstatus",
			"name": "Lead Status",
			"visibility": 1
		},
		{
			"id": "assignedto",
			"name": "Assigned To",
			"visibility": 0
		},
		{
			"id": "tags",
			"name": "Tags",
			"visibility": 0
		}
	]
}
```

### Error Response (500 Internal Server Error)

```json
{
	"message": "Error reading data"
}
```

## Field Types

### Default Fields

Groups of standard contact fields organized by category:

- **Personal Data** (id: 1): First Name, Last Name, Email, Phone, Address, etc.
- **Social Data** (id: 2): LinkedIn, Twitter, Facebook, Instagram, etc.
- **Company Data** (id: 3): Company Name, Company Website, Industry, Revenue, etc.

**Field Structure:**

- `field_id` (number): Unique identifier for the field
- `field_name` (string): Display name of the field
- `field_visibility` (number): 1 = visible by default, 0 = hidden by default
- `field_secret` (string): Special identifier for system fields (e.g., "email", "phone")

### Data Fields

Lead-related fields that provide additional contact information:

**Field Structure:**

- `id` (string): Unique identifier (e.g., "leadscore", "leadstatus")
- `name` (string): Display name of the field
- `visibility` (number): 1 = visible by default, 0 = hidden by default

## Usage Example

### JavaScript/TypeScript (Fetch API)

```typescript
// GET request
const response = await fetch('http://localhost:3000/api/App/Contacts/GetAllFields.json');
const data = await response.json();

console.log('Default Fields:', data.defaultFields);
console.log('Data Fields:', data.dataFields);
```

### React Hook (with TanStack Query)

```typescript
import { useQuery } from '@tanstack/react-query';

function useContactFields() {
  return useQuery({
    queryKey: ['allFields'],
    queryFn: async () => {
      const response = await fetch('/api/App/Contacts/GetAllFields.json');
      if (!response.ok) throw new Error('Failed to fetch fields');
      return response.json();
    },
  });
}

// Usage in component
function MyComponent() {
  const { data, isLoading, error } = useContactFields();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading fields</div>;

  return (
    <div>
      {data.defaultFields.map(group => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <ul>
            {group.fields.map(field => (
              <li key={field.field_id}>{field.field_name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## Data Source

The endpoint reads from the mock data file:

- **File:** `apps/thrive-campaign/mock/contact-fields.json`
- **Cache:** Uses `readCachedJson` utility for optimized file reading

## Integration

This endpoint is used by:

- **Contacts Store** (`store/contacts/use-contacts-store.ts`): Loads fields and transforms them into table columns
- **Contacts List** (`components/contacts/contacts-list.tsx`): Displays columns based on field configuration

## Notes

- Field visibility can be toggled by users in the UI
- Visibility preferences are persisted in session storage
- Fields with `field_secret` values (e.g., "email", "phone") are system fields and cannot be hidden
- Data fields are prefixed with `data_` when used as column keys (e.g., `data_leadscore`)
