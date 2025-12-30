/**
 * Re-export Fumadocs UI components for use in MDX files
 * This file provides a thin wrapper around Fumadocs components
 * to maintain backward compatibility with existing MDX content
 */

import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { CodeBlock, Pre } from '@/components/codeblock';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { CopyButton } from '@/components/copy-button';
import { getIconForLanguageExtension } from '@/components/language-icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SiStorybook, SiGithub } from 'react-icons/si';

// Re-export Fumadocs components directly
export { Callout, Card, Cards, Tab, Tabs, Accordion, Accordions, CodeBlock, Pre, Step, Steps };

// Legacy aliases for backward compatibility
export { Callout as InfoCallout };

/**
 * Component Page Header - Simple wrapper for consistency
 * Usage in MDX: <ComponentPageHeader title="Button" description="..." />
 */
interface ComponentPageHeaderProps {
	title: string;
	description: string;
	status?: 'stable' | 'beta' | 'alpha' | 'deprecated';
	category?: string;
	githubUrl?: string;
	storybookUrl?: string;
}

export function ComponentPageHeader({
	title,
	description,
	status = 'stable',
	category,
	githubUrl,
	storybookUrl,
}: ComponentPageHeaderProps) {
	const statusTypes = {
		stable: 'info',
		beta: 'info',
		alpha: 'warn',
		deprecated: 'error',
	} as const;
	console.log(githubUrl, storybookUrl);
	return (
		<div className="mb-2">
			{category && (
				<p className="text-sm font-medium text-fd-muted-foreground uppercase tracking-wider mb-2">
					{category}
				</p>
			)}
			<h1 className="text-4xl font-bold mb-4">{title}</h1>
			<p className="text-xl text-fd-muted-foreground mb-4">{description}</p>
			<div className="flex items-center gap-2">
				{githubUrl && (
					<Link href={githubUrl} className="text-sm text-fd-muted-foreground mb-4" target="_blank">
						<SiGithub />
					</Link>
				)}
				{storybookUrl && (
					<Link
						href={storybookUrl}
						className="text-sm text-fd-muted-foreground mb-4"
						target="_blank"
					>
						<SiStorybook />
					</Link>
				)}
			</div>

			{status !== 'stable' && (
				<Callout type={statusTypes[status]} title={`Status: ${status}`}>
					This component is currently in {status} status.
				</Callout>
			)}
		</div>
	);
}

/**
 * Component Section - Semantic section wrapper
 * Usage: <ComponentSection title="Usage">...</ComponentSection>
 */
interface ComponentSectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

export function ComponentSection({ title, description, children }: ComponentSectionProps) {
	return (
		<section className="mt-12 scroll-mt-20" id={title.toLowerCase().replace(/\s+/g, '-')}>
			<h2 className="text-2xl font-bold mb-2">{title}</h2>
			{description && <p className="text-fd-muted-foreground mb-6">{description}</p>}
			{children}
		</section>
	);
}

/**
 * Code Example with Preview - Uses Fumadocs Tabs
 * Usage: <CodeExample code="..." preview={<Button />} />
 */
interface CodeExampleProps {
	title?: string;
	description?: string;
	code: string;
	preview?: React.ReactNode;
	showCode?: boolean;
	language?: string;
	fileName?: string;
}

export async function CodeExample({
	title,
	description,
	code,
	preview,
	showCode = true,
	language = 'tsx',
	fileName,
}: CodeExampleProps) {
	if (!preview) {
		// No preview, just show code
		return (
			<div className="my-8">
				{(title || description) && (
					<div className="mb-3">
						{title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
						{description && <p className="text-sm text-muted-foreground">{description}</p>}
					</div>
				)}
				{await ComponentCode({ code, language, fileName })}
			</div>
		);
	}

	// With preview, use Tabs with cleaner styling
	return (
		<div className="my-8">
			{(title || description) && (
				<div className="mb-3">
					{title && <h3 className="text-lg font-semibold mb-1 text-foreground">{title}</h3>}
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
			)}
			<Tabs items={['Preview', 'Code']} defaultIndex={0}>
				<Tab value="Preview" className="bg-panel p-0 m-0 rounded-none">
					<div className="p-12 flex items-center justify-center min-h-[450px]">{preview}</div>
				</Tab>
				{showCode && (
					<Tab value="Code" className="!p-0 !m-0 !bg-transparent">
						{await ComponentCode({ code, language, fileName })}
					</Tab>
				)}
			</Tabs>
		</div>
	);
}

/**
 * Component Code Display - Styled code block with copy button
 * Uses Shiki to highlight code strings
 */
async function ComponentCode({
	code,
	language = 'tsx',
	fileName,
}: {
	code: string;
	language: string;
	fileName?: string;
}) {
	// Dynamically import Shiki to highlight code
	const { codeToHtml } = await import('shiki');

	const html = await codeToHtml(code, {
		lang: language === 'tsx' ? 'tsx' : language === 'ts' ? 'typescript' : language,
		themes: {
			light: 'github-light',
			dark: 'github-dark',
		},
	});

	return (
		<figure className="shiki relative group bg-panel overflow-hidden my-0">
			{fileName && (
				<figcaption
					data-language={language}
					className="flex items-center gap-2 border-b border-border bg-panel px-4 py-3 text-sm font-medium text-ink"
				>
					<span className="flex items-center gap-2">
						{getIconForLanguageExtension(language)}
						{fileName}
					</span>
				</figcaption>
			)}
			<div className="absolute top-2 right-2 z-10">
				<CopyButton value={code} />
			</div>
			<div
				className="relative py-3.5 px-4 max-h-[450px] overflow-auto"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</figure>
	);
}

/**
 * Installation Section - Package manager tabs
 */
interface InstallationProps {
	packages?: string[];
	packageName?: string;
}

export async function Installation({ packages, packageName }: InstallationProps) {
	const pkgName = packageName || '@thrive/ui';
	const installCommand = packages ? packages.join(' ') : pkgName;

	return (
		<div className="my-8">
			<h2 className="text-2xl font-bold mb-4">Installation</h2>
			<Tabs items={['npm', 'yarn', 'pnpm', 'bun']} defaultIndex={0}>
				<Tab value="npm">
					{await ComponentCode({ code: `npm install ${installCommand}`, language: 'bash' })}
				</Tab>
				<Tab value="yarn">
					{await ComponentCode({ code: `yarn add ${installCommand}`, language: 'bash' })}
				</Tab>
				<Tab value="pnpm">
					{await ComponentCode({ code: `pnpm add ${installCommand}`, language: 'bash' })}
				</Tab>
				<Tab value="bun">
					{await ComponentCode({ code: `bun add ${installCommand}`, language: 'bash' })}
				</Tab>
			</Tabs>
		</div>
	);
}

/**
 * Guidelines Grid - For Do's and Don'ts
 */
interface GuidelineProps {
	type: 'do' | 'dont';
	title: string;
	children: React.ReactNode;
	image?: string;
}

export function Guideline({ type, title, children, image }: GuidelineProps) {
	const badgeColor =
		type === 'do'
			? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
			: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
	const borderColor =
		type === 'do'
			? 'border-green-200 dark:border-green-900/50'
			: 'border-red-200 dark:border-red-900/50';

	return (
		<div className="space-y-3">
			<div className={cn('rounded-lg border p-4', borderColor, 'bg-card')}>
				<div className="flex items-start gap-3">
					<div
						className={cn(
							'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold',
							badgeColor
						)}
					>
						{type === 'do' ? '✓' : '✗'}
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="font-semibold text-base mb-2">{title}</h4>
						<div className="text-sm text-muted-foreground">{children}</div>
					</div>
				</div>
			</div>
			{image && (
				<div className="relative overflow-hidden rounded-lg border border-border bg-muted">
					<img src={image} alt={title} className="w-full h-auto" />
				</div>
			)}
		</div>
	);
}

export function GuidelinesGrid({ children }: { children: React.ReactNode }) {
	return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">{children}</div>;
}

/**
 * Code Block Tab - Syntax highlighted code block for use in Tabs
 * Usage in MDX:
 * <Tabs items={['TypeScript', 'JavaScript']}>
 *   <Tab value="TypeScript">
 *     <CodeBlockTab code="..." language="tsx" fileName="example.tsx" />
 *   </Tab>
 *   <Tab value="JavaScript">
 *     <CodeBlockTab code="..." language="jsx" fileName="example.jsx" />
 *   </Tab>
 * </Tabs>
 */
interface CodeBlockTabProps {
	code: string;
	language?: string;
	fileName?: string;
	className?: string;
}

export function CodeBlockTab({ code, language = 'tsx', fileName, className }: CodeBlockTabProps) {
	return (
		<figure className={cn('shiki relative group bg-panel overflow-hidden my-0', className)}>
			{fileName && (
				<figcaption
					data-language={language}
					className="flex items-center gap-2 border-b border-border bg-panel px-4 py-3 text-sm font-medium text-foreground"
				>
					<span className="flex items-center gap-2">
						{getIconForLanguageExtension(language)}
						{fileName}
					</span>
				</figcaption>
			)}
			<div className="absolute top-2 right-2 z-10">
				<CopyButton value={code} />
			</div>
			<div
				className="relative py-3.5 px-4 max-h-[450px] overflow-auto"
				dangerouslySetInnerHTML={{ __html: code }}
			/>
		</figure>
	);
}
