export const MEDIA_SOURCES_CONFIG = {
	pixabay: {
		apiKey: process.env.NEXT_PUBLIC_PIXABAY_API_KEY || '1967895-ae8736264a2fa6d6f90381f7b',
		apiUrl: 'https://pixabay.com/api/',
		defaultSearch: 'funny',
		itemsPerPage: 24,
	},
	giphy: {
		apiKey: process.env.NEXT_PUBLIC_GIPHY_API_KEY || '13029d8274d4435cb16615a9ca44a930',
		apiUrl: 'https://api.giphy.com/v1/gifs/search',
		defaultSearch: 'funny',
		itemsPerPage: 10,
	},
	icons: {
		apiUrl: '/api/icons',
		itemsPerPage: 72, // 6 cols * 12 rows
		sizes: ['18dp', '24dp', '36dp', '48dp'],
		colors: ['black', 'white'],
	},
	ecommerce: {
		apiUrl: '/api/ecommerce',
		itemsPerPage: 20,
	},
} as const;
