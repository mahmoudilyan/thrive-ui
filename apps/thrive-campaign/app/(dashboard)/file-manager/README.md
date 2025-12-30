# File Manager Page

## Overview

This page provides a complete file management interface for managing S3 assets with a modern, responsive UI built using the @ui/ design system and Tailwind CSS.

## Features

- **S3 Integration**: Direct integration with AWS S3 for file storage
- **File Upload**: Drag-and-drop and button-based file upload
- **Folder Navigation**: Hierarchical folder structure with breadcrumb navigation
- **File Operations**: Create folders, delete files, view file details
- **Search**: Real-time file search functionality
- **Responsive Design**: Works seamlessly across all device sizes
- **Modern UI**: Built with @ui/ components and Tailwind CSS

## Components Used

### From @ui/components:

- `Button` - For all interactive buttons
- `Input` - For search and form inputs
- `Skeleton` - For loading states
- `IconButton` - For toolbar actions
- `Spinner` - For loading indicators

### Custom Components:

- `FileManagerSimple` - Main file manager interface
- `FileManagerProvider` - Zustand state management
- `FileCard` - Grid view file/folder card
- `FileRow` - List view file/folder row

## Usage

Navigate to `/file-manager` to access the file manager interface.

### Navigation

Breadcrumbs at the top show:

- Dashboard → File Manager

### Actions Available

**Secondary Actions:**

- Settings - Configure file manager settings
- Help - Access help documentation

## State Management

The file manager uses Zustand for state management through `FileManagerProvider`:

```typescript
- currentPath: Current folder path
- items: List of files and folders
- selectedItems: Currently selected items
- viewMode: Grid or list view
- sortBy: Sort criteria (name, date, size, type)
- sortOrder: Ascending or descending
- filter: Search filter text
- filterType: File type filter
- isLoading: Loading state
- error: Error messages
```

## API Integration

The file manager integrates with:

- `/api/assets` - List files and folders
- `/api/assets/upload` - Upload files
- AWS S3 - Direct file operations

## Styling

All styling uses:

- **Tailwind CSS** for utility classes
- **@ui/ components** for consistent design
- No Chakra UI dependencies

## Future Enhancements

- [ ] Multiple file selection
- [ ] Batch operations
- [ ] File previews in modal
- [ ] Advanced search filters
- [ ] File sharing capabilities
- [ ] Version history
