'use client';

import { useState, useEffect } from 'react';
import { MdSearch, MdDownload, MdRemoveRedEye } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import { toaster } from '@thrive/ui';
import { MEDIA_SOURCES_CONFIG } from '@/config/media-sources';
import { Button, Input, Skeleton } from '@thrive/ui';

interface GiphyItem {
	id: string;
	slug: string;
	type: string;
}

interface GiphyResponse {
	data: GiphyItem[];
}

interface GiphyTabProps {
	onSelect?: (url: string) => void;
}

export function GiphyTab({ onSelect }: GiphyTabProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [items, setItems] = useState<GiphyItem[]>([]);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const { ref: loadMoreRef, inView } = useInView();

	const config = MEDIA_SOURCES_CONFIG.giphy;

	// Load saved search term from localStorage
	useEffect(() => {
		const savedSearch = localStorage.getItem('giphyKeyword') || config.defaultSearch;
		setSearchTerm(savedSearch);
		handleSearch(savedSearch, true);
	}, []);

	// Load more when scrolling to bottom
	useEffect(() => {
		if (inView && hasMore && !loading) {
			loadMore();
		}
	}, [inView, hasMore, loading]);

	const handleSearch = async (search: string = searchTerm, reset: boolean = true) => {
		if (!search.trim()) return;

		if (reset) {
			setItems([]);
			setPage(0);
			setHasMore(true);
		}

		setLoading(true);

		try {
			const offset = reset ? 0 : page * config.itemsPerPage;
			const response = await fetch(
				`${config.apiUrl}?q=${encodeURIComponent(search)}&api_key=${config.apiKey}&limit=${config.itemsPerPage}&offset=${offset}`
			);

			if (!response.ok) throw new Error('Failed to fetch');

			const data: GiphyResponse = await response.json();

			if (reset) {
				setItems(data.data);
			} else {
				setItems(prev => [...prev, ...data.data]);
			}

			setHasMore(data.data.length === config.itemsPerPage);

			if (!reset) {
				setPage(prev => prev + 1);
			}

			// Save search term
			localStorage.setItem('giphyKeyword', search);
		} catch (error) {
			console.error('Failed to search Giphy:', error);
			toaster.create({
				title: 'Search failed',
				description: 'Failed to search Giphy. Please try again.',
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const loadMore = () => {
		handleSearch(searchTerm, false);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const handleItemClick = (item: GiphyItem) => {
		const url = `https://i.giphy.com/${item.id}.${item.type}`;

		if (onSelect) {
			onSelect(url);
		}
	};

	const getItemUrl = (item: GiphyItem) => {
		return `https://i.giphy.com/${item.id}.${item.type}`;
	};

	const getThumbnailUrl = (item: GiphyItem) => {
		return `https://i.giphy.com/media/${item.id}/100.${item.type}`;
	};

	return (
		<div className="p-4">
			{/* Search Bar */}
			<div className="flex gap-2 mb-4">
				<div className="flex-1">
					<Input
						placeholder="Search GIF..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyPress={handleKeyPress}
						size="md"
						className="bg-white"
						style={{
							backgroundImage: 'url(/filemanagerS3/extensions/tabs/PoweredByGiphy.png)',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'right center',
							paddingRight: '120px',
						}}
					/>
				</div>

				<Button onClick={() => handleSearch()} variant="primary" leftIcon={<MdSearch />} />
			</div>

			{/* Results Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
				{items.map(item => (
					<div
						key={item.id}
						className="rounded-md overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer bg-white transition-all"
						onClick={() => handleItemClick(item)}
					>
						<div className="relative pb-[75%]">
							<img
								src={getThumbnailUrl(item)}
								alt={item.slug}
								className="absolute top-0 left-0 w-full h-full object-cover"
							/>
						</div>

						<div className="p-2">
							<p className="text-sm line-clamp-1 mb-1">
								{item.slug}.{item.type}
							</p>

							<div className="flex gap-1 justify-end">
								<a
									href={getItemUrl(item)}
									target="_blank"
									download
									onClick={e => e.stopPropagation()}
									rel="noopener noreferrer"
								>
									<Button size="xs" variant="ghost" leftIcon={<MdDownload />} />
								</a>
								<a
									href={getItemUrl(item)}
									target="_blank"
									onClick={e => e.stopPropagation()}
									rel="noopener noreferrer"
								>
									<Button size="xs" variant="ghost" leftIcon={<MdRemoveRedEye />} />
								</a>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Loading State */}
			{loading && items.length === 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="rounded-md border border-gray-200 p-4">
							<Skeleton className="w-[100px] h-[100px] rounded-full mb-2" />
							<Skeleton className="h-5" />
						</div>
					))}
				</div>
			)}

			{/* No Results */}
			{!loading && items.length === 0 && searchTerm && (
				<div className="text-center py-12">
					<p className="text-gray-500">No results found...</p>
				</div>
			)}

			{/* Load More */}
			{hasMore && items.length > 0 && (
				<div ref={loadMoreRef} className="text-center py-4">
					{loading ? <p>Loading more...</p> : <Button onClick={loadMore}>+ Load More</Button>}
				</div>
			)}
		</div>
	);
}
