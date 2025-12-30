'use client';

import { ReactNode, useState } from 'react';
import { codeToHtml } from 'shiki';
import { CopyButton } from '@/components/copy-button';
import { getIconForLanguageExtension } from '@/components/language-icons';

/**
 * Client Component version of CodeExample for interactive previews with onClick handlers
 * This ensures the entire component tree is client-side, avoiding serialization issues
 */
interface InteractiveCodeExampleProps {
	title?: string;
	description?: string;
	code: string;
	children: ReactNode;
	showCode?: boolean;
	language?: string;
	fileName?: string;
}

export function InteractiveCodeExample({
	title,
	description,
	code,
	children,
	showCode = true,
	language = 'tsx',
	fileName,
}: InteractiveCodeExampleProps) {
	const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
	const [highlightedCode, setHighlightedCode] = useState<string>('');

	// Highlight code on mount
	React.useEffect(() => {
		async function highlight() {
			const html = await codeToHtml(code, {
				lang: language === 'tsx' ? 'tsx' : language === 'ts' ? 'typescript' : language,
				themes: {
					light: 'github-light',
					dark: 'github-dark',
				},
			});
			setHighlightedCode(html);
		}
		highlight();
	}, [code, language]);

	return (
		<div className="my-8">
			{(title || description) && (
				<div className="mb-3">
					{title && <h3 className="text-lg font-semibold mb-1 text-foreground">{title}</h3>}
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
			)}
			<div className="flex flex-col overflow-hidden rounded-xl border bg-fd-secondary">
				<div className="flex border-b border-border">
					<button
						onClick={() => setActiveTab('preview')}
						className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
							activeTab === 'preview'
								? 'border-primary text-foreground'
								: 'border-transparent text-muted-foreground hover:text-foreground'
						}`}
					>
						Preview
					</button>
					{showCode && (
						<button
							onClick={() => setActiveTab('code')}
							className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
								activeTab === 'code'
									? 'border-primary text-foreground'
									: 'border-transparent text-muted-foreground hover:text-foreground'
							}`}
						>
							Code
						</button>
					)}
				</div>
				{activeTab === 'preview' && (
					<div className="bg-panel p-0 m-0 rounded-none">
						<div className="p-12 flex items-center justify-center min-h-[450px]">{children}</div>
					</div>
				)}
				{showCode && activeTab === 'code' && (
					<div className="!p-0 !m-0 !bg-transparent">
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
								dangerouslySetInnerHTML={{ __html: highlightedCode }}
							/>
						</figure>
					</div>
				)}
			</div>
		</div>
	);
}

// Need to import React for useEffect
import * as React from 'react';
