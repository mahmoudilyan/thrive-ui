/**
 * Custom MDX Components - Minimal overrides for Fumadocs
 * Most components are inherited from Fumadocs, we only add custom ones
 */

import type { MDXComponents } from 'mdx/types';
import { PropsTable } from '../props-table';
import { PropsTableEnhanced } from '../props-table-enhanced';
import {
	ComponentPageHeader,
	ComponentSection,
	CodeExample,
	Installation,
	Guideline,
	GuidelinesGrid,
	Callout,
	Card,
	Cards,
	Tab,
	Tabs,
	Accordion,
	Accordions,
	Step,
	Steps,
} from './component-page';
import { ColorPalette } from './color-palette';
import { SpacingTokens } from './spacing-palette';
import { ClientOnlyPreview } from './client-only-preview';
import { InteractiveCodeExample } from './interactive-code-example';
import * as PageSectionExamples from './page-section-examples';
import { cn } from '@thrive/ui';

/**
 * Component Preview - Simple preview wrapper
 */
interface ComponentPreviewProps {
	children: React.ReactNode;
	code?: string;
}

export function ComponentPreview({ children, code }: ComponentPreviewProps) {
	if (!code) {
		return (
			<div className="my-6 rounded-lg border bg-fd-secondary/50 p-8 flex items-center justify-center min-h-[200px]">
				{children}
			</div>
		);
	}

	// If code is provided, use Tabs from component-page
	return (
		<Tabs items={['Preview', 'Code']}>
			<Tab value="Preview">
				<div className="p-8 flex items-center justify-center min-h-[200px] bg-fd-secondary/50 rounded-lg">
					{children}
				</div>
			</Tab>
			<Tab value="Code">
				<pre className="overflow-x-auto p-4 bg-gray-950 m-0">
					<code className="text-white font-mono text-sm">{code}</code>
				</pre>
			</Tab>
		</Tabs>
	);
}

/**
 * Export MDX components - Fumadocs handles most HTML elements automatically
 * We only need to export our custom components
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		p: (props: React.ComponentProps<'p'>) => (
			<p className={'leading-relaxed text-ink [&:not(:first-child)]:mt-6'} {...props} />
		),
		ComponentPreview,
		Props: PropsTable,
		PropsEnhanced: PropsTableEnhanced,
		ComponentPageHeader,
		ComponentSection,
		CodeExample,
		Installation,
		Guideline,
		GuidelinesGrid,
		ClientOnlyPreview,
		InteractiveCodeExample,
		...PageSectionExamples,

		// Re-export Fumadocs components for direct use in MDX
		Callout,
		Card,
		Cards,
		Tab,
		Tabs,
		Accordion,
		Accordions,
		Step,
		Steps,

		// Color palette component
		ColorPalette,

		// Spacing palette component
		SpacingTokens,

		// Backward compatibility aliases
		InfoCallout: Callout, // Legacy alias for Callout

		// Allow passed components to override
		...components,
	};
}
