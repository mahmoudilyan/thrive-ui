'use client';

import { useState, useEffect, useMemo } from 'react';

import { useCampaignStore, CampaignRecipient } from '@/store/use-campaign-store';
import { z } from 'zod';

import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';

import { MdClose } from 'react-icons/md';
import {
	Field,
	SelectCheckboxSearchable,
	SelectMultiCategory,
	Switch,
	Box,
	Spinner,
	Text,
	Flex,
	Button,
	Icon,
	Badge,
	Label,
} from '@thrive/ui';

// Define schema with Zod
const recipientsSchema = z.object({
	recipients: z
		.array(
			z.object({
				id: z.string(),
				type: z.enum(['list', 'audience', 'folder']),
				name: z.string(),
				contactsCount: z.number().optional(),
			})
		)
		.min(1, 'Please select at least one recipient'),
});

type RecipientsStepProps = {
	onNext: () => void;
	onPrev: () => void;
};

// Type for recipient item display
type RecipientItem = {
	id: string;
	type: string;
	name: string;
	contacts: number;
	isExcluded: boolean;
	fullValue?: string;
};

export default function RecipientsStep({ onNext, onPrev }: RecipientsStepProps) {
	const { campaignData, setCampaignField } = useCampaignStore();

	// Initialize state from campaign data
	const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
		campaignData.recipients?.map(r => r.id) || []
	);
	const [excludedRecipients, setExcludedRecipients] = useState<string[]>(
		campaignData.excludeRecipients || []
	);
	const [hasExcludeRecipients, setHasExcludeRecipients] = useState(
		Array.isArray(campaignData.excludeRecipients) && campaignData.excludeRecipients.length > 0
	);

	const { data: allLists, isLoading: isLoadingLists } = useApi(API_CONFIG.lists.getAllLists, {
		params: {
			source: 'campaign',
			__loader: 'campaign',
			__get: 'lists',
			_: Date.now(),
		},
	});
	const { data: allAudiences, isLoading: isLoadingAudiences } = useApi(
		API_CONFIG.audiences.getAllAudiences,
		{
			params: {
				source: 'campaign',
				__loader: 'campaign',
				__get: 'audiences',
				_: Date.now(),
			},
		}
	);
	const { data: allFolders, isLoading: isLoadingFolders } = useApi(
		API_CONFIG.folders.getFoldersList,
		{
			params: {
				source: 'campaign',
				__loader: 'campaign',
				__get: 'folders',
				_: Date.now(),
			},
		}
	);
	const [error, setError] = useState('');

	// Get all categories for MultiCategorySelect
	const allCategories = useMemo(
		() => [
			{
				name: 'List',
				items:
					allLists?.data?.map(list => ({
						value: list.id,
						label: list.name,
						description: `${list.contacts} contacts`,
					})) || [],
			},
			{
				name: 'Audience',
				items:
					allAudiences?.data?.map(audience => ({
						value: audience.id,
						label: audience.name,
						description: `${audience.contacts} contacts`,
					})) || [],
			},
			{
				name: 'Folder',
				items:
					allFolders?.data?.map(folder => ({
						value: folder.id,
						label: folder.name,
						description: folder.contacts ? `${folder.contacts} contacts` : undefined,
					})) || [],
			},
		],
		[allLists, allAudiences, allFolders]
	);

	// Get combined list of all selected recipients for the table display
	const allSelectedItems = useMemo(() => {
		const items: RecipientItem[] = [];

		// Add included recipients
		selectedRecipients.forEach(value => {
			// Parse the category format (category:id)
			const [categoryName, itemId] = value.split(':');

			if (!categoryName || !itemId) return;

			let item;
			let contacts = 0;

			// Find the item based on its category
			if (categoryName === 'List') {
				item = allLists?.data?.find(l => l.id === itemId);
				contacts = item?.contacts || 0;
			} else if (categoryName === 'Audience') {
				item = allAudiences?.data?.find(a => a.id === itemId);
				contacts = item?.contacts || 0;
			} else if (categoryName === 'Folder') {
				item = allFolders?.data?.find(f => f.id === itemId);
				contacts = item?.contacts || 0;
			}

			if (item) {
				items.push({
					id: itemId,
					fullValue: value, // Store the full value for removal
					type: categoryName,
					name: item.name,
					contacts: contacts,
					isExcluded: false,
				});
			}
		});

		// Add excluded recipients
		if (hasExcludeRecipients) {
			excludedRecipients.forEach(id => {
				const list = allLists?.data?.find(l => l.id === id);
				if (list) {
					items.push({
						id,
						fullValue: id, // Store the full value for removal
						type: 'List',
						name: list.name,
						contacts: list.contacts || 0,
						isExcluded: true,
					});
				}
			});
		}

		return items;
	}, [
		selectedRecipients,
		excludedRecipients,
		hasExcludeRecipients,
		allLists,
		allAudiences,
		allFolders,
	]);

	// Calculate totals
	const totals = useMemo(() => {
		const includedTotal = allSelectedItems
			.filter(item => !item.isExcluded)
			.reduce((sum, item) => sum + item.contacts, 0);

		const excludedTotal = allSelectedItems
			.filter(item => item.isExcluded)
			.reduce((sum, item) => sum + item.contacts, 0);

		return {
			includedTotal,
			excludedTotal,
			includedCount: allSelectedItems.filter(item => !item.isExcluded).length,
			excludedCount: allSelectedItems.filter(item => item.isExcluded).length,
		};
	}, [allSelectedItems]);

	// Handle removing an item
	const handleRemoveItem = (item: RecipientItem) => {
		if (item.isExcluded) {
			setExcludedRecipients(prev => prev.filter(id => id !== item.id));
		} else {
			setSelectedRecipients(prev => prev.filter(value => value !== item.fullValue));
		}

		// Clear error if it exists
		if (error) {
			setError('');
		}
	};

	// Handle excluded recipients toggle
	const handleExcludeRecipientsToggle = (value: boolean) => {
		setHasExcludeRecipients(value);

		if (!value) {
			// Clear excluded recipients when turning off
			setExcludedRecipients([]);
		}
	};

	// Initialize selected recipients from store
	useEffect(() => {
		// Process selected recipients for the campaign store
		const recipientsArray = selectedRecipients
			.map(value => {
				// Parse the category format (category:id)
				const [categoryName, itemId] = value.split(':');
				if (!categoryName || !itemId) return null;

				// Find the item based on its category
				let type: 'list' | 'audience' | 'folder' = 'list';
				let name = '';
				let contactsCount = 0;

				if (categoryName === 'List') {
					const item = allLists?.data?.find(l => l.id === itemId);
					if (!item) return null;
					type = 'list';
					name = item.name;
					contactsCount = item.contacts || 0;
				} else if (categoryName === 'Audience') {
					const item = allAudiences?.data?.find(a => a.id === itemId);
					if (!item) return null;
					type = 'audience';
					name = item.name;
					contactsCount = item.contacts || 0;
				} else if (categoryName === 'Folder') {
					const item = allFolders?.data?.find(f => f.id === itemId);
					if (!item) return null;
					type = 'folder';
					name = item.name;
					contactsCount = item.contacts || 0;
				} else {
					return null;
				}

				return {
					id: itemId,
					type,
					name,
					contactsCount,
				} as CampaignRecipient;
			})
			.filter(Boolean) as CampaignRecipient[];

		setCampaignField('recipients', recipientsArray);
		setCampaignField('excludeRecipients', excludedRecipients);
	}, [
		selectedRecipients,
		excludedRecipients,
		allLists,
		allAudiences,
		allFolders,
		setCampaignField,
	]);

	const validateStep = (): boolean => {
		try {
			recipientsSchema.parse({ recipients: campaignData.recipients });
			setError('');
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				setError(err.errors[0].message);
			} else {
				setError('Please select at least one recipient');
			}
			return false;
		}
	};

	const handleContinue = () => {
		if (validateStep()) {
			onNext();
		}
	};

	return (
		<Box className="w-96 mx-auto min-h-80vh mb-4">
			<Text className="text-xl font-bold mb-4">Select Recipients</Text>

			{/* Recipients Selection */}
			<Box className="mb-4">
				<SelectMultiCategory
					categories={allCategories}
					value={selectedRecipients}
					onChange={setSelectedRecipients}
					placeholder="Select lists, audiences, or folders..."
					isLoading={isLoadingLists || isLoadingAudiences || isLoadingFolders}
				/>
			</Box>

			{error && <Box className="bg-red-50 p-3 rounded-md mb-4 text-red-500">{error}</Box>}

			<Box className="flex items-center gap-2 mb-2 mt-4">
				<Switch
					checked={hasExcludeRecipients}
					onCheckedChange={(value: boolean) => handleExcludeRecipientsToggle(value)}
					id="exclude-recipients"
				/>

				<Label htmlFor="exclude-recipients">Exclude Recipients</Label>
			</Box>

			{hasExcludeRecipients && (
				<Box className="mb-4 w-full">
					<SelectCheckboxSearchable
						items={
							allLists?.data?.map(list => ({
								value: list.id,
								label: list.name,
								description: `${list.contacts} contacts`,
							})) || []
						}
						value={excludedRecipients}
						onChange={setExcludedRecipients}
						placeholder="Select lists to exclude..."
					/>
				</Box>
			)}

			{/* Recipients Table */}
			{allSelectedItems.length > 0 && (
				<Box className="mt-6">
					<Flex className="justify-between items-center mb-1">
						<Text className="text-md font-bold">Recipients Summary</Text>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								setSelectedRecipients([]);
								setExcludedRecipients([]);
							}}
							className="text-primary"
						>
							Clear All
						</Button>
					</Flex>
					{allSelectedItems.map(item => (
						<Box key={item.id}>
							<Text>{item.name}</Text>
							<Text>{item.contacts}</Text>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}
