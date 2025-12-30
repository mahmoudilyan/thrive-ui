# Media Picker Dialog

The Media Picker Dialog is a comprehensive component that allows users to select media from various sources including local uploads, Pixabay, Giphy, Icons, and E-commerce products.

## Features

- **Multiple Media Sources**: Access media from 5 different sources via tabs
- **Search Functionality**: Each tab has its own search capabilities
- **Load More/Pagination**: Efficient loading with pagination support
- **Preview & Download**: Preview media before selection and download options
- **Responsive Design**: Works well on all screen sizes

## Usage

```tsx
import { MediaPickerDialog } from '@/components/ui/common-dialogs/media-picker-dialog';

function MyComponent() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState('');

	const handleSelect = (url: string) => {
		setSelectedMedia(url);
		// Do something with the selected URL
	};

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Select Media</Button>

			<MediaPickerDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={handleSelect} />
		</>
	);
}
```

## Tabs

### 1. Uploads Tab

- Browse and select files from S3 storage
- Navigate through folders
- Search files by name
- Shows file icons for different file types

### 2. Pixabay Tab

- Search high-quality images and videos from Pixabay
- Toggle between image and video search
- Free stock photos with commercial use
- Shows image previews in a grid

### 3. Giphy Tab

- Search animated GIFs from Giphy
- Perfect for adding animations
- Auto-loads default trending GIFs
- Remembers last search term

### 4. Icons Tab

- Browse Material Design icons
- Filter by size (18dp, 24dp, 36dp, 48dp)
- Filter by color (black, white)
- Search icons by name

### 5. E-commerce Tab

- Search product images from connected stores
- Select store from dropdown
- Load product images with titles
- Useful for e-commerce integrations

## Configuration

### API Keys

Add these to your `.env` file:

```env
# Pixabay API (get from https://pixabay.com/api/docs/)
NEXT_PUBLIC_PIXABAY_API_KEY=your_pixabay_api_key

# Giphy API (get from https://developers.giphy.com/)
NEXT_PUBLIC_GIPHY_API_KEY=your_giphy_api_key
```

### Configuration File

API keys and settings are configured in `config/media-sources.ts`:

```ts
export const MEDIA_SOURCES_CONFIG = {
	pixabay: {
		apiKey: process.env.NEXT_PUBLIC_PIXABAY_API_KEY || 'default_key',
		apiUrl: 'https://pixabay.com/api/',
		defaultSearch: 'funny',
		itemsPerPage: 24,
	},
	giphy: {
		apiKey: process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'default_key',
		apiUrl: 'https://api.giphy.com/v1/gifs/search',
		defaultSearch: 'funny',
		itemsPerPage: 10,
	},
	// ... other configurations
};
```

## Component Props

### MediaPickerDialog Props

| Prop       | Type                    | Description                           |
| ---------- | ----------------------- | ------------------------------------- |
| `isOpen`   | `boolean`               | Controls dialog visibility            |
| `onClose`  | `() => void`            | Called when dialog should close       |
| `onSelect` | `(url: string) => void` | Called when media is selected         |
| `fieldId`  | `string` (optional)     | Field identifier for form integration |

## Advanced Usage

### Custom Tab Order

To customize tab order or hide certain tabs, you can modify the `MediaPickerDialog` component:

```tsx
<Tabs.Root defaultValue="pixabay">
	{' '}
	{/* Change default tab */}
	<Tabs.List>
		<Tabs.Trigger value="pixabay">Pixabay</Tabs.Trigger>
		<Tabs.Trigger value="uploads">Uploads</Tabs.Trigger>
		{/* Remove or reorder tabs as needed */}
	</Tabs.List>
	{/* ... */}
</Tabs.Root>
```

### Integration with Forms

The media picker can be integrated with form fields:

```tsx
<Field>
	<Label>Product Image</Label>
	<Input
		value={imageUrl}
		readOnly
		onClick={() => setMediaPickerOpen(true)}
		placeholder="Click to select image"
	/>
</Field>
```

## API Endpoints Required

For full functionality, these API endpoints need to be implemented:

1. **S3 Operations** (Uploads Tab):

   - `/api/s3/list` - List files and folders
   - `/api/s3/signed-url` - Get signed URLs for files
   - `/api/s3/upload` - Upload files
   - `/api/s3/delete` - Delete files
   - `/api/s3/folder` - Create folders

2. **Icons** (Icons Tab):

   - `/api/icons/get-icons` - Get available icons

3. **E-commerce** (E-commerce Tab):
   - `/App/Ecommerce/GetStores.json` - Get store list
   - `/App/Ecommerce/SearchStoreProducts.json` - Search products

## Troubleshooting

### API Key Issues

- Ensure API keys are properly set in `.env` file
- Check that keys have proper permissions
- Verify API rate limits haven't been exceeded

### CORS Issues

- Pixabay and Giphy APIs should work from client-side
- For S3, ensure CORS is properly configured on your bucket
- Icons and E-commerce may need proxy endpoints

### Performance

- Large result sets are paginated automatically
- Images are lazy-loaded as user scrolls
- Search is debounced to reduce API calls

## Future Enhancements

- [ ] Add Unsplash integration
- [ ] Support for video preview in Pixabay tab
- [ ] Drag & drop upload in Uploads tab
- [ ] Recent selections history
- [ ] Favorite/bookmark functionality
- [ ] Advanced filters (size, orientation, color)
