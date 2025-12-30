'use client';

import { useState } from 'react';
import React from 'react';
import {
	Box,
	Button,
	Flex,
	Text,
	IconButton,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	cn,
} from '@thrive/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@thrive/ui';

import { useCampaignStore } from '@/store/use-campaign-store';
import { z } from 'zod';
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import SkeletonTemplateCards from './skeleton-template-cards';
import { MdMoreHoriz } from 'react-icons/md';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger, Tooltip } from '@thrive/ui';

// Define schema with Zod
const designSchema = z.object({
	templateId: z.string().min(1, 'Please select a template'),
	templateType: z.string().min(1, 'Template type is required'),
	templateBuilder: z.string().min(1, 'Builder type is required'),
	templateBuilderVersion: z.string(),
});

// Types for template data
type TemplateItem = {
	type: string;
	id: string;
	label: string;
	thumb: string;
	editor?: number;
	new_builder?: boolean;
};

type InspirationCategory = {
	[key: string]: TemplateItem[];
};

type TemplateData = TemplateItem[] | InspirationCategory;

type CampaignType = 'regular' | 'a' | 'b';

type DesignStepProps = {
	onNext: () => void;
	onPrev: () => void;
};

export default function DesignStep({ onNext, onPrev }: DesignStepProps) {
	const { campaignData, setCampaignField } = useCampaignStore();
	const [error, setError] = useState('');
	const [selectedTab, setSelectedTab] = useState(0);
	const [selectedBuilderTab, setSelectedBuilderTab] = useState('themes');
	const [showChooseTemplate, setShowChooseTemplate] = useState(
		!campaignData.selectedTemplate && !campaignData.selectedTemplateAbt
	);

	const {
		data: loadedTemplates,
		isLoading,
		isFetching,
	} = useApi<TemplateData, { type: string }>(API_CONFIG.email.templates, {
		params: {
			type: selectedBuilderTab,
		},
	});

	const handleTemplateSelect = (template: TemplateItem | undefined, abt?: boolean) => {
		if (abt) {
			setCampaignField('selectedTemplateAbt', template);
			if (!template) {
				setSelectedTab(1);
				setShowChooseTemplate(true);
			} else {
				setShowChooseTemplate(false);
			}
			return;
		}

		setCampaignField('selectedTemplate', template);

		// Update the design templateId when a template is selected
		if (template) {
			setCampaignField('design', {
				...campaignData.design,
				templateId: template.id,
			});
		}

		// Handle showing/hiding template chooser
		if (!template) {
			// If clearing selection, show template chooser again
			setShowChooseTemplate(true);
			if (campaignData.type === 'ab-campaign' && campaignData.abTestVariable === 'content') {
				setSelectedTab(0);
			}
		} else {
			// If selecting a template, hide template chooser and show preview
			setShowChooseTemplate(false);
		}
	};

	const validateStep = (): boolean => {
		try {
			const design = campaignData.design || { templateId: '' };

			designSchema.parse({
				templateId: design.templateId,
				templateType: campaignData.selectedTemplate?.type || '',
				templateBuilder: campaignData.selectedTemplate?.editor !== undefined ? 'editor' : 'builder',
				templateBuilderVersion: campaignData.selectedTemplate?.new_builder ? 'new' : 'old',
			});
			setError('');
			return true;
		} catch (err) {
			if (err instanceof z.ZodError) {
				setError(err.errors[0].message);
			} else {
				setError('Please select a template');
			}
			return false;
		}
	};

	const handleContinue = () => {
		if (validateStep()) {
			onNext();
		}
	};

	const renderTemplateCard = (template: TemplateItem, abt?: boolean) => {
		return (
			<Card
				key={template.id}
				className={`border-1 border-border-secondary rounded-md cursor-pointer group w-56 ${campaignData.selectedTemplate?.id === template.id ? 'border-primary' : 'border-border'} overflow-hidden`}
				onClick={() => handleTemplateSelect(template, abt)}
			>
				<Box className="h-60 overflow-hidden relative">
					<img
						src={template.thumb}
						alt={template.label}
						width="100%"
						className="w-full min-h-[480px] h-auto object-cover object-top transition-transform duration-[500ms] ease-out group-hover:duration-[3s] group-hover:translate-y-[calc(-100%+15rem)]"
					/>
				</Box>
				<CardContent className="p-0">
					<CardTitle className="text-sm p-2 font-medium cursor-pointer relative">
						{template.label}
						<Box className="absolute top-0 z-10 flex justify-end items-center opacity-0 transition-all duration-2s ease-in-out left-0 w-full h-full p-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
							<Button
								size="xs"
								onClick={() => handleTemplateSelect(template, abt)}
								variant={'secondary'}
							>
								Choose
							</Button>
						</Box>
					</CardTitle>
				</CardContent>
			</Card>
		);
	};

	// Unified renderer for both array and categorized templates
	const renderTemplates = (data: TemplateData | null | undefined, abt?: boolean) => {
		if (!data) return null;

		// If it's an array of templates (themes, templates, campaigns, automations)
		if (Array.isArray(data)) {
			if (data.length === 0) {
				return (
					<Box className="text-center py-8">
						<Text variant="body-md" color="fg.muted">
							No templates available
						</Text>
					</Box>
				);
			}
			return (
				<Flex wrap="wrap" gap="6">
					{data.map(template => renderTemplateCard(template, abt))}
				</Flex>
			);
		}

		// If it's a categorized object (inspirations)
		return (
			<Box>
				{Object.entries(data).map(([category, templates]) => (
					<Box key={category} className="mb-6">
						<Text variant="caps-sm" className="mb-2 uppercase" as="h5" fontWeight="semibold">
							{category}
						</Text>
						<Flex gap="6" wrap="wrap">
							{Array.isArray(templates) &&
								templates.map(template => renderTemplateCard(template, abt))}
						</Flex>
					</Box>
				))}
			</Box>
		);
	};

	const renderNewDesignOptions = (designPrefix: string) => (
		<Box className="grid grid-cols-3 gap-6">
			<Box className="overflow-hidden transition-all duration-2s ease-in-out border-1 border-gray-200 rounded-md">
				<Flex className="flex items-center justify-center bg-bg-panel p-8">
					<img src="/icons/code-builder.svg" alt="New Builder" className="w-16 h-16" />
				</Flex>
				<Box className="p-3">
					<Text fontWeight="medium" className="mb-3">
						New Builder
					</Text>
					<Button
						variant="primary"
						size="sm"
						onClick={() =>
							handleTemplateSelect({
								type: 'new-design',
								id: `${designPrefix}-new`,
								label: 'New Builder',
								thumb: '/icons/code-builder.svg',
								new_builder: true,
							})
						}
					>
						Choose
					</Button>
				</Box>
			</Box>
			<Box className="border-1 border-border-muted rounded-md overflow-hidden transition-all duration-2s ease-in-out _hover:translate-y-[-2px] _hover:shadow-md">
				<Flex className="items-center justify-center bg-bg-panel p-8">
					<img src="/icons/code-builder.svg" alt="Classic Builder" className="w-16 h-16" />
				</Flex>
				<Box className="p-3">
					<Text fontWeight="medium" className="mb-3">
						Classic Builder Designer
					</Text>
					<Button
						variant="primary"
						size="sm"
						onClick={() =>
							handleTemplateSelect({
								type: 'new-design',
								id: `${designPrefix}-classic`,
								label: 'Classic Builder',
								thumb: '/icons/code-builder.svg',
								new_builder: false,
							})
						}
					>
						Choose
					</Button>
				</Box>
			</Box>

			<Box className="border-1 border-border-muted rounded-md overflow-hidden transition-all duration-2s ease-in-out _hover:translate-y-[-2px] _hover:shadow-md">
				<Flex className="items-center justify-center bg-bg-panel p-8">
					<img src="/icons/text-builder.svg" alt="Basic Editor" className="w-16 h-16" />
				</Flex>
				<Box className="p-3">
					<Text fontWeight="medium" className="mb-3">
						Basic Editor
					</Text>
					<Button
						variant="primary"
						size="sm"
						onClick={() =>
							handleTemplateSelect({
								type: 'new-design',
								id: `${designPrefix}-basic`,
								label: 'Basic Editor',
								thumb: '/icons/text-builder.svg',
								editor: 2,
							})
						}
					>
						Choose
					</Button>
				</Box>
			</Box>
		</Box>
	);

	const campaignTypeContent = (typePrefix: CampaignType, abt?: boolean) => (
		<Box className="w-full">
			<Flex direction="col">
				<Text as="h2" variant="heading-xl" fontWeight="bold" className="ml-60 pl-7 mb-6">
					Choose a Template
					{typePrefix === 'a' ? 'for Variant A' : typePrefix === 'b' ? 'for Variant B' : ''}
				</Text>
				<Tabs
					defaultValue={selectedBuilderTab}
					onValueChange={details => setSelectedBuilderTab(details)}
					orientation="vertical"
					variant={'pill'}
					className="flex items-start"
				>
					<Box className="w-60 flex-shrink-0 mr-8 pl-8 self-start bg-panel sticky top-32 z-10">
						<TabsList className="bg-panel">
							<TabsTrigger value="themes">Classic Builder</TabsTrigger>
							<TabsTrigger value="inspirations">Inspirations</TabsTrigger>
							<TabsTrigger value="templates">My Templates</TabsTrigger>
							<TabsTrigger value="campaigns">Campaigns</TabsTrigger>
							<TabsTrigger value="automations">Automated Messages</TabsTrigger>
							<TabsTrigger value="new-design">New Design</TabsTrigger>
						</TabsList>
					</Box>

					<TabsContent value="themes" className="flex-grow w-full">
						{isLoading ? (
							<SkeletonTemplateCards cardsNumber={6} />
						) : (
							renderTemplates(loadedTemplates, abt)
						)}
					</TabsContent>

					<TabsContent value="inspirations" className="flex-grow w-full">
						{isLoading ? (
							<SkeletonTemplateCards cardsNumber={6} />
						) : (
							renderTemplates(loadedTemplates, abt)
						)}
					</TabsContent>

					<TabsContent value="templates" className="flex-grow w-full">
						{isLoading ? (
							<SkeletonTemplateCards cardsNumber={6} />
						) : (
							renderTemplates(loadedTemplates, abt)
						)}
					</TabsContent>

					<TabsContent value="campaigns" className="flex-grow w-full">
						{isLoading ? (
							<SkeletonTemplateCards cardsNumber={6} />
						) : (
							renderTemplates(loadedTemplates, abt)
						)}
					</TabsContent>

					<TabsContent value="automations" className="flex-grow w-full">
						{isLoading ? (
							<SkeletonTemplateCards cardsNumber={6} />
						) : (
							renderTemplates(loadedTemplates, abt)
						)}
					</TabsContent>

					<TabsContent value="new-design" className="flex-grow w-full">
						{renderNewDesignOptions(typePrefix)}
					</TabsContent>
				</Tabs>
			</Flex>
		</Box>
	);

	const renderMainContent = () => {
		if (campaignData.selectedTemplate && !showChooseTemplate) {
			return (
				<>
					<Flex className="mb-6 justify-center items-center self-justify-center flex-col w-full">
						<img src="/icons/email.svg" alt="Email" className="w-16 h-16 mr-4 mt-40px" />
						<Flex align="center" justify="center" className="w-full mt-4 mb-6">
							<Text
								variant="heading-lg"
								fontWeight="semibold"
								className="mb-0 mr-4 text-center"
								as="h2"
							>
								Design Preview
							</Text>
							<Box className="flex justify-center items-center flex-wrap left-0 p-0 gap-2">
								<Button
									size="sm"
									onClick={() => {
										/* TODO: Implement navigation to editor */
									}}
									variant={'secondary'}
								>
									Edit Design
								</Button>
								<Tooltip content="More Options">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<IconButton size="sm" variant={'secondary'} icon={<MdMoreHoriz />} />
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>Edit Text Design</DropdownMenuItem>
											<DropdownMenuItem>Inbox Preview</DropdownMenuItem>
											<DropdownMenuItem
												variant="destructive"
												onClick={() => handleTemplateSelect(undefined)}
											>
												Select Another Template
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</Tooltip>
							</Box>
						</Flex>
						<Card
							key={campaignData.selectedTemplate.id}
							className="w-64 cursor-pointer group overflow-hidden relative border-0 border-radius-0 bg-transparent"
						>
							<CardContent className="p-0 bg-transparent">
								<Box className="h-80 overflow-hidden relative w-full border-radius-md">
									<img
										src={campaignData.selectedTemplate.thumb}
										alt={campaignData.selectedTemplate.label}
										width="100%"
										className="w-full min-h-[480px] h-auto object-cover object-top transition-transform duration-[500ms] ease-out group-hover:duration-[3s] group-hover:translate-y-[calc(-100%+15rem)]"
									/>
								</Box>
							</CardContent>
						</Card>
					</Flex>
				</>
			);
		} else {
			return campaignTypeContent('regular');
		}
	};

	const renderAbTestContent = () => {
		if (
			(campaignData.selectedTemplate || campaignData.selectedTemplateAbt) &&
			!showChooseTemplate
		) {
			return (
				<Flex direction="row" gap="4">
					<Box>
						<Box className="flex justify-center">
							<img src="/icons/email-a.svg" alt="Email A" className="w-16 h-16 mr-4 mt-48px" />
							{campaignData.selectedTemplate ? (
								<Card
									key={campaignData.selectedTemplate.id}
									className="cursor-pointer w-200px overflow-hidden relative group border-0 border-radius-0 bg-transparent"
								>
									<Text variant="body-md" className="mb-4 text-center">
										Design Preview for A
									</Text>
									<Box className="h-280px overflow-hidden relative w-200px border-1 border-border-muted border-radius-md">
										<img
											src={campaignData.selectedTemplate.thumb}
											alt={campaignData.selectedTemplate.label}
											width="100%"
											className="object-cover transition-transform duration-3s ease absolute top-0 left-0 _hover:translate-y-[calc(-100%+280px)]"
										/>
									</Box>

									<CardContent className="p-0 bg-transparent">
										<Box className="flex justify-center items-center flex-wrap left-0 p-0 mt-2 gap-2">
											<Button size="sm" variant={'secondary'}>
												Edit Design
											</Button>
											<Tooltip content="More Options">
												<MenuRoot>
													<MenuTrigger asChild>
														<IconButton size="sm" variant={'secondary'}>
															<MdMoreHoriz />
														</IconButton>
													</MenuTrigger>
												</MenuRoot>
											</Tooltip>
										</Box>
									</CardContent>
								</Card>
							) : (
								<Box>
									Choose a Template
									<Button onClick={() => setShowChooseTemplate(true)}>Choose Template</Button>
								</Box>
							)}
						</Box>
					</Box>
					<Box>
						<Box className="flex justify-center">
							<img src="/icons/email-b.svg" alt="Email B" className="w-16 h-16 mr-4 mt-48px" />
							{campaignData.selectedTemplateAbt ? (
								<Card
									key={campaignData.selectedTemplateAbt.id}
									className="cursor-pointer w-200px overflow-hidden relative group border-0 border-radius-0 bg-transparent"
								>
									<Text variant="body-md" className="mb-4 text-center">
										Design Preview for B
									</Text>
									<Box className="h-280px overflow-hidden relative w-200px border-1 border-border-muted border-radius-md">
										<img
											src={campaignData.selectedTemplateAbt.thumb}
											alt={campaignData.selectedTemplateAbt.label}
											width="100%"
											className="object-cover transition-transform duration-3s ease absolute top-0 left-0 _hover:translate-y-[calc(-100%+280px)]"
										/>
									</Box>

									<CardContent className="p-0 bg-transparent">
										<Box className="flex justify-center items-center flex-wrap left-0 p-0 mt-2 gap-2">
											<Button
												size="xs"
												onClick={() => {
													/* TODO: Implement navigation to editor */
												}}
												variant={'secondary'}
											>
												Edit Design
											</Button>
											<Tooltip content="More Options">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<IconButton size="xs" variant={'secondary'}>
															<MdMoreHoriz />
														</IconButton>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>Edit Text Design</DropdownMenuItem>
														<DropdownMenuItem>Inbox Preview</DropdownMenuItem>
														<DropdownMenuItem
															variant="destructive"
															onClick={() => handleTemplateSelect(undefined)}
														>
															Select Another Template
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</Tooltip>
										</Box>
									</CardContent>
								</Card>
							) : (
								<Box>
									Choose a Template
									<Button onClick={() => setShowChooseTemplate(true)}>Choose Template</Button>
								</Box>
							)}
						</Box>
					</Box>
					<Box>
						<Box className="flex justify-center">
							{campaignData.selectedTemplateAbt ? (
								<Card
									key={campaignData.selectedTemplateAbt.id}
									className="cursor-pointer w-200px overflow-hidden relative group border-0 border-radius-0 bg-transparent"
								>
									<Text variant="body-md" className="mb-4 text-center">
										Design Preview for B
									</Text>
									<Box className="h-280px overflow-hidden relative w-200px border-1 border-border-muted border-radius-md">
										<img
											src={campaignData.selectedTemplateAbt.thumb}
											alt={campaignData.selectedTemplateAbt.label}
											width="100%"
											className="object-cover transition-transform duration-3s ease absolute top-0 left-0 _hover:translate-y-[calc(-100%+280px)]"
										/>
									</Box>

									<CardContent className="p-0 bg-transparent">
										<Box className="flex justify-center items-center flex-wrap left-0 p-0 mt-2 gap-2">
											<Button
												size="sm"
												onClick={() => {
													/* TODO: Implement navigation to editor */
												}}
												variant={'secondary'}
											>
												Edit Design
											</Button>
											<Tooltip content="More Options">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<IconButton size="xs" variant={'secondary'}>
															<MdMoreHoriz />
														</IconButton>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>Edit Text Design</DropdownMenuItem>
														<DropdownMenuItem>Inbox Preview</DropdownMenuItem>
														<DropdownMenuItem
															variant="destructive"
															onClick={() => handleTemplateSelect(undefined, true)}
														>
															Select Another Template
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</Tooltip>
										</Box>
									</CardContent>
								</Card>
							) : (
								<Box>
									Choose a Template
									<Button onClick={() => setShowChooseTemplate(true)}>Choose Template</Button>
								</Box>
							)}
							<img src="/icons/email-b.svg" alt="Email B" className="w-16 h-16 mr-4 mt-48px" />
						</Box>
					</Box>
				</Flex>
			);
		}
		return (
			<Flex className="mb-6">
				<Tabs
					value={String(selectedTab)}
					onValueChange={value => setSelectedTab(Number(value))}
					variant={'pill'}
					orientation="horizontal"
				>
					<Box className="flex justify-start items-center ml-96 pl-4">
						<TabsList>
							<TabsTrigger
								value="0"
								className="h-auto opacity-40 data-[state=active]:bg-secondary data-[state=active]:opacity-100"
							>
								<Flex className="items-center flex-col gap-2 p-2">
									<img
										src="/icons/email-a.svg"
										alt="Campaign A"
										className="mr-2 box-size-5 mt-1 w-10 h-10"
									/>
									<Text>Campaign A</Text>
								</Flex>
							</TabsTrigger>
							<TabsTrigger
								value="1"
								className="h-auto opacity-40 data-[state=active]:bg-secondary data-[state=active]:opacity-100"
							>
								<Flex className="items-center flex-col gap-2 p-2">
									<img
										src="/icons/email-b.svg"
										alt="Campaign B"
										className="mr-2 box-size-5 mt-1 w-10 h-10"
									/>
									<Text>Campaign B</Text>
								</Flex>
							</TabsTrigger>
						</TabsList>
					</Box>
					<TabsContent value="0">{campaignTypeContent('a')}</TabsContent>
					<TabsContent value="1">{campaignTypeContent('b', true)}</TabsContent>
				</Tabs>
			</Flex>
		);
	};

	return (
		<Box
			className={cn(
				'w-full mx-auto min-h-[80vh] flex items-start justify-start flex-col',
				campaignData.selectedTemplate || campaignData.selectedTemplateAbt ? 'center' : 'flex-start'
			)}
		>
			{error && <Box className="bg-red-50 p-3 rounded-md mb-4 text-red-500">{error}</Box>}

			{campaignData.type === 'ab-campaign' && campaignData.abTestVariable === 'content'
				? renderAbTestContent()
				: renderMainContent()}
		</Box>
	);
}
