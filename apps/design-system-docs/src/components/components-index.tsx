'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
	MdSmartButton,
	MdInput,
	MdDashboard,
	MdErrorOutline,
	MdMoreVert,
	MdAccountCircle,
	MdViewModule,
	MdKeyboardArrowRight,
	MdSearch,
} from 'react-icons/md';
import { useState } from 'react';

interface ComponentInfo {
	name: string;
	slug: string;
	description: string;
	icon: React.ElementType;
	image?: string;
	category: 'actions' | 'form' | 'layout' | 'feedback' | 'overlays' | 'media' | 'structure';
	status?: 'stable' | 'beta' | 'alpha';
}

const components: ComponentInfo[] = [
	// Actions
	{
		name: 'Button',
		slug: 'actions/button',
		description: 'Primary and secondary action elements',
		icon: MdSmartButton,
		category: 'actions',
		status: 'stable',
	},
	{
		name: 'Button Group',
		slug: 'actions/button-group',
		description: 'Group related buttons together',
		icon: MdSmartButton,
		category: 'actions',
		status: 'stable',
	},
	{
		name: 'Icon Button',
		slug: 'actions/icon-button',
		description: 'Buttons with icon only',
		icon: MdSmartButton,
		category: 'actions',
		status: 'stable',
	},

	// Form
	{
		name: 'Input',
		slug: 'form/input',
		description: 'Text input fields for user data',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},
	{
		name: 'Textarea',
		slug: 'form/textarea',
		description: 'Multi-line text input',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},
	{
		name: 'Select',
		slug: 'form/select',
		description: 'Dropdown selection menus',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},
	{
		name: 'Checkbox',
		slug: 'form/checkbox',
		description: 'Binary selection controls',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},
	{
		name: 'Radio',
		slug: 'form/radio',
		description: 'Single selection from options',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},
	{
		name: 'Switch',
		slug: 'form/switch',
		description: 'Toggle on/off controls',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},
	{
		name: 'Date Picker',
		slug: 'form/date-picker',
		description: 'Date and time selection',
		icon: MdInput,
		category: 'form',
		status: 'stable',
	},

	// Layout
	{
		name: 'Page Section',
		slug: 'layout/page-section',
		description: 'Container for page content',
		icon: MdDashboard,
		category: 'layout',
		status: 'stable',
	},
	{
		name: 'Breadcrumbs',
		slug: 'layout/breadcrumbs',
		description: 'Navigation hierarchy indicator',
		icon: MdDashboard,
		category: 'layout',
		status: 'stable',
	},
	{
		name: 'Sidebar',
		slug: 'layout/sidebar',
		description: 'Side navigation component',
		icon: MdDashboard,
		category: 'layout',
		status: 'stable',
	},
	{
		name: 'Topbar',
		slug: 'layout/topbar',
		description: 'Top navigation bar',
		icon: MdDashboard,
		category: 'layout',
		status: 'stable',
	},

	// Feedback
	{
		name: 'Alert',
		slug: 'feedback/alert',
		description: 'Important messages and notifications',
		icon: MdErrorOutline,
		category: 'feedback',
		status: 'stable',
	},
	{
		name: 'Spinner',
		slug: 'feedback/spinner',
		description: 'Loading indicators',
		icon: MdErrorOutline,
		category: 'feedback',
		status: 'stable',
	},
	{
		name: 'Progress',
		slug: 'feedback/progress',
		description: 'Progress indicators',
		icon: MdErrorOutline,
		category: 'feedback',
		status: 'stable',
	},
	{
		name: 'Empty State',
		slug: 'feedback/empty-state',
		description: 'Empty content states',
		icon: MdErrorOutline,
		category: 'feedback',
		status: 'stable',
	},

	// Overlays
	{
		name: 'Dialog',
		slug: 'overlays/dialog',
		description: 'Modal dialogs and popups',
		icon: MdMoreVert,
		category: 'overlays',
		status: 'stable',
	},
	{
		name: 'Drawer',
		slug: 'overlays/drawer',
		description: 'Slide-out panels',
		icon: MdMoreVert,
		category: 'overlays',
		status: 'stable',
	},
	{
		name: 'Popover',
		slug: 'overlays/popover',
		description: 'Contextual popover menus',
		icon: MdMoreVert,
		category: 'overlays',
		status: 'stable',
	},
	{
		name: 'Tooltip',
		slug: 'overlays/tooltip',
		description: 'Hover information tooltips',
		icon: MdMoreVert,
		category: 'overlays',
		status: 'stable',
	},
	{
		name: 'Dropdown',
		slug: 'overlays/dropdown',
		description: 'Dropdown menus',
		icon: MdMoreVert,
		category: 'overlays',
		status: 'stable',
	},

	// Media
	{
		name: 'Avatar',
		slug: 'media/avatar',
		description: 'User profile images and initials',
		icon: MdAccountCircle,
		category: 'media',
		status: 'stable',
	},
	{
		name: 'Icon',
		slug: 'media/icon',
		description: 'Icon components',
		icon: MdAccountCircle,
		category: 'media',
		status: 'stable',
	},

	// Structure
	{
		name: 'Card',
		slug: 'structure/card',
		description: 'Container for grouped content',
		icon: MdViewModule,
		category: 'structure',
		status: 'stable',
	},
	{
		name: 'Badge',
		slug: 'structure/badge',
		description: 'Status labels and indicators',
		icon: MdViewModule,
		category: 'structure',
		status: 'stable',
	},
	{
		name: 'Data Table',
		slug: 'structure/data-table',
		description: 'Sortable, filterable data grids',
		icon: MdViewModule,
		category: 'structure',
		status: 'stable',
	},
	{
		name: 'Tabs',
		slug: 'structure/tabs',
		description: 'Tabbed content navigation',
		icon: MdViewModule,
		category: 'structure',
		status: 'stable',
	},
	{
		name: 'Accordion',
		slug: 'structure/accordion',
		description: 'Collapsible content sections',
		icon: MdViewModule,
		category: 'structure',
		status: 'stable',
	},
];

const categories = {
	actions: {
		name: 'Actions',
		icon: MdSmartButton,
		color: 'from-blue-500 to-indigo-600',
		description: 'Interactive elements that trigger actions',
	},
	form: {
		name: 'Form',
		icon: MdInput,
		color: 'from-purple-500 to-pink-600',
		description: 'Input controls and form elements',
	},
	layout: {
		name: 'Layout',
		icon: MdDashboard,
		color: 'from-cyan-500 to-teal-600',
		description: 'Structure and navigation components',
	},
	feedback: {
		name: 'Feedback',
		icon: MdErrorOutline,
		color: 'from-amber-500 to-orange-600',
		description: 'Status indicators and notifications',
	},
	overlays: {
		name: 'Overlays',
		icon: MdMoreVert,
		color: 'from-emerald-500 to-green-600',
		description: 'Modal dialogs and popups',
	},
	media: {
		name: 'Media',
		icon: MdAccountCircle,
		color: 'from-violet-500 to-purple-600',
		description: 'Images, avatars, and icons',
	},
	structure: {
		name: 'Structure',
		icon: MdViewModule,
		color: 'from-rose-500 to-red-600',
		description: 'Container and organizational components',
	},
} as const;

export function ComponentsIndex() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const filteredComponents = components.filter(component => {
		const matchesSearch =
			component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			component.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = !selectedCategory || component.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const componentsByCategory = filteredComponents.reduce(
		(acc, component) => {
			if (!acc[component.category]) {
				acc[component.category] = [];
			}
			acc[component.category].push(component);
			return acc;
		},
		{} as Record<string, ComponentInfo[]>
	);

	return (
		<div className="space-y-12">
			{/* Header */}
			<div className="space-y-4">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Components</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
					Build beautiful interfaces with our comprehensive component library. Each component is
					carefully designed, fully accessible, and production-ready.
				</p>
			</div>

			{/* Search and Filter */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
					<input
						type="text"
						placeholder="Search components..."
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					<button
						onClick={() => setSelectedCategory(null)}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							!selectedCategory
								? 'bg-cyan-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
						}`}
					>
						All
					</button>
					{Object.entries(categories).map(([key, category]) => (
						<button
							key={key}
							onClick={() => setSelectedCategory(key)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedCategory === key
									? 'bg-cyan-500 text-white'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
							}`}
						>
							{category.name}
						</button>
					))}
				</div>
			</div>

			{/* Components by Category */}
			{Object.entries(componentsByCategory).length > 0 ? (
				<div className="space-y-16">
					{Object.entries(componentsByCategory).map(([categoryKey, categoryComponents]) => {
						const category = categories[categoryKey as keyof typeof categories];
						return (
							<div key={categoryKey} className="space-y-6">
								{/* Category Header */}
								<div className="flex items-center gap-4">
									<div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
										<category.icon className="h-6 w-6" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
											{category.name}
										</h2>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											{category.description}
										</p>
									</div>
									<div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
										{categoryComponents.length}{' '}
										{categoryComponents.length === 1 ? 'component' : 'components'}
									</div>
								</div>

								{/* Components Grid */}
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
									{categoryComponents.map(component => (
										<Link
											key={component.slug}
											href={`/docs/components/${component.slug}`}
											prefetch={true}
											className="group relative overflow-hidden rounded-xl p-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-transparent hover:shadow-xl"
										>
											{/* Gradient Background on Hover */}
											<div
												className={`absolute inset-0 bg-gradient-to-br ${categories[component.category].color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
											/>

											{/* Component Image/Icon */}
											<div className="mb-4 relative">
												<div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg blur-xl group-hover:blur-2xl group-hover:scale-150 transition-all duration-300 opacity-50 group-hover:opacity-100" />
												<div className="relative w-14 h-14 rounded-lg bg-white dark:bg-gray-900 group-hover:bg-transparent flex items-center justify-center transition-colors duration-300 border border-gray-200 dark:border-gray-800 group-hover:border-transparent">
													{component.image ? (
														<Image
															src={component.image}
															alt={component.name}
															width={56}
															height={56}
															className="rounded-lg"
														/>
													) : (
														<component.icon className="text-2xl text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
													)}
												</div>
											</div>

											{/* Component Info */}
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-white transition-colors duration-300">
														{component.name}
													</h3>
													{component.status && (
														<span
															className={`text-xs px-2 py-0.5 rounded-full ${
																component.status === 'stable'
																	? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 group-hover:bg-white/20 group-hover:text-white'
																	: component.status === 'beta'
																		? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 group-hover:bg-white/20 group-hover:text-white'
																		: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-white/20 group-hover:text-white'
															} transition-colors duration-300`}
														>
															{component.status}
														</span>
													)}
												</div>
												<p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
													{component.description}
												</p>
											</div>

											{/* Arrow Indicator */}
											<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
												<MdKeyboardArrowRight className="w-5 h-5 text-white" />
											</div>
										</Link>
									))}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-500 dark:text-gray-400">
						No components found matching your search.
					</p>
				</div>
			)}
		</div>
	);
}
