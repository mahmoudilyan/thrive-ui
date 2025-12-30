import { NextRequest, NextResponse } from 'next/server';

interface LinkMetadata {
	url: string;
	title?: string;
	description?: string;
	image?: string;
	siteName?: string;
	favicon?: string;
	originalUrl?: string;
	finalUrl?: string;
}

// Note: Caching is now handled by TanStack Query on the client side

// List of known URL shorteners
const URL_SHORTENERS = [
	'bit.ly',
	'tinyurl.com',
	't.co',
	'goo.gl',
	'ow.ly',
	'short.link',
	'tiny.cc',
	'lnkd.in',
	'youtu.be',
	'buff.ly',
	'ift.tt',
	'rebrand.ly',
	'cutt.ly',
	'shorturl.at',
	'is.gd',
	'v.gd',
	'tr.im',
	'url.ie',
];

function isKnownShortener(hostname: string): boolean {
	return URL_SHORTENERS.some(
		shortener => hostname === shortener || hostname.endsWith('.' + shortener)
	);
}

export async function POST(request: NextRequest) {
	try {
		const { url } = await request.json();

		if (!url || typeof url !== 'string') {
			return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
		}

		// Validate URL format
		let validUrl: URL;
		try {
			validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
		} catch {
			return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
		}

		// Caching removed - handled by TanStack Query on client side

		// Check if this is a known URL shortener (for better UX feedback)
		const isShortener = isKnownShortener(validUrl.hostname);

		// Fetch the webpage with optimized settings - follow redirects properly
		const response = await fetch(validUrl.toString(), {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
				Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate, br',
				'Cache-Control': 'no-cache',
			},
			redirect: 'follow', // This follows redirects automatically
			signal: AbortSignal.timeout(isShortener ? 10000 : 8000), // Extra time for shorteners
		});

		if (!response.ok) {
			return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
		}

		// Get the final URL after all redirects
		const finalUrl = response.url;

		// Stream and process HTML efficiently
		const html = await response.text();

		// Parse both head and a portion of body for image fallback
		const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
		const headContent = headMatch ? headMatch[1] : '';

		// Get a portion of the body content for image fallback
		const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		const bodyContent = bodyMatch ? bodyMatch[1].substring(0, 5000) : ''; // First 5KB of body

		// Use the final URL (after redirects) for metadata extraction
		const metadata = extractMetadata(headContent, bodyContent, finalUrl);

		// Debug logging
		console.log('Link metadata extracted:', {
			url: finalUrl,
			title: metadata.title,
			image: metadata.image,
			description: metadata.description?.substring(0, 100),
		});

		// Include both original and final URLs in response
		const responseMetadata = {
			...metadata,
			originalUrl: validUrl.toString(),
			finalUrl: finalUrl,
		};

		return NextResponse.json(responseMetadata);
	} catch (error) {
		console.error('Link metadata error:', error);
		return NextResponse.json({ error: 'Failed to fetch link metadata' }, { status: 500 });
	}
}

function extractMetadata(headHtml: string, bodyHtml: string, url: string): LinkMetadata {
	const metadata: LinkMetadata = { url };

	// Combine head and body for searching
	const html = headHtml + bodyHtml;

	// Extract title
	let titleMatch = html.match(
		/<meta[^>]*property=["|']og:title["|'][^>]*content=["|']([^"']*)["|']/i
	);
	if (!titleMatch) {
		titleMatch = html.match(
			/<meta[^>]*name=["|']twitter:title["|'][^>]*content=["|']([^"']*)["|']/i
		);
	}
	if (!titleMatch) {
		titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	}
	if (titleMatch) {
		metadata.title = decodeHtmlEntities(titleMatch[1]).trim();
	}

	// Extract description
	let descMatch = html.match(
		/<meta[^>]*property=["|']og:description["|'][^>]*content=["|']([^"']*)["|']/i
	);
	if (!descMatch) {
		descMatch = html.match(
			/<meta[^>]*name=["|']twitter:description["|'][^>]*content=["|']([^"']*)["|']/i
		);
	}
	if (!descMatch) {
		descMatch = html.match(/<meta[^>]*name=["|']description["|'][^>]*content=["|']([^"']*)["|']/i);
	}
	if (descMatch) {
		metadata.description = decodeHtmlEntities(descMatch[1]).trim();
	}

	// Extract image - try multiple methods
	let imageUrl = null;

	// Try og:image first (most common)
	let imageMatch = html.match(
		/<meta[^>]*property=["|']og:image["|'][^>]*content=["|']([^"']*)["|']/i
	);

	// Try twitter:image
	if (!imageMatch) {
		imageMatch = html.match(
			/<meta[^>]*name=["|']twitter:image["|'][^>]*content=["|']([^"']*)["|']/i
		);
	}

	// Try twitter:image:src
	if (!imageMatch) {
		imageMatch = html.match(
			/<meta[^>]*name=["|']twitter:image:src["|'][^>]*content=["|']([^"']*)["|']/i
		);
	}

	// Try og:image:url
	if (!imageMatch) {
		imageMatch = html.match(
			/<meta[^>]*property=["|']og:image:url["|'][^>]*content=["|']([^"']*)["|']/i
		);
	}

	// Try meta name="image"
	if (!imageMatch) {
		imageMatch = html.match(/<meta[^>]*name=["|']image["|'][^>]*content=["|']([^"']*)["|']/i);
	}

	if (imageMatch && imageMatch[1]) {
		imageUrl = imageMatch[1].trim();

		// Clean up the URL
		if (imageUrl) {
			// Remove any extra quotes or whitespace
			imageUrl = imageUrl.replace(/^['"]|['"]$/g, '');

			// Make relative URLs absolute
			if (imageUrl.startsWith('//')) {
				// Protocol-relative URL
				const urlObj = new URL(url);
				imageUrl = `${urlObj.protocol}${imageUrl}`;
			} else if (imageUrl.startsWith('/')) {
				// Absolute path
				const urlObj = new URL(url);
				imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
			} else if (!imageUrl.startsWith('http')) {
				// Relative path
				try {
					imageUrl = new URL(imageUrl, url).toString();
				} catch (e) {
					console.warn('Failed to resolve relative image URL:', imageUrl);
					imageUrl = null;
				}
			}

			// Validate the final URL
			if (imageUrl) {
				try {
					new URL(imageUrl);
					metadata.image = imageUrl;
				} catch (e) {
					console.warn('Invalid image URL generated:', imageUrl);
				}
			}
		}
	}

	// Extract site name
	const siteNameMatch = html.match(
		/<meta[^>]*property=["|']og:site_name["|'][^>]*content=["|']([^"']*)["|']/i
	);
	if (siteNameMatch) {
		metadata.siteName = decodeHtmlEntities(siteNameMatch[1]).trim();
	}

	// Extract favicon
	let faviconMatch = html.match(/<link[^>]*rel=["|']icon["|'][^>]*href=["|']([^"']*)["|']/i);
	if (!faviconMatch) {
		faviconMatch = html.match(/<link[^>]*href=["|']([^"']*)["|'][^>]*rel=["|']icon["|']/i);
	}
	if (faviconMatch) {
		let faviconUrl = faviconMatch[1];
		if (faviconUrl.startsWith('/')) {
			const urlObj = new URL(url);
			faviconUrl = `${urlObj.protocol}//${urlObj.host}${faviconUrl}`;
		} else if (!faviconUrl.startsWith('http')) {
			faviconUrl = new URL(faviconUrl, url).toString();
		}
		metadata.favicon = faviconUrl;
	}

	return metadata;
}

function decodeHtmlEntities(str: string): string {
	const entities: Record<string, string> = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&apos;': "'",
		'&#x27;': "'",
		'&#x2F;': '/',
		'&#x60;': '`',
		'&#x3D;': '=',
	};

	return str.replace(/&[#\w]+;/g, entity => {
		return entities[entity] || entity;
	});
}
