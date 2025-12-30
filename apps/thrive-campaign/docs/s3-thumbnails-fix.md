# S3 Thumbnails Fix Guide

## Issue Summary

- Images were showing as gray boxes instead of thumbnails
- Clicking images resulted in "Failed to generate secure URL" error
- API calls were going to wrong port (3011 instead of Next.js app)

## Solution Applied

### 1. Fixed API URLs

Changed all S3 API calls from `http://localhost:3011/api/s3/*` to relative URLs `/api/s3/*` so they hit the Next.js API routes.

### 2. Created/Fixed API Route

The `/api/s3/signed-url` route now properly uses `awsS3Service` to generate signed URLs.

### 3. Environment Variables Required

Make sure these are set in your `.env.local` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name

# OR if using different names:
S3_ACCESS_KEY_ID=your_aws_access_key
S3_SECRET_ACCESS_KEY=your_aws_secret_key
S3_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
```

### 4. S3 Bucket CORS Configuration

Add this CORS policy to your S3 bucket:

```json
[
	{
		"AllowedHeaders": ["*"],
		"AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
		"AllowedOrigins": [
			"http://localhost:3000",
			"http://localhost:3010",
			"https://your-production-domain.com"
		],
		"ExposeHeaders": ["ETag"],
		"MaxAgeSeconds": 3000
	}
]
```

### 5. Test the Fix

1. Navigate to `/content/test-s3`
2. Enter a valid S3 key (e.g., `_createform_-_Copy.png`)
3. Click "Test Signed URL"
4. Check browser console for logs
5. If successful, you should see the image preview

### 6. How It Works Now

1. File Manager calls `/api/s3/signed-url` (Next.js API route)
2. API route uses `awsS3Service.getSignedUrl()` to generate pre-signed URLs
3. Images are loaded using standard `<img>` tags with signed URLs
4. Fallback icons shown if image fails to load

### 7. Debugging Tips

- Check browser console for error messages
- Verify AWS credentials are set correctly
- Ensure S3 bucket has proper CORS settings
- Check that images exist in the S3 bucket
- Use the test page at `/content/test-s3` to isolate issues
