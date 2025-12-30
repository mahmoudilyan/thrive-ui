import { useQuery } from '@tanstack/react-query';
import { appConfig } from '@/config';

export interface LinkMetadata {
	url: string;
	title?: string;
	description?: string;
	image?: string;
	siteName?: string;
	favicon?: string;
	originalUrl?: string;
	finalUrl?: string;
	error?: string;
}

export function useLinkMetadata(url: string | null, enabled: boolean = true) {
	return useQuery<LinkMetadata>({
		queryKey: ['link-metadata', url],
		queryFn: async () => {
			if (!url) throw new Error('URL is required');

			const response = await fetch(`${appConfig.basePath}/api/link-metadata`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch metadata: ${response.statusText}`);
			}

			return response.json();
		},
		enabled: enabled && !!url,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
		retry: 2,
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
	});
}
