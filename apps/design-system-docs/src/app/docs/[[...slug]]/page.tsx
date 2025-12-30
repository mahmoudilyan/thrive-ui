import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/mdx-components';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import { ComponentPageHeader } from '@/components/mdx/component-page';
import { DocsTableOfContents } from '@/components/docs-toc';
import { Button } from '@/components/ui/button';
import { CopyMarkdownButton } from '@/components/copy-markdown-button';
import type { Metadata } from 'next';

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);

	if (!page) {
		notFound();
	}

	const doc = page.data;

	if (!doc.title || !doc.description) {
		notFound();
	}

	return {
		title: doc.title,
		description: doc.description,
	};
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const page = source.getPage(params.slug);

	if (!page) {
		notFound();
	}

	const doc = page.data as any;
	const MDX = doc.body as any;
	const neighbours = findNeighbour(source.pageTree, page.url);
	const components = useMDXComponents({});

	return (
		<div className="flex flex-col text-base xl:w-full flex-1">
			<div className="bg-bg">
				<div className="max-w-5xl mx-auto py-8 flex justify-between items-start">
					<ComponentPageHeader
						title={doc.title || ''}
						description={doc.description || ''}
						status={doc.status as 'stable' | 'beta' | 'alpha' | 'deprecated'}
						category={doc.category as string}
						githubUrl={doc?.links?.github}
						storybookUrl={doc?.links?.storybook}
					/>
					<CopyMarkdownButton
						slug={params.slug}
						title={doc.title || ''}
						description={doc.description}
					/>
				</div>
			</div>
			<div className="flex min-w-0 flex-1 flex-col max-w-5xl mx-auto">
				<div className="mx-auto flex w-full max-w-5xl min-w-0 flex-1 gap-8 py-8 lg:py-12">
					<div className="w-full flex-1">
						<MDX components={components} />
					</div>
					<div className="sticky top-[calc(var(--header-height,64px)+1px)] z-30 ml-auto hidden h-[calc(100vh-var(--header-height,64px))] min-w-64 flex-col gap-4 overflow-y-auto overscroll-none pb-8 xl:flex">
						<div className="px-4 pt-8">
							<DocsTableOfContents toc={(doc.toc as any) || []} />
						</div>
					</div>
				</div>
				<div className="mx-auto hidden h-16 w-full max-w-5xl items-center gap-2 px-6 sm:flex">
					{neighbours.previous && (
						<Button variant="outline" size="sm" asChild className="gap-2">
							<Link href={neighbours.previous.url}>
								<MdArrowBack className="h-4 w-4" />
								{neighbours.previous.name}
							</Link>
						</Button>
					)}
					{neighbours.next && (
						<Button variant="outline" size="sm" className="ml-auto gap-2" asChild>
							<Link href={neighbours.next.url}>
								{neighbours.next.name}
								<MdArrowForward className="h-4 w-4" />
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
