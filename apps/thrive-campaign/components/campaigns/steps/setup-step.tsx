'use client';

import { useState, useEffect, useCallback } from 'react';

import { AbTestVariable, CampaignType, useCampaignStore } from '@/store/use-campaign-store';
import { z } from 'zod';
//import { RichTextInput } from '@thrive/ui';
import { API_CONFIG } from '@/services/config/api';
import { Theme as EmojiTheme } from 'emoji-picker-react';

import useDebounce from '@/hooks/use-debounce';
import { useApi } from '@/hooks/use-api';

import ABSettings from './ab-options';
import {
	Field,
	HoverCardContent,
	HoverCard,
	HoverCardTrigger,
	TagsInput,
	RadioCard,
	RadioCardItem,
	RadioCardLabel,
	ToggleGroup,
	ToggleGroupItem,
	Box,
	Flex,
	Text,
	Input,
	InputShortcode,
	Badge,
	Label,
} from '@thrive/ui';

// Shortcode types
interface ShortcodeItem {
	text: string;
	icon?: string;
	value: string;
}

interface ShortcodeGroup {
	id: string;
	section: string;
	text: string;
	listid?: string;
	class?: string;
	style?: string;
	menu: ShortcodeItem[];
}

// Define schema with Zod
const requiredString = z.string().min(1, 'This field is required');

const setupSchema = z
	.object({
		name: requiredString,
		subject: z.string().optional(),
		subjectAbt: z.string().optional(),
		fromName: z.string().optional(),
		fromNameAbt: z.string().optional(),
		fromEmail: z.string().optional(),
		fromEmailAbt: z.string().optional(),
		replyToEmail: z
			.string()
			.email('Please enter a valid email address')
			.optional()
			.or(z.literal('')),
		preheader: z.string().optional(),
		bccEmail: z.array(z.string().email('Please enter a valid email address')).optional(),
	})
	.refine(
		() => {
			return true;
		},
		{
			message: 'Email campaigns require subject, from name, and from email',
			path: ['type'], // Path to the field that caused the error
		}
	);

type SetupStepProps = {
	onNext: () => void;
	onPrev?: () => void;
};

type SetupFormData = z.infer<typeof setupSchema>;

export default function SetupStep({ onNext, onPrev }: SetupStepProps) {
	const { campaignData, setCampaignField } = useCampaignStore();
	const [formData, setFormData] = useState<SetupFormData>({
		name: campaignData.name || '',
		subject: campaignData.subject || '',
		subjectAbt: campaignData.subjectAbt || '',
		fromName: campaignData.fromName || '',
		fromNameAbt: campaignData.fromNameAbt || '',
		fromEmail: campaignData.fromEmail || '',
		fromEmailAbt: campaignData.fromEmailAbt || '',
		replyToEmail: campaignData.replyToEmail || '',
		preheader: campaignData.preheader || '',
		bccEmail: campaignData.bccEmail || [],
	} satisfies SetupFormData);

	// Load shortcodes using useApi (lazy loading - only when user clicks shortcode button)
	const { data: shortcodesData, refetch: refetchShortcodes } = useApi<
		ShortcodeGroup[],
		{ types: string; listId: number; listsOnly: number }
	>(API_CONFIG.lists.getShortcodes as any, {
		params: { types: '', listId: 0, listsOnly: 0 },
		enabled: false, // Lazy load - don't fetch on mount
	});

	// Create loadShortcodes callback for lazy loading
	const loadShortcodes = useCallback(async (): Promise<ShortcodeGroup[]> => {
		if (shortcodesData && shortcodesData.length > 0) {
			return shortcodesData;
		}
		const result = await refetchShortcodes();
		return result.data || [];
	}, [shortcodesData, refetchShortcodes]);

	// Add debounced values for each field
	const debouncedSubject = useDebounce(formData.subject);
	const debouncedPreheader = useDebounce(formData.preheader);
	const debouncedSubjectAbt = useDebounce(formData.subjectAbt);
	const debouncedFromName = useDebounce(formData.fromName);
	const debouncedFromNameAbt = useDebounce(formData.fromNameAbt);
	const debouncedFromEmail = useDebounce(formData.fromEmail);
	const debouncedFromEmailAbt = useDebounce(formData.fromEmailAbt);
	const debouncedReplyToEmail = useDebounce(formData.replyToEmail);
	const debouncedBccEmail = useDebounce(formData.bccEmail);
	// Update store with debounced values
	useEffect(() => {
		if (debouncedSubject !== undefined) {
			setCampaignField('subject', debouncedSubject);
		}
	}, [debouncedSubject, setCampaignField]);

	useEffect(() => {
		if (debouncedPreheader !== undefined) {
			setCampaignField('preheader', debouncedPreheader);
		}
	}, [debouncedPreheader, setCampaignField]);

	useEffect(() => {
		if (debouncedFromEmail !== undefined) {
			setCampaignField('fromEmail', debouncedFromEmail);
		}
	}, [debouncedFromEmail, setCampaignField]);

	useEffect(() => {
		if (debouncedReplyToEmail !== undefined) {
			setCampaignField('replyToEmail', debouncedReplyToEmail);
		}
	}, [debouncedReplyToEmail, setCampaignField]);

	useEffect(() => {
		if (debouncedBccEmail !== undefined) {
			setCampaignField('bccEmail', debouncedBccEmail);
		}
	}, [debouncedBccEmail, setCampaignField]);

	useEffect(() => {
		if (debouncedFromName !== undefined) {
			setCampaignField('fromName', debouncedFromName);
		}
	}, [debouncedFromName, setCampaignField]);

	useEffect(() => {
		if (debouncedFromNameAbt !== undefined) {
			setCampaignField('fromNameAbt', debouncedFromNameAbt);
		}
	}, [debouncedFromNameAbt, setCampaignField]);

	useEffect(() => {
		if (debouncedFromEmailAbt !== undefined) {
			setCampaignField('fromEmailAbt', debouncedFromEmailAbt);
		}
	}, [debouncedFromEmailAbt, setCampaignField]);

	useEffect(() => {
		if (debouncedSubjectAbt !== undefined) {
			setCampaignField('subjectAbt', debouncedSubjectAbt);
		}
	}, [debouncedSubjectAbt, setCampaignField]);

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: value,
		}));

		// Clear error for this field if it exists
		if (errors[name]) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const validateForm = (): boolean => {
		try {
			setupSchema.parse(formData);

			// Additional validation for email type
			if (!formData.subject) {
				setErrors(prev => ({ ...prev, subject: 'Subject is required for email campaigns' }));
				return false;
			}
			if (!formData.fromName) {
				setErrors(prev => ({ ...prev, fromName: 'From Name is required for email campaigns' }));
				return false;
			}
			if (!formData.fromEmail) {
				setErrors(prev => ({ ...prev, fromEmail: 'From Email is required for email campaigns' }));
				return false;
			}

			// If we got here, validation passed
			setErrors({});
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				// Convert Zod errors to our format
				const newErrors: Record<string, string> = {};
				err.errors.forEach(error => {
					const path = error.path[0] as string;
					newErrors[path] = error.message;
				});
				setErrors(newErrors);
			} else {
				// Generic error
				setErrors({ form: 'Please check the form for errors' });
			}
			return false;
		}
	};

	const handleSubmit = () => {
		if (validateForm()) {
			// ... update store ...
			onNext(); // Keep onNext usage
		}
	};

	return (
		<Box className="w-[900px] mx-auto min-h-80vh">
			<Box className="text-xl font-bold mb-6">Campaign Setup</Box>

			<Box className="mb-4">
				<RadioCard
					value={campaignData.type || 'regular'}
					orientation="horizontal"
					onValueChange={value => {
						setCampaignField('type', value as CampaignType);
						if (value === 'ab-campaign') {
							setCampaignField('abTestVariable', 'subject');
						}
					}}
				>
					<RadioCardLabel>Type of Campaign</RadioCardLabel>
					<Flex align="stretch" gap={'4'}>
						<RadioCardItem
							value="regular"
							icon={
								<img src="/icons/regular-email.svg" alt="Regular Campaign" className="w-8 h-8" />
							}
							label={'Regular Campaign'}
							indicator={false}
							description="Send the same email to your entire list."
						/>
						<RadioCardItem
							value="ab-campaign"
							icon={
								<img src="/icons/email-investigate.svg" alt="A/B Campaign" className="w-8 h-8" />
							}
							label={'A/B Campaign'}
							description="Test two email variations, then send the winner to the rest."
							addon={
								<>
									{campaignData.type === 'ab-campaign' && (
										<>
											<Text
												className="-mt-1.5 mb-1 body-xs font-medium text-ink-dark text-[14px]"
												variant="body-xs"
												as="h6"
											>
												Choose a test variable
											</Text>
											<ToggleGroup
												type="single"
												defaultValue={campaignData.abTestVariable || 'subject'}
												onValueChange={value => {
													setCampaignField('abTestVariable', value as AbTestVariable);
												}}
												size="sm"
											>
												<ToggleGroupItem
													value="subject"
													data-active={campaignData.abTestVariable === 'subject'}
												>
													Subject Line
												</ToggleGroupItem>
												<ToggleGroupItem
													value="content"
													data-active={campaignData.abTestVariable === 'content'}
												>
													Content
												</ToggleGroupItem>
												<ToggleGroupItem
													value="fromName"
													data-active={campaignData.abTestVariable === 'fromName'}
												>
													From Name
												</ToggleGroupItem>
												<ToggleGroupItem
													value="fromEmail"
													data-active={campaignData.abTestVariable === 'fromEmail'}
												>
													From Email
												</ToggleGroupItem>
											</ToggleGroup>
										</>
									)}
								</>
							}
							indicator={false}
						/>
					</Flex>
				</RadioCard>
			</Box>

			<>
				<Box className="mb-4">
					{campaignData.type === 'ab-campaign' && campaignData.abTestVariable === 'subject' ? (
						<Flex gap={'4'} className="w-full">
							<Box className="flex-1">
								<Label htmlFor="subjectA" className="flex items-center mb-1">
									Subject Line
									<Badge variant="info" size="sm" className="ml-1">
										Version B
									</Badge>
								</Label>
								<InputShortcode
									value={formData.subject}
									onChange={(value: string) => setFormData(prev => ({ ...prev, subject: value }))}
									placeholder="Enter subject line"
									onLoadShortcodes={loadShortcodes}
									emojiPickerTheme={EmojiTheme.AUTO}
									enableEmoji
									id="subjectA"
								/>
							</Box>
							<Box className="flex-1">
								<Label htmlFor="subjectAbt" className="flex items-center mb-1">
									Subject Line B
									<Badge variant="success" size="sm" className="ml-1">
										Version B
									</Badge>
								</Label>
								<InputShortcode
									value={formData.subjectAbt}
									onChange={(value: string) =>
										setFormData(prev => ({ ...prev, subjectAbt: value }))
									}
									placeholder="Enter subject line"
									onLoadShortcodes={loadShortcodes}
									emojiPickerTheme={EmojiTheme.AUTO}
									enableEmoji
									id="subjectAbt"
								/>
							</Box>
						</Flex>
					) : (
						<>
							<Label htmlFor="subject">Subject Line</Label>
							<InputShortcode
								value={formData.subject}
								onChange={(value: string) => setFormData(prev => ({ ...prev, subject: value }))}
								placeholder="Enter subject line"
								onLoadShortcodes={loadShortcodes}
								emojiPickerTheme={EmojiTheme.AUTO}
								enableEmoji
								id="subject"
							/>
						</>
					)}
				</Box>
				<Box className="mb-4">
					<Label htmlFor="preheader">Preheader</Label>
					<InputShortcode
						value={formData.preheader}
						onChange={(value: string) => setFormData(prev => ({ ...prev, preheader: value }))}
						placeholder="Enter preheader"
						onLoadShortcodes={loadShortcodes}
						emojiPickerTheme={EmojiTheme.AUTO}
						id="preheader"
					/>
				</Box>
				<Box className="mb-4">
					{campaignData.type === 'ab-campaign' && campaignData.abTestVariable === 'fromName' ? (
						<Flex gap={'4'} className="w-full">
							<Box className="flex-1">
								<Label htmlFor="subjectAbt" className="flex items-center mb-1">
									From Name A
									<Badge variant="info" size="sm" className="ml-1">
										Version A
									</Badge>
								</Label>
								<Input
									name="fromNameA"
									value={formData.fromName}
									onChange={handleChange}
									placeholder="Enter sender name"
									id="fromNameA"
								/>
							</Box>
							<Box className="flex-1">
								<Label htmlFor="subjectAbt" className="flex items-center mb-1">
									From Name B
									<Badge variant="success" size="sm" className="ml-1">
										Version B
									</Badge>
								</Label>
								<Input
									name="fromNameAbt"
									value={formData.fromNameAbt}
									onChange={handleChange}
									placeholder="Enter sender name"
									id="fromNameAbt"
								/>
							</Box>
						</Flex>
					) : (
						<>
							<Label htmlFor="subjectAbt" className="flex items-center mb-1">
								From Name
							</Label>
							<Input
								name="fromName"
								value={formData.fromName}
								onChange={handleChange}
								placeholder="Enter sender name"
								id="fromName"
							/>
						</>
					)}
				</Box>
				<Box className="mb-4">
					{campaignData.type === 'ab-campaign' && campaignData.abTestVariable === 'fromEmail' ? (
						<Flex gap={'4'} className="w-full">
							<Box className="flex-1">
								<Label htmlFor="fromEmail" className="flex items-center mb-1">
									From Email
									<Badge variant="info" size="sm" className="ml-1">
										Version A
									</Badge>
								</Label>
								<Input
									name="fromEmail"
									value={formData.fromEmail}
									onChange={handleChange}
									placeholder="Enter sender email"
									id="fromEmail"
								/>
							</Box>
							<Box className="flex-1">
								<Label htmlFor="fromEmailAbt" className="flex items-center mb-1">
									From Email B
									<Badge variant="success" size="sm" className="ml-1">
										Version B
									</Badge>
								</Label>
								<Input
									name="fromEmailAbt"
									value={formData.fromEmailAbt}
									onChange={handleChange}
									placeholder="Enter sender email"
									id="fromEmailAbt"
								/>
							</Box>
						</Flex>
					) : (
						<>
							<Label htmlFor="fromEmail">From Email</Label>
							<Input
								name="fromEmail"
								value={formData.fromEmail}
								onChange={handleChange}
								placeholder="Enter sender email"
								id="fromEmail"
							/>
						</>
					)}
				</Box>
				<Box className="mb-4">
					<Label htmlFor="replyToEmail">Reply-To Email</Label>
					<Input
						value={formData.replyToEmail}
						onChange={handleChange}
						placeholder="Enter reply-to email (optional)"
						name="replyToEmail"
					/>
				</Box>
				<Box className="mb-4">
					<Label htmlFor="bccEmail" className="flex items-center mb-1">
						BCC Email
					</Label>
					<Input
						value={formData.bccEmail}
						onChange={handleChange}
						placeholder="Enter BCC email (optional)"
						name="bccEmail"
					/>
				</Box>
				{campaignData.type === 'ab-campaign' && (
					<Box className="mb-4">
						<ABSettings />
					</Box>
				)}
			</>
		</Box>
	);
}
