import { loader } from 'fumadocs-core/source';
import { docs, meta } from '../../.source';
import { createMDXSource } from 'fumadocs-mdx/runtime/next';

// Cache the source loader to avoid re-evaluating on every request
let cachedSource: ReturnType<typeof loader> | null = null;

export const source = (() => {
	if (!cachedSource) {
		cachedSource = loader({
			baseUrl: '/docs',
			source: createMDXSource(docs, meta),
		});
	}
	return cachedSource;
})();
