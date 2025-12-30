import { useState, useEffect, useCallback, useMemo } from 'react';
import useDebounce from './use-debounce';
import { useLinkMetadata, LinkMetadata } from './use-link-metadata';

export interface LinkData extends LinkMetadata {
	id: string;
	isEdited?: boolean;
	originalData?: LinkMetadata;
}

// Improved URL regex that captures full URLs including paths with special characters
const URL_REGEX =
	/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=\/]*)/gi;

export function useLinkDetection(text: string, debounceMs: number = 500) {
	const [editedData, setEditedData] = useState<Record<string, Partial<LinkData>>>({});
	const debouncedText = useDebounce(text, debounceMs);

	// Extract URLs from text
	const extractedUrls = useMemo(() => {
		if (!debouncedText || debouncedText.length === 0) return [];

		// Reset regex lastIndex to ensure consistent behavior
		URL_REGEX.lastIndex = 0;
		const matches = debouncedText.match(URL_REGEX);
		return matches ? [...new Set(matches)] : [];
	}, [debouncedText]);

	// Generate link IDs
	const generateLinkId = useCallback((url: string): string => {
		return `link-${btoa(url)
			.replace(/[^a-zA-Z0-9]/g, '')
			.substring(0, 8)}`;
	}, []);

	// Create link data with useQuery for each URL
	const detectedLinks = useMemo(() => {
		return extractedUrls.map(url => {
			const id = generateLinkId(url);
			const edited = editedData[id] || {};

			// We'll use a custom hook component below to handle the query
			return {
				id,
				url,
				...edited,
			};
		});
	}, [extractedUrls, generateLinkId, editedData]);

	// Update link data
	const updateLinkData = useCallback((linkId: string, updates: Partial<LinkData>) => {
		setEditedData(prev => ({
			...prev,
			[linkId]: {
				...prev[linkId],
				...updates,
				isEdited:
					updates.title || updates.description || updates.image ? true : prev[linkId]?.isEdited,
			},
		}));
	}, []);

	// Remove link data
	const removeLinkData = useCallback((linkId: string) => {
		setEditedData(prev => {
			const newData = { ...prev };
			delete newData[linkId];
			return newData;
		});
	}, []);

	// Reset link to original
	const resetLinkToOriginal = useCallback((linkId: string) => {
		setEditedData(prev => {
			const newData = { ...prev };
			const original = newData[linkId]?.originalData;
			if (original) {
				newData[linkId] = {
					...original,
					isEdited: false,
					originalData: original,
				};
			}
			return newData;
		});
	}, []);

	// Clean up edited data when URLs are removed
	useEffect(() => {
		const currentIds = new Set(detectedLinks.map(link => link.id));
		setEditedData(prev => {
			const newData = { ...prev };
			let hasChanges = false;

			Object.keys(newData).forEach(id => {
				if (!currentIds.has(id)) {
					delete newData[id];
					hasChanges = true;
				}
			});

			return hasChanges ? newData : prev;
		});
	}, [detectedLinks]);

	return {
		detectedLinks,
		extractedUrls,
		updateLinkData,
		removeLinkData,
		resetLinkToOriginal,
	};
}

// Helper component to use inside LinkCard to fetch metadata
export function useLinkMetadataForCard(url: string) {
	const { data, isLoading, error } = useLinkMetadata(url);

	return {
		metadata: data,
		isLoading,
		error: error?.message,
	};
}
