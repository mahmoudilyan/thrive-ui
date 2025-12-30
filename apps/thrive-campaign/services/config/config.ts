// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const API_BASE_URL =
	isBrowser &&
	location.origin.indexOf('.vbout.com') === -1 &&
	location.origin.indexOf('localhost') === -1
		? location.origin
		: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';

export const API_BASE_PATH = process.env.NEXT_PUBLIC_API_PATH || '/App';
