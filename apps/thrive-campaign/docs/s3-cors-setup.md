# S3 CORS Configuration for File Manager

## Problem

The file manager thumbnails are failing to load due to CORS (Cross-Origin Resource Sharing) restrictions. When your frontend (running on `localhost:3011`) tries to load images directly from S3, the browser blocks the requests because S3 hasn't been configured to allow cross-origin requests.

## Solution: Configure S3 Bucket CORS

### Option 1: Using AWS Console

1. Go to the AWS S3 Console
2. Select your bucket (`assets-uix-vbout-com`)
3. Go to the **Permissions** tab
4. Scroll down to **Cross-origin resource sharing (CORS)**
5. Click **Edit** and add this configuration:

```json
[
	{
		"AllowedHeaders": ["*"],
		"AllowedMethods": ["GET", "HEAD"],
		"AllowedOrigins": [
			"http://localhost:3000",
			"http://localhost:3010",
			"http://localhost:3011",
			"https://uix.vbout.com"
		],
		"ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
		"MaxAgeSeconds": 3600
	}
]
```

### Option 2: Using AWS CLI

```bash
# Create a cors-config.json file with the above configuration
aws s3api put-bucket-cors --bucket assets-uix-vbout-com --cors-configuration file://cors-config.json
```

### Option 3: Using AWS SDK (in your backend)

```typescript
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });

const corsConfig = {
	Bucket: 'assets-uix-vbout-com',
	CORSConfiguration: {
		CORSRules: [
			{
				AllowedHeaders: ['*'],
				AllowedMethods: ['GET', 'HEAD'],
				AllowedOrigins: [
					'http://localhost:3000',
					'http://localhost:3010',
					'http://localhost:3011',
					'https://uix.vbout.com',
				],
				ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
				MaxAgeSeconds: 3600,
			},
		],
	},
};

await s3Client.send(new PutBucketCorsCommand(corsConfig));
```

## Important Notes

1. **Security**: Only add origins that you trust. Don't use `"*"` for `AllowedOrigins` in production.
2. **HTTPS**: In production, always use HTTPS origins.
3. **Caching**: The browser caches CORS preflight responses for `MaxAgeSeconds` (3600 seconds = 1 hour in this example).

## Testing CORS

After configuring CORS, you can test it:

```bash
# Test CORS headers
curl -H "Origin: http://localhost:3011" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://assets-uix-vbout-com.s3.us-east-1.amazonaws.com/test-image.jpg \
     -I
```

You should see headers like:

```
Access-Control-Allow-Origin: http://localhost:3011
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Max-Age: 3600
```

## Alternative: Proxy Through Your Backend

If you can't modify the S3 bucket CORS settings, you can proxy the images through your Next.js backend:

1. Create an API route that fetches the image from S3
2. Return it with appropriate CORS headers
3. Update the file manager to use your proxy endpoint instead of direct S3 URLs

This approach has performance implications but works when you don't have control over the S3 bucket configuration.
