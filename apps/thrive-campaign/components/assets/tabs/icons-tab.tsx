'use client';

import { useState, useEffect } from 'react';
import { MdSearch, MdDownload, MdRemoveRedEye } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import { toaster } from '@thrive/ui';
import { MEDIA_SOURCES_CONFIG } from '@/config/media-sources';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@thrive/ui';
import { Button, Input, Skeleton } from '@thrive/ui';
import { createListCollection } from '@chakra-ui/react';

interface Icon {
	name: string;
	path: string;
	url: string;
}

interface IconsData {
	home: string;
	icons: {
		[path: string]: string[];
	};
}

interface IconsTabProps {
	onSelect?: (url: string) => void;
}

export function IconsTab({ onSelect }: IconsTabProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [size, setSize] = useState('48dp');
	const [color, setColor] = useState('black');
	const [items, setItems] = useState<Icon[]>([]);
	const [displayedCount, setDisplayedCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [iconsData, setIconsData] = useState<IconsData | null>(null);
	const { ref: loadMoreRef, inView } = useInView();

	const config = MEDIA_SOURCES_CONFIG.icons;

	// Load more when scrolling to bottom
	useEffect(() => {
		if (inView && displayedCount < items.length) {
			setDisplayedCount(prev => Math.min(prev + config.itemsPerPage, items.length));
		}
	}, [inView, displayedCount, items.length]);

	const handleSearch = async () => {
		setLoading(true);
		setItems([]);
		setDisplayedCount(0);

		const cacheKey = `${size}-${color}`;

		try {
			// Check if we already have the data
			if (iconsData && cacheKey === `${size}-${color}`) {
				processIcons(iconsData);
				return;
			}

			// Fetch icons data
			const response = await fetch(`${config.apiUrl}/get-icons?size=${size}&color=${color}`);

			if (!response.ok) throw new Error('Failed to fetch icons');

			const data: IconsData = await response.json();
			setIconsData(data);
			processIcons(data);
		} catch (error) {
			console.error('Failed to load icons:', error);
			toaster.create({
				title: 'Failed to load icons',
				description: 'Could not load icons. Please try again.',
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const processIcons = (data: IconsData) => {
		const searchLower = searchTerm.toLowerCase().replace(/\s/g, '_');
		const filtered: Icon[] = [];

		for (const path in data.icons) {
			for (const iconName of data.icons[path]) {
				if (
					iconName.includes(size) &&
					iconName.includes(color) &&
					(!searchTerm || iconName.toLowerCase().includes(searchLower))
				) {
					filtered.push({
						name: iconName,
						path: path,
						url: `${data.home}${path}/${iconName}`,
					});
				}
			}
		}

		setItems(filtered);
		setDisplayedCount(Math.min(config.itemsPerPage, filtered.length));
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const handleItemClick = (item: Icon) => {
		if (onSelect) {
			onSelect(item.url);
		}
	};

	const sizeOptions = config.sizes.map(s => ({ value: s, label: s }));
	const colorOptions = config.colors.map(c => ({
		value: c,
		label: c.charAt(0).toUpperCase() + c.slice(1),
	}));

	const sizeCollection = createListCollection({ items: sizeOptions });
	const colorCollection = createListCollection({ items: colorOptions });

	// Load initial icons
	useEffect(() => {
		handleSearch();
	}, [size, color]);

	const displayedItems = items.slice(0, displayedCount);

	return (
		<div className="p-4">
			{/* Search Bar */}
			<div className="flex gap-2 mb-4">
				<div className="flex-1">
					<Input
						placeholder="Search Icon..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyPress={handleKeyPress}
						size="md"
					/>
				</div>

				<SelectRoot
					collection={sizeCollection}
					value={[size]}
					onValueChange={e => setSize(e.value[0])}
					size="md"
				>
					<SelectTrigger>
						<SelectValueText placeholder="Size" />
					</SelectTrigger>
					<SelectContent>
						{sizeOptions.map(item => (
							<SelectItem key={item.value} item={item}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>

				<SelectRoot
					collection={colorCollection}
					value={[color]}
					onValueChange={e => setColor(e.value[0])}
					size="md"
				>
					<SelectTrigger>
						<SelectValueText placeholder="Color" />
					</SelectTrigger>
					<SelectContent>
						{colorOptions.map(item => (
							<SelectItem key={item.value} item={item}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>

				<Button onClick={handleSearch} variant="primary" leftIcon={<MdSearch />} />
			</div>

			{/* Results Grid */}
			<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
				{displayedItems.map((item, index) => (
					<div
						key={`${item.path}-${item.name}-${index}`}
						className="rounded-md overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer bg-white p-3 transition-all"
						onClick={() => handleItemClick(item)}
					>
						<div className="flex flex-col items-center justify-center min-h-[120px]">
							<img
								src={item.url}
								alt={item.name}
								className="max-w-[64px] max-h-[64px] object-contain"
							/>
							<p className="text-xs text-center mt-2 line-clamp-2">{item.name}</p>
						</div>

						<div className="flex gap-1 justify-center mt-2">
							<a
								href={item.url}
								target="_blank"
								download
								onClick={e => e.stopPropagation()}
								rel="noopener noreferrer"
							>
								<Button size="xs" variant="ghost" leftIcon={<MdDownload />} />
							</a>
							<a
								href={item.url}
								target="_blank"
								onClick={e => e.stopPropagation()}
								rel="noopener noreferrer"
							>
								<Button size="xs" variant="ghost" leftIcon={<MdRemoveRedEye />} />
							</a>
						</div>
					</div>
				))}
			</div>

			{/* Loading State */}
			{loading && items.length === 0 && (
				<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
					{Array.from({ length: 24 }).map((_, i) => (
						<div key={i} className="rounded-md border border-gray-200 p-4">
							<Skeleton className="w-16 h-16 rounded-full mb-2 mx-auto" />
							<Skeleton className="h-4" />
						</div>
					))}
				</div>
			)}

			{/* No Results */}
			{!loading && items.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No icons found...</p>
				</div>
			)}

			{/* Load More */}
			{displayedCount < items.length && (
				<div ref={loadMoreRef} className="text-center py-4">
					<Button
						onClick={() =>
							setDisplayedCount(prev => Math.min(prev + config.itemsPerPage, items.length))
						}
					>
						Load More
					</Button>
				</div>
			)}

			{/* Results Count */}
			{items.length > 0 && (
				<p className="text-center text-sm text-gray-500 mt-4">
					Showing {displayedCount} of {items.length} icons
				</p>
			)}
		</div>
	);
}
