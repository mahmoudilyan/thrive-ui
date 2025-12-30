import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

interface CacheEntry<T> {
	data: T;
	expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, CacheEntry<unknown>>();
const mockRoot = resolveMockRoot();

const PRELOAD_FILES = [
	'contacts.json',
	'eventsList.json',
	'youtubeVideos.json',
	'lists-list-view.json',
	'instagramMessages.json',
	'messageStream.json',
];

function resolveMockRoot(): string {
	const candidates = [
		path.join(process.cwd(), 'mock'),
		path.join(process.cwd(), 'apps', 'thrive-campaign', 'mock'),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}

	throw new Error('Unable to locate mock data directory.');
}

export function resolveMockPath(relativePath: string): string {
	const cleaned = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
	return path.join(mockRoot, cleaned);
}

export async function readCachedJson<T = unknown>(relativePath: string): Promise<T> {
	const filePath = resolveMockPath(relativePath);
	const now = Date.now();
	const cached = cache.get(filePath);

	if (cached && cached.expiresAt > now) {
		return cached.data as T;
	}

	const fileContents = await readFile(filePath, 'utf8');
	const parsed = JSON.parse(fileContents) as T;

	cache.set(filePath, {
		data: parsed,
		expiresAt: now + CACHE_TTL_MS,
	});

	return parsed;
}

export async function preloadMockFiles(filePaths: string[]): Promise<void> {
	await Promise.all(
		filePaths.map(async filePath => {
			try {
				await readCachedJson(filePath);
			} catch (error) {
				console.warn(`Failed to preload mock file at ${filePath}:`, (error as Error).message);
			}
		})
	);
}

export function clearMockCache(): void {
	cache.clear();
}

export { CACHE_TTL_MS };

// fire-and-forget preload; we intentionally ignore rejections here to avoid crashing during startup
void preloadMockFiles(PRELOAD_FILES);
