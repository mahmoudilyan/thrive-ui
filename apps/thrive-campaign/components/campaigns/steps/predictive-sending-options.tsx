'use client';

import { useState } from 'react';

import { MdOutlineInfo } from 'react-icons/md';
import {
	Box,
	Text,
	Flex,
	Icon,
	InlineDatePicker,
	Field,
	HoverCardContent,
	HoverCard,
	HoverCardTrigger,
	RadioCardItem,
	RadioCard,
	ToggleGroup,
	ToggleGroupItem,
} from '@thrive/ui';

interface PredictiveSendingOptionsProps {
	campaignData: any;
	setCampaignField: (field: string, value: any) => void;
}

export default function PredictiveSendingOptions({
	campaignData,
	setCampaignField,
}: PredictiveSendingOptionsProps) {
	const [dueDate, setDueDate] = useState<Date | undefined>(
		campaignData.dueDate ? new Date(campaignData.dueDate) : undefined
	);

	const [predictiveSendingSchedule, setPredictiveSendingSchedule] = useState<'week' | 'schedule'>(
		campaignData.predictiveSendingSchedule ? 'schedule' : 'week'
	);

	const isWeekFromNow =
		campaignData.predictiveSendingMaxDate &&
		campaignData.predictiveSendingMaxDate ===
			new Date(
				new Date(campaignData.sendingDate).setDate(new Date(campaignData.sendingDate).getDate() + 7)
			);

	const handleDueDateChange = (value: string) => {
		if (value === 'week') {
			// Add 7 days of campaignData.sendingDate
			setCampaignField('predictiveSendingSchedule', 'week');

			const maxDate = new Date(campaignData.sendingDate);
			maxDate.setDate(maxDate.getDate() + 7);
			setDueDate(maxDate);
			setCampaignField('predictiveSendingMaxDate', maxDate);
		} else {
			// Set to value date
			setCampaignField('predictiveSendingSchedule', 'schedule');
			setDueDate(dueDate);
			setCampaignField('predictiveSendingMaxDate', dueDate);
		}
	};

	return (
		<Box className="mt-4">
			<Text fontWeight="medium" className="mb-4">
				Predictive Sending Settings
			</Text>
			<Flex direction="col" className="gap-4">
				<Flex gap="4">
					<Box className="flex-1">
						<Field label="Campaign Schedule">
							<ToggleGroup
								value={predictiveSendingSchedule}
								onValueChange={handleDueDateChange}
								variant="secondary"
								type="single"
							>
								<ToggleGroupItem value="week" data-active={predictiveSendingSchedule === 'week'}>
									Send over the week
								</ToggleGroupItem>
								<ToggleGroupItem
									value="schedule"
									data-active={campaignData.predictiveSendingSchedule === 'schedule'}
								>
									<label htmlFor="schedule-time" className="cursor-pointer">
										Schedule Campaign at
									</label>
									{campaignData.predictiveSendingSchedule === 'schedule' && (
										<InlineDatePicker
											id="schedule-time"
											hasTime={true}
											value={dueDate}
											onChange={date => {
												const selectedDate = Array.isArray(date) ? date[0] : date;
												setDueDate(selectedDate);
												setCampaignField('predictiveSendingMaxDate', selectedDate);
											}}
											fromMonth={new Date(campaignData.sendingDate)}
											toMonth={
												new Date(
													new Date(campaignData.sendingDate).setMonth(
														new Date(campaignData.sendingDate).getMonth() + 2
													)
												)
											}
											className="size-sm"
										/>
									)}
								</ToggleGroupItem>
							</ToggleGroup>
						</Field>
					</Box>
				</Flex>
				<Flex gap="4">
					<Box className="flex-1">
						<Field
							label="Learning Phase Fallback"
							optionalText={
								<HoverCard>
									<HoverCardTrigger>
										<Icon color="text.light" w={4} h={4} ml={1} cursor="pointer">
											<MdOutlineInfo />
										</Icon>
									</HoverCardTrigger>
									<HoverCardContent>
										<Text variant="body-sm">
											While the model learns, choose to send your campaign based on
										</Text>
									</HoverCardContent>
								</HoverCard>
							}
						>
							<RadioCard
								defaultValue={campaignData.learningPhaseFallback || 'system'}
								orientation="horizontal"
								onValueChange={value => setCampaignField('learningPhaseFallback', value)}
								className="w-full"
							>
								<Flex align="stretch" justify="stretch" gap="4">
									<RadioCardItem
										value="system"
										label={
											<Text variant="body-sm" fontWeight="regular">
												Predicted daily best open rates system wide
											</Text>
										}
										className="w-full"
									/>
									<RadioCardItem
										value="industry"
										label={
											<Text variant="body-sm" fontWeight="regular">
												Similar industries&apos; best open rates
											</Text>
										}
										className="w-full"
									/>
								</Flex>
							</RadioCard>
						</Field>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
}
