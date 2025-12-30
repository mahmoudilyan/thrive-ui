'use client';

import { useState, useEffect } from 'react';
import { MdSearch, MdImage, MdVideoFile, MdDownload, MdRemoveRedEye } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import { toaster } from '@thrive/ui';
import { MEDIA_SOURCES_CONFIG } from '@/config/media-sources';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@thrive/ui';
import { Button, Input, Skeleton } from '@thrive/ui';
import { createListCollection } from '@chakra-ui/react';

interface PixabayItem {
	id: number;
	webformatURL: string;
	previewURL: string;
	tags: string;
	type: string;
	videos?: {
		small: {
			url: string;
		};
	};
}

interface PixabayResponse {
	hits: PixabayItem[];
	totalHits: number;
}

interface PixabayTabProps {
	onSelect?: (url: string) => void;
}

export function PixabayTab({ onSelect }: PixabayTabProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
	const [items, setItems] = useState<PixabayItem[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [totalHits, setTotalHits] = useState(0);
	const { ref: loadMoreRef, inView } = useInView();

	const config = MEDIA_SOURCES_CONFIG.pixabay;

	// Load saved search term from localStorage
	useEffect(() => {
		const savedSearch = localStorage.getItem('pixabayKeyword') || config.defaultSearch;
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
			setPage(1);
			setHasMore(true);
		}

		setLoading(true);

		try {
			const apiPath = mediaType === 'video' ? 'videos/' : '';
			const response = await fetch(
				`${config.apiUrl}${apiPath}?key=${config.apiKey}&q=${encodeURIComponent(search)}&page=${reset ? 1 : page}&per_page=${config.itemsPerPage}`
			);

			if (!response.ok) throw new Error('Failed to fetch');

			const data: PixabayResponse = await response.json();

			if (reset) {
				setItems(data.hits);
			} else {
				setItems(prev => [...prev, ...data.hits]);
			}

			setTotalHits(data.totalHits);
			setHasMore(
				data.hits.length === config.itemsPerPage && items.length + data.hits.length < data.totalHits
			);

			if (!reset) {
				setPage(prev => prev + 1);
			}

			// Save search term
			localStorage.setItem('pixabayKeyword', search);
		} catch (error) {
			console.error('Failed to search Pixabay:', error);
			toaster.create({
				title: 'Search failed',
				description: 'Failed to search Pixabay. Please try again.',
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

	const handleItemClick = (item: PixabayItem) => {
		const url = mediaType === 'video' && item.videos ? item.videos.small.url : item.webformatURL;

		if (onSelect) {
			onSelect(url);
		}
	};

	const getItemUrl = (item: PixabayItem) => {
		return mediaType === 'video' && item.videos ? item.videos.small.url : item.webformatURL;
	};

	const getItemExtension = (item: PixabayItem) => {
		if (mediaType === 'video') return 'mp4';
		const url = item.previewURL || item.webformatURL;
		return url.split('.').pop()?.toLowerCase() || 'jpg';
	};

	const mediaTypeItems = [
		{ value: 'image', label: 'Image' },
		{ value: 'video', label: 'Video' },
	];

	const mediaTypeCollection = createListCollection({
		items: mediaTypeItems,
	});

	return (
		<div className="p-4">
			{/* Search Bar */}
			<div className="flex gap-2 mb-4">
				<div className="flex-1">
					<Input
						placeholder="Search Image..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyPress={handleKeyPress}
						size="md"
						className="bg-white"
						style={{
							backgroundImage: 'url(/filemanagerS3/extensions/tabs/PoweredByPixabay.png)',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'right center',
							paddingRight: '120px',
						}}
					/>
				</div>

				<SelectRoot
					collection={mediaTypeCollection}
					value={[mediaType]}
					onValueChange={e => setMediaType(e.value[0] as 'image' | 'video')}
					size="md"
				>
					<SelectTrigger>
						<SelectValueText placeholder="Select type" />
					</SelectTrigger>
					<SelectContent>
						{mediaTypeItems.map(item => (
							<SelectItem key={item.value} item={item}>
								<div className="flex items-center gap-2">
									{item.value === 'image' ? <MdImage /> : <MdVideoFile />}
									<span>{item.label}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>

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
							{mediaType === 'video' ? (
								<div className="absolute inset-0 bg-black flex items-center justify-center">
									<MdVideoFile size={48} color="white" />
									<span className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-sm">
										MP4
									</span>
								</div>
							) : (
								<img
									src={item.previewURL}
									alt={item.tags}
									className="absolute top-0 left-0 w-full h-full object-cover"
								/>
							)}
						</div>

						<div className="p-2">
							<p className="text-sm line-clamp-1 mb-1">
								{item.tags}.{getItemExtension(item)}
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

			{/* Results Count */}
			{items.length > 0 && (
				<p className="text-center text-sm text-gray-500 mt-4">
					Showing {items.length} of {totalHits} results
				</p>
			)}
		</div>
	);
}
