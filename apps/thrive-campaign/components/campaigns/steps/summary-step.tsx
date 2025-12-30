'use client';

import { CampaignProcessWarmUp, useCampaignStore } from '@/store/use-campaign-store';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import ChunkSendingOptions from './chunk-sending-options';
import PredictiveSendingOptions from './predictive-sending-options';

import useDebounce from '@/hooks/use-debounce';
import {
	Box,
	Accordion,
	AccordionItem,
	AccordionContent,
	AccordionTrigger,
	InlineDatePicker,
	DescriptionList,
	Field,
	RadioCardItem,
	RadioCardLabel,
	RadioCard,
	SelectContent,
	SelectItem,
	Select,
	SelectTrigger,
	SelectValue,
	Switch,
	ToggleGroup,
	ToggleGroupItem,
	Flex,
	Text,
	Input,
	Tabs,
	Button,
	Badge,
	TabsContent,
	TabsTrigger,
	TabsList,
	Label,
	TableHead,
	TableBody,
	TableFooter,
} from '@thrive/ui';
import { Table, TableHeader, TableRow, TableCell } from '@thrive/ui';

export default function SummaryStep({
	onNext,
	onPrev,
}: {
	onNext: () => void;
	onPrev: () => void;
}) {
	const { campaignData, setCampaignField } = useCampaignStore();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		campaignData.sendingDate ? new Date(campaignData.sendingDate) : undefined
	);

	const [localUtmSettings, setLocalUtmSettings] = useState(campaignData.utmSettings);
	const debouncedUtmSettings = useDebounce(localUtmSettings, 200);

	useEffect(() => {
		setLocalUtmSettings(campaignData.utmSettings);
	}, [campaignData.utmSettings]);

	useEffect(() => {
		setCampaignField('utmSettings', debouncedUtmSettings);
	}, [debouncedUtmSettings, setCampaignField]);

	// Create date range limits for the DatePicker
	const today = new Date();
	const twoMonthsFromNow = new Date();
	twoMonthsFromNow.setMonth(today.getMonth() + 2);

	// Handle date selection
	const handleDateChange = (date: Date | [Date, Date] | undefined) => {
		const selectedDate = Array.isArray(date) ? date[0] : date;
		setSelectedDate(selectedDate);
		setCampaignField('sendingDate', selectedDate);
	};

	// Handle send mode change
	const handleSendModeChange = (value: string) => {
		setCampaignField('isScheduled', value === 'schedule');
	};

	// Handle warm-up process change
	const handleWarmUpProcessChange = (value: string) => {
		setCampaignField('warmUpProcess', value as CampaignProcessWarmUp);
	};

	return (
		<Box className="w-full mx-auto min-h-80vh">
			<Text className="text-xl font-bold mb-6" as="h2" variant="heading-xl" fontWeight="bold">
				Review Your Campaign
			</Text>

			<Flex gap={'6'}>
				<Box className="flex-grow w-full">
					<Accordion type="single" collapsible>
						<AccordionItem value="sending-summary">
							<AccordionTrigger>
								<Text
									fontWeight="semibold"
									color="text-light"
									variant="caps-sm"
									className="uppercase text-sm"
								>
									Sending Options
								</Text>
							</AccordionTrigger>
							<AccordionContent className="overflow-visible">
								<Field label="Sending Time">
									<ToggleGroup
										value={campaignData.isScheduled ? 'schedule' : 'now'}
										onValueChange={handleSendModeChange}
										variant="secondary"
										type="single"
										className="overflow-visible"
									>
										<ToggleGroupItem value="now" data-active={!campaignData.isScheduled}>
											Send Immediately
										</ToggleGroupItem>
										<ToggleGroupItem value="schedule" data-active={campaignData.isScheduled}>
											<label htmlFor="schedule-time" style={{ cursor: 'pointer' }}>
												Schedule Campaign at
											</label>
											{campaignData.isScheduled && (
												<InlineDatePicker
													id="schedule-time"
													hasTime={true}
													value={selectedDate}
													onValueChange={handleDateChange}
													fromMonth={today}
													toMonth={twoMonthsFromNow}
												/>
											)}
										</ToggleGroupItem>
									</ToggleGroup>
								</Field>
								<RadioCard
									defaultValue="normal"
									orientation="horizontal"
									onValueChange={handleWarmUpProcessChange}
									value={campaignData.warmUpProcess}
									className="mt-4"
								>
									<RadioCardLabel>Sending Process</RadioCardLabel>
									<Flex align="stretch" gap={'4'}>
										<RadioCardItem
											value="normal"
											icon={
												<img
													src="/icons/campaign-sending-normal.svg"
													alt="Normal"
													className="w-8 h-8"
												/>
											}
											label={
												<Text variant="body-sm" fontWeight="medium">
													Normal Sending
												</Text>
											}
											description={
												<Text variant="body-xs" color="text-light">
													Execute the campaign to your whole list fast
												</Text>
											}
											indicator={false}
										/>
										<RadioCardItem
											value="chunk"
											icon={
												<img
													src="/icons/campaign-sending-chunk.svg"
													alt="Chunk Sending"
													className="w-8 h-8"
												/>
											}
											label={<Text>Chunk Sending</Text>}
											description={
												<Text variant="body-xs" color="text-light">
													Send your campaign in smaller batches to optimize your deliverability and
													create a domain warmup process
												</Text>
											}
											indicator={false}
										/>
										<RadioCardItem
											value="predictive"
											icon={
												<img
													src="/icons/predictive-sending.svg"
													alt="Predictive Sending"
													className="w-8 h-8"
												/>
											}
											label={<Text>Predictive Sending</Text>}
											description={
												<Text variant="body-xs" color="text-light">
													Send your campaign when recipients are more likely to open.
												</Text>
											}
											indicator={false}
										/>
									</Flex>
								</RadioCard>
								{campaignData.warmUpProcess === ('chunk' as CampaignProcessWarmUp) && (
									<ChunkSendingOptions
										campaignData={campaignData}
										setCampaignField={setCampaignField}
									/>
								)}
								{campaignData.warmUpProcess === ('predictive' as CampaignProcessWarmUp) && (
									<PredictiveSendingOptions
										campaignData={campaignData}
										setCampaignField={setCampaignField}
									/>
								)}
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="campaign-details">
							<AccordionTrigger>
								<Text>
									Campaign Details
									{campaignData.type === 'ab-campaign' && (
										<Text
											className="ml-2 inline-flex items-baseline gap-1"
											color="text"
											variant="body-xs"
											fontWeight="regular"
										>
											<img
												src="/icons/email-investigate.svg"
												alt="AB Test"
												width={4}
												height={4}
												className="self-center"
											/>
											A/B Campaign
										</Text>
									)}
								</Text>
							</AccordionTrigger>
							<AccordionContent>
								<DescriptionList
									items={[
										{
											label: 'Campaign Name',
											description: campaignData.name || 'New Campaign Name',
										},
										{
											label: 'Campaign Type',
											description: campaignData.type === 'ab-campaign' ? 'A/B Campaign' : 'Regular',
										},
										{
											label: 'Campaign Status',
											description: campaignData.isScheduled ? 'Scheduled' : 'Not Scheduled',
										},
										{
											label: 'Campaign Subject',
											description:
												campaignData.type === 'ab-campaign'
													? campaignData.subjectAbt || 'New Campaign Subject'
													: campaignData.subject || 'New Campaign Subject',
										},
										{
											label: 'Campaign From',
											description: campaignData.fromName || 'New Campaign From',
										},
										{
											label: 'Campaign Reply To',
											description: campaignData.replyToEmail || 'New Campaign Reply To',
										},
									]}
								/>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="recipients">
							<AccordionTrigger>
								<Text>Recipients</Text>
							</AccordionTrigger>
							<AccordionContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead align="left" className="border-b border-border-secondary">
												Type
											</TableHead>
											<TableHead align="left" className="border-b border-border-secondary">
												Name
											</TableHead>
											<TableHead align="left" className="border-b border-border-secondary">
												Contacts
											</TableHead>
										</TableRow>
									</TableHeader>

									<TableBody>
										{campaignData.recipients.map(item => (
											<TableRow key={item.id}>
												<TableCell width="25%">
													{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
												</TableCell>
												<TableCell width="45%">{item.name}</TableCell>
												<TableCell width="30%">
													{item.contactsCount?.toLocaleString() || 0}
												</TableCell>
											</TableRow>
										))}
										{campaignData.excludeRecipients &&
											campaignData.excludeRecipients.length > 0 && (
												<>
													{campaignData.recipients
														.filter(item => campaignData.excludeRecipients?.includes(item.id))
														.map(item => (
															<TableRow key={`excluded-${item.id}`}>
																<TableCell width="25%">
																	<Badge variant="destructive">Excluded</Badge>
																	{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
																</TableCell>
																<TableCell width="45%">{item.name}</TableCell>
																<TableCell width="30%">
																	{item.contactsCount?.toLocaleString() || 0}
																</TableCell>
															</TableRow>
														))}
												</>
											)}
									</TableBody>
								</Table>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="advanced-settings">
							<AccordionTrigger>
								<Text>Advanced Settings</Text>
							</AccordionTrigger>
							<AccordionContent>
								<Box>
									<div className="flex items-center gap-2">
										<Switch
											checked={localUtmSettings.enabled}
											onCheckedChange={(value: boolean) => {
												setLocalUtmSettings({
													...localUtmSettings,
													enabled: value,
												});
											}}
											id="utm-settings"
										/>
										<Box>
											<Label htmlFor="utm-settings">UTM Settings</Label>
											<Text variant="body-sm" as="p">
												Track the performance of your campaign by adding UTM parameters to your
												links.{' '}
												<Link href="/docs/utm-parameters" className="text-ink-primary">
													Learn more
												</Link>
											</Text>
										</Box>
									</div>
									{localUtmSettings.enabled && (
										<>
											<Flex dir="column" gap={'4'} className="w-full pl-12 mt-4">
												<Field label="UTM Source">
													<Input
														value={localUtmSettings.utmSource}
														onChange={e => {
															setLocalUtmSettings({
																...localUtmSettings,
																utmSource: e.target.value,
															});
														}}
													/>
												</Field>
												<Field label="UTM Medium">
													<Input
														value={localUtmSettings.utmMedium}
														onChange={e => {
															setLocalUtmSettings({
																...localUtmSettings,
																utmMedium: e.target.value,
															});
														}}
													/>
												</Field>
												<Field label="UTM Term">
													<Input
														value={localUtmSettings.utmTerm}
														onChange={e => {
															setLocalUtmSettings({
																...localUtmSettings,
																utmTerm: e.target.value,
															});
														}}
													/>
												</Field>
											</Flex>
											<Flex dir="column" gap={'4'} className="w-full pl-12 mt-4">
												<Field label="UTM Campaign">
													<Input
														value={localUtmSettings.utmCampaign}
														onChange={e => {
															setLocalUtmSettings({
																...localUtmSettings,
																utmCampaign: e.target.value,
															});
														}}
													/>
												</Field>
												<Field label="UTM Content">
													<Input
														value={localUtmSettings.utmContent}
														onChange={e => {
															setLocalUtmSettings({
																...localUtmSettings,
																utmContent: e.target.value,
															});
														}}
													/>
												</Field>
											</Flex>
										</>
									)}
								</Box>

								<Box className="mt-6">
									<div className="flex items-center gap-2">
										<Switch
											checked={campaignData.useCustomSmtp}
											onCheckedChange={(value: boolean) => {
												setCampaignField('useCustomSmtp', value);
											}}
											id="smtp-server"
										/>
										<Box>
											<Label htmlFor="smtp-server">SMTP server</Label>
											<Text variant="body-sm" as="p">
												Use a custom SMTP server for your campaign.
											</Text>
										</Box>
									</div>
									{campaignData.useCustomSmtp && (
										<Box className="pl-12 mt-2 w-full">
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Select a server" />
												</SelectTrigger>
												<SelectContent>
													{[
														{ label: 'SMTP.GMAIL.COM', value: 'smtp.gmail.com' },
														{ label: 'SMTP.GMAIL.COM', value: 'smtp.gmail.com' },
														{ label: 'SMTP.GMAIL.COM', value: 'smtp.gmail.com' },
													].map(item => (
														<SelectItem key={item.value} value={item.value}>
															{item.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Box>
									)}
								</Box>
								<Box className="mt-6">
									<div className="flex items-center gap-2">
										<Switch
											checked={campaignData.useSmartRouting}
											onCheckedChange={(value: boolean) => {
												setCampaignField('useSmartRouting', value);
											}}
											id="smart-routing"
										/>
										<Box>
											<Label htmlFor="smart-routing">Smart Routing</Label>
											<Text variant="body-sm" as="p">
												Enhance your campaign with intelligent email routing based on recipient
												domains and SMTP preferences.
											</Text>
										</Box>
									</div>
								</Box>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Box>
				<Box className="w-[400px]">
					{campaignData.type === 'ab-campaign' && campaignData.abTestVariable === 'content' ? (
						<Tabs variant="line" orientation="horizontal" defaultValue="campaign-a">
							<Flex className="p-0" justify="between">
								<Text variant="heading-lg" fontWeight="bold" className="mb-2">
									Design
								</Text>
								<Box className="relative">
									<TabsList className="ml-[-1px]">
										<TabsTrigger value="campaign-a" className="data-[state=active]:bg-bg">
											A
										</TabsTrigger>
										<TabsTrigger value="campaign-b" className="data-[state=active]:bg-bg">
											B
										</TabsTrigger>
									</TabsList>
									<Flex className="absolute right-0 top-0">
										{campaignData.selectedTemplate && (
											<>
												<Button size="xs" variant="ghost">
													Edit
												</Button>
												<Button size="xs" variant="ghost">
													Send Test
												</Button>
												<Button size="xs" variant="ghost">
													Spam Check
												</Button>
											</>
										)}
									</Flex>
								</Box>
							</Flex>
							<TabsContent value="campaign-a">
								{campaignData.selectedTemplate ? (
									<img src={campaignData.selectedTemplate?.thumb} alt="Campaign A" />
								) : (
									<Text>No template selected</Text>
								)}
							</TabsContent>
							<TabsContent value="campaign-b">
								{campaignData.selectedTemplateAbt ? (
									<img src={campaignData.selectedTemplateAbt?.thumb} alt="Campaign A" />
								) : (
									<Text>No template selected</Text>
								)}
							</TabsContent>
						</Tabs>
					) : (
						<>
							<Flex justify="between" className="p-0 relative" align="center">
								<Box>
									<Text variant="heading-lg" fontWeight="bold" className="mb-2">
										Design
									</Text>
								</Box>
								<Flex className="absolute right-0 top-0">
									{campaignData.selectedTemplate && (
										<>
											<Button size="xs" variant="ghost">
												Edit
											</Button>
											<Button size="xs" variant="ghost">
												Send Test
											</Button>
											<Button size="xs" variant="ghost">
												Spam Check
											</Button>
										</>
									)}
								</Flex>
							</Flex>
							<Box>
								{campaignData.selectedTemplate ? (
									<img src={campaignData.selectedTemplate?.thumb} alt="Campaign A" />
								) : (
									<Text>No template selected</Text>
								)}
							</Box>
						</>
					)}
				</Box>
			</Flex>
		</Box>
	);
}
