# S3 Integration Setup

## Overview

The Content Assets page now integrates directly with AWS S3 using your provided environment variables. This provides secure, scalable file storage and management capabilities.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# AWS S3 Configuration
S3_BUCKET=your-s3-bucket-name
S3_REGION=us-east-1
S3_VERSION=latest
S3_KEY=your-aws-access-key-id
S3_SECRET=your-aws-secret-access-key
```

## Features

### File Operations

- **Upload Files**: Support for multiple file uploads with progress feedback
- **Create Folders**: Organize files into hierarchical folder structures
- **Delete Items**: Delete individual files or folders (including all contents)
- **View Files**: Secure signed URL generation for file viewing

### Navigation & Organization

- **Folder Navigation**: Browse through folder hierarchies with breadcrumb navigation
- **Search**: Real-time search across file and folder names
- **Filtering**: Filter by file types (All, Folders, Images, Documents)
- **Sorting**: Sort by name, date, size, or type in ascending/descending order
- **View Modes**: Toggle between grid and list view layouts

### Advanced Features

- **Multi-Selection**: Select multiple items using Cmd/Ctrl+click
- **Bulk Operations**: Delete multiple selected items at once
- **File Type Recognition**: Automatic categorization of images and documents
- **Secure Access**: All file access uses presigned URLs for security
- **Responsive Design**: Works on desktop and mobile devices

## Security

- AWS credentials are securely stored as environment variables
- File access uses presigned URLs with configurable expiration times
- All S3 operations are handled server-side to protect credentials
- No direct client-side access to AWS credentials

## API Endpoints

The following API endpoints are available for S3 operations:

- `GET /api/s3/list?path={path}` - List items in a folder
- `POST /api/s3/upload` - Upload files
- `POST /api/s3/folder` - Create a folder
- `DELETE /api/s3/delete` - Delete items
- `POST /api/s3/signed-url` - Generate signed URLs

## Usage

1. Set up your AWS S3 bucket and obtain access credentials
2. Add the environment variables to your `.env.local` file
3. Navigate to `/content/assets` to access the file manager
4. Start uploading, organizing, and managing your files

## Troubleshooting

### Missing Environment Variables

If you see an error about missing S3 configuration, ensure all required environment variables are set:

- `S3_BUCKET`
- `S3_KEY`
- `S3_SECRET`

### Access Denied Errors

Ensure your AWS credentials have the following S3 permissions:

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`

### File Upload Issues

- Check that your bucket has the correct CORS configuration for file uploads
- Verify file size limits in your AWS bucket policy
- Ensure the bucket region matches your `S3_REGION` setting
