import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '@thrive/ui';

const meta = {
	title: 'Foundation/Typography',
	component: Text,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: `
# Typography

Our typography system provides a consistent and scalable approach to text styling. Built on Inter for headings and body text, with Manrope for display purposes.

## Font Families

- **Heading**: Inter - Clean, readable, professional
- **Body**: Inter - Optimized for reading at all sizes  
- **Display**: Manrope - Geometric sans-serif for impact

## Type Scale

Our type scale follows a systematic approach with consistent line heights and letter spacing for optimal readability.
				`,
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// Typography Scale Overview
export const TypographyScale: Story = {
	render: () => (
		<div className="space-y-8">
			{/* Heading Scale */}
			<section>
				<Text variant="heading-lg" fontWeight="bold" className="mb-4 pb-2 border-b border-border">
					Heading Scale
				</Text>
				<div className="space-y-3">
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								3XL
							</Text>
						</div>
						<Text variant="heading-3xl" fontWeight="bold">
							The quick brown fox
						</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								2XL
							</Text>
						</div>
						<Text variant="heading-2xl" fontWeight="bold">
							The quick brown fox jumps
						</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								XL
							</Text>
						</div>
						<Text variant="heading-xl" fontWeight="semibold">
							The quick brown fox jumps over
						</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								LG
							</Text>
						</div>
						<Text variant="heading-lg" fontWeight="semibold">
							The quick brown fox jumps over the lazy dog
						</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								MD
							</Text>
						</div>
						<Text variant="heading-md" fontWeight="medium">
							The quick brown fox jumps over the lazy dog
						</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								SM
							</Text>
						</div>
						<Text variant="heading-sm" fontWeight="medium">
							The quick brown fox jumps over the lazy dog
						</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								XS
							</Text>
						</div>
						<Text variant="heading-xs" fontWeight="medium">
							The quick brown fox jumps over the lazy dog
						</Text>
					</div>
				</div>
			</section>

			{/* Body Scale */}
			<section>
				<Text variant="heading-lg" fontWeight="bold" className="mb-4 pb-2 border-b border-border">
					Body Text Scale
				</Text>
				<div className="space-y-3">
					<div className="flex items-start gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								LG
							</Text>
						</div>
						<div className="flex-1">
							<Text variant="body-lg">
								Body LG - Used for emphasized paragraph text, introductions, or important content
								that needs to stand out.
							</Text>
						</div>
					</div>
					<div className="flex items-start gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								MD
							</Text>
						</div>
						<div className="flex-1">
							<Text variant="body-md">
								Body MD - The default body text size for most content, articles, and general reading
								material.
							</Text>
						</div>
					</div>
					<div className="flex items-start gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								SM
							</Text>
						</div>
						<div className="flex-1">
							<Text variant="body-sm">
								Body SM - Used for secondary information, captions, metadata, and supporting
								details.
							</Text>
						</div>
					</div>
					<div className="flex items-start gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								XS
							</Text>
						</div>
						<div className="flex-1">
							<Text variant="body-xs">
								Body XS - Smallest body text for fine print, legal text, or minimal space
								situations.
							</Text>
						</div>
					</div>
				</div>
			</section>

			{/* Caps Scale */}
			<section>
				<Text variant="heading-lg" fontWeight="bold" className="mb-4 pb-2 border-b border-border">
					Caps (Uppercase) Scale
				</Text>
				<div className="space-y-3">
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								LG
							</Text>
						</div>
						<Text variant="caps-lg">Section Headers</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								MD
							</Text>
						</div>
						<Text variant="caps-md">Form Labels</Text>
					</div>
					<div className="flex items-baseline gap-4">
						<div className="w-24 text-right">
							<Text variant="body-xs" color="text-ink-muted">
								SM
							</Text>
						</div>
						<Text variant="caps-sm">Small Metadata</Text>
					</div>
				</div>
			</section>
		</div>
	),
};

// Text Colors
export const TextColors: Story = {
	render: () => (
		<div className="space-y-6">
			<Text variant="heading-lg" fontWeight="bold" className="mb-4 pb-2 border-b border-border">
				Text Colors
			</Text>

			{/* Primary Text Colors */}
			<section>
				<Text variant="heading-md" fontWeight="semibold" className="mb-3">
					Primary Text Colors
				</Text>
				<div className="space-y-2">
					<Text variant="body-md" color="text-ink-dark">
						Ink Dark - Primary headings and high emphasis text
					</Text>
					<Text variant="body-md" color="text-ink">
						Ink - Default body text and standard content
					</Text>
					<Text variant="body-md" color="text-ink-light">
						Ink Light - Secondary text and metadata
					</Text>
					<Text variant="body-md" color="text-ink-muted">
						Ink Muted - Subtle text and placeholders
					</Text>
				</div>
			</section>

			{/* Semantic Text Colors */}
			<section>
				<Text variant="heading-md" fontWeight="semibold" className="mb-3">
					Semantic Text Colors
				</Text>
				<div className="space-y-2">
					<Text variant="body-md" color="text-ink-primary">
						Primary - Brand and primary actions
					</Text>
					<Text variant="body-md" color="text-ink-success">
						Success - Positive feedback and confirmations
					</Text>
					<Text variant="body-md" color="text-ink-warning">
						Warning - Caution and attention-grabbing content
					</Text>
					<Text variant="body-md" color="text-ink-destructive">
						Destructive - Errors and critical information
					</Text>
					<Text variant="body-md" color="text-ink-info">
						Info - Informational content and tips
					</Text>
				</div>
			</section>
		</div>
	),
};

// Font Weights
export const FontWeights: Story = {
	render: () => (
		<div className="space-y-4">
			<Text variant="heading-lg" fontWeight="bold" className="mb-4 pb-2 border-b border-border">
				Font Weights
			</Text>
			<div className="space-y-3">
				<Text variant="heading-md" fontWeight="regular">
					Regular (400) - Standard text weight
				</Text>
				<Text variant="heading-md" fontWeight="medium">
					Medium (500) - Slight emphasis
				</Text>
				<Text variant="heading-md" fontWeight="semibold">
					Semibold (600) - Strong emphasis
				</Text>
				<Text variant="heading-md" fontWeight="bold">
					Bold (700) - Maximum emphasis
				</Text>
			</div>
		</div>
	),
};

// Typography in Context
export const TypographyInContext: Story = {
	render: () => (
		<div className="max-w-4xl space-y-6">
			<article className="bg-panel border border-border rounded-lg p-6">
				<Text as="h1" variant="heading-2xl" fontWeight="bold" className="mb-2">
					Getting Started with Design Systems
				</Text>
				<Text variant="body-sm" color="text-ink-light" className="mb-6">
					Published on March 15, 2024 • 5 min read
				</Text>

				<Text as="p" variant="body-lg" className="mb-4">
					A design system is a collection of reusable components, guidelines, and standards that
					help teams build consistent user interfaces across products and platforms.
				</Text>

				<Text as="h2" variant="heading-lg" fontWeight="semibold" className="mb-3 mt-6">
					Why Use a Design System?
				</Text>

				<Text as="p" variant="body-md" className="mb-4">
					Design systems provide numerous benefits for both designers and developers. They ensure
					consistency, improve efficiency, and create a shared language between team members.
				</Text>

				<div className="bg-secondary rounded-lg p-4 mb-4">
					<Text variant="caps-sm" color="text-ink-primary" className="mb-2">
						Quick Tip
					</Text>
					<Text variant="body-sm">
						Start small with your most commonly used components and gradually expand your design
						system as your team's needs grow.
					</Text>
				</div>

				<Text as="h3" variant="heading-md" fontWeight="medium" className="mb-3">
					Key Components
				</Text>

				<Text as="p" variant="body-md" className="mb-2">
					Every design system should include:
				</Text>

				<ul className="space-y-1 mb-4 ml-4">
					<li className="body-sm text-ink">Design tokens (colors, typography, spacing)</li>
					<li className="body-sm text-ink">Component library with clear documentation</li>
					<li className="body-sm text-ink">Usage guidelines and best practices</li>
					<li className="body-sm text-ink">Accessibility standards and testing</li>
				</ul>

				<Text variant="body-xs" color="text-ink-muted">
					This article demonstrates the typography scale in a realistic content context.
				</Text>
			</article>
		</div>
	),
};
