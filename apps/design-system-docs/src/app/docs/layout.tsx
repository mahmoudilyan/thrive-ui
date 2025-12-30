import { source } from '@/lib/source';
import { SiteHeader } from '@/components/site-header';
import { DocsSidebar } from '@/components/docs-sidebar';
import { SearchWrapper } from '@/components/search/search-wrapper';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex-1 flex gap-0">
			<DocsSidebar tree={source.pageTree} />
			{children}
		</div>
	);
}
