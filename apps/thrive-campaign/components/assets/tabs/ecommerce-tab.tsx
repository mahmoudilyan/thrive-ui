'use client';

import { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Flex,
	Input,
	SimpleGrid,
	Text,
	Skeleton,
	SkeletonCircle,
	Image,
	createListCollection,
} from '@chakra-ui/react';
import { MdSearch, MdDownload, MdRemoveRedEye } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import { toaster } from '@/components/ui/toaster';
import { MEDIA_SOURCES_CONFIG } from '@/config/media-sources';
import {
	SelectContent,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from '@/components/ui/select';

interface Store {
	id: number;
	name: string;
}

interface Product {
	title: string;
	image: string;
}

interface EcommerceTabProps {
	onSelect?: (url: string) => void;
}

export function EcommerceTab({ onSelect }: EcommerceTabProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [stores, setStores] = useState<Store[]>([]);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [offset, setOffset] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const { ref: loadMoreRef, inView } = useInView();

	const config = MEDIA_SOURCES_CONFIG.ecommerce;

	// Load stores on mount
	useEffect(() => {
		loadStores();
	}, []);

	// Load more when scrolling to bottom
	useEffect(() => {
		if (inView && hasMore && !loading && selectedStore) {
			loadMore();
		}
	}, [inView, hasMore, loading, selectedStore]);

	const loadStores = async () => {
		try {
			const response = await fetch('/App/Ecommerce/GetStores.json', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!response.ok) throw new Error('Failed to fetch stores');

			const data = await response.json();
			if (data.data && data.data.length > 0) {
				setStores(data.data);
				setSelectedStore(data.data[0].id);
				searchProducts(data.data[0].id, '', true);
			}
		} catch (error) {
			console.error('Failed to load stores:', error);
			toaster.create({
				title: 'Failed to load stores',
				description: 'Could not load store list. Please try again.',
				type: 'error',
			});
		}
	};

	const searchProducts = async (
		storeId: number,
		search: string = searchTerm,
		reset: boolean = true
	) => {
		if (!storeId) return;

		if (reset) {
			setProducts([]);
			setOffset(0);
			setHasMore(true);
		}

		setLoading(true);

		try {
			const response = await fetch('/App/Ecommerce/SearchStoreProducts.json', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					domain: storeId,
					search: search,
					offset: reset ? 0 : offset,
					onlyImages: 1,
				}),
			});

			if (!response.ok) throw new Error('Failed to fetch products');

			const data = await response.json();

			if (data.data && data.data.length > 0) {
				if (reset) {
					setProducts(data.data);
				} else {
					setProducts(prev => [...prev, ...data.data]);
				}

				setOffset(prev => prev + data.data.length);
				setHasMore(data.data.length === config.itemsPerPage);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error('Failed to search products:', error);
			toaster.create({
				title: 'Search failed',
				description: 'Failed to search products. Please try again.',
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		if (selectedStore) {
			searchProducts(selectedStore, searchTerm, true);
		}
	};

	const loadMore = () => {
		if (selectedStore) {
			searchProducts(selectedStore, searchTerm, false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const handleStoreChange = (storeId: string) => {
		const id = parseInt(storeId);
		setSelectedStore(id);
		searchProducts(id, searchTerm, true);
	};

	const handleItemClick = (product: Product) => {
		if (onSelect && product.image) {
			onSelect(product.image);
		}
	};

	const storeOptions = stores.map(store => ({
		value: store.id.toString(),
		label: store.name,
	}));

	const storeCollection = createListCollection({ items: storeOptions });

	return (
		<Box p={4}>
			{/* Search Bar */}
			<Flex gap={2} mb={4}>
				<Box flex={1}>
					<Input
						placeholder="Search Product..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyPress={handleKeyPress}
						size="md"
					/>
				</Box>

				<SelectRoot
					collection={storeCollection}
					value={selectedStore ? [selectedStore.toString()] : []}
					onValueChange={e => handleStoreChange(e.value[0])}
					size="md"
				>
					<SelectTrigger>
						<SelectValueText placeholder="- choose Store -" />
					</SelectTrigger>
					<SelectContent>
						{storeOptions.map(item => (
							<SelectItem key={item.value} item={item}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>

				<Button onClick={handleSearch} colorScheme="blue">
					<MdSearch />
				</Button>
			</Flex>

			{/* Error State */}
			{!selectedStore && stores.length === 0 && (
				<Box textAlign="center" py={12}>
					<Text color="red.500" fontWeight="bold">
						Please choose store feed
					</Text>
				</Box>
			)}

			{/* Results Grid */}
			{selectedStore && (
				<SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 6 }} gap={4}>
					{products.map((product, index) => (
						<Box
							key={`${product.image}-${index}`}
							borderRadius="md"
							overflow="hidden"
							border="1px solid"
							borderColor="gray.200"
							_hover={{ borderColor: 'blue.400', shadow: 'md' }}
							cursor="pointer"
							onClick={() => handleItemClick(product)}
							bg="white"
						>
							<Box position="relative" paddingBottom="75%">
								<Image
									src={product.image}
									alt={product.title || 'Product'}
									position="absolute"
									top={0}
									left={0}
									width="100%"
									height="100%"
									objectFit="cover"
								/>
							</Box>

							<Box p={2}>
								<Text fontSize="sm" lineClamp={2} mb={1}>
									{product.title || 'Untitled'}
								</Text>

								<Flex gap={1} justify="flex-end">
									<a
										href={product.image}
										target="_blank"
										download
										onClick={e => e.stopPropagation()}
										rel="noopener noreferrer"
									>
										<Button size="xs" variant="ghost">
											<MdDownload />
										</Button>
									</a>
									<a
										href={product.image}
										target="_blank"
										onClick={e => e.stopPropagation()}
										rel="noopener noreferrer"
									>
										<Button size="xs" variant="ghost">
											<MdRemoveRedEye />
										</Button>
									</a>
								</Flex>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			)}

			{/* Loading State */}
			{loading && products.length === 0 && selectedStore && (
				<SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 6 }} gap={4}>
					{Array.from({ length: 12 }).map((_, i) => (
						<Box key={i} borderRadius="md" border="1px solid" borderColor="gray.200" p={4}>
							<SkeletonCircle size="100px" mb={2} />
							<Skeleton height="20px" />
						</Box>
					))}
				</SimpleGrid>
			)}

			{/* No Results */}
			{!loading && products.length === 0 && searchTerm && selectedStore && (
				<Box textAlign="center" py={12}>
					<Text color="gray.500">No results</Text>
				</Box>
			)}

			{/* Load More */}
			{hasMore && products.length > 0 && (
				<Box ref={loadMoreRef} textAlign="center" py={4}>
					{loading ? <Text>Loading more...</Text> : <Button onClick={loadMore}>+ Load More</Button>}
				</Box>
			)}
		</Box>
	);
}
