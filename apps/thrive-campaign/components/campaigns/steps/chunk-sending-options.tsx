'use client';

import { useState, useEffect } from 'react';

import { TIME_OPTIONS } from '@/constants/time';

import useDebounce from '@/hooks/use-debounce';

import { MdInfo, MdOutlineInfo, MdOutlineQuestionMark, MdQuestionMark } from 'react-icons/md';
import {
	Field,
	HoverCardContent,
	HoverCard,
	HoverCardTrigger,
	Input,
	NumberInput,
	Flex,
	Icon,
	Box,
	Text,
	SelectContent,
	SelectItem,
	Select,
	SelectTrigger,
	SelectValue,
	ToggleGroup,
	ToggleGroupItem,
	IconButton,
} from '@thrive/ui';
interface ChunkSendingOptionsProps {
	campaignData: any;
	setCampaignField: (field: string, value: any) => void;
}

export default function ChunkSendingOptions({
	campaignData,
	setCampaignField,
}: ChunkSendingOptionsProps) {
	// Local state for immediate updates
	const [hourlyVolume, setHourlyVolume] = useState(campaignData.warmUpHourlyVolume || 0);
	const [dailyIncrease, setDailyIncrease] = useState(campaignData.warmUpDailyVolumeIncrease || 0);
	const [dailyLimit, setDailyLimit] = useState(campaignData.warmUpDailyLimit || 0);

	// Debounced values that will update the campaign data
	const debouncedHourlyVolume = useDebounce(hourlyVolume);
	const debouncedDailyIncrease = useDebounce(dailyIncrease);
	const debouncedDailyLimit = useDebounce(dailyLimit);

	// Update campaign data when debounced values change
	useEffect(() => {
		setCampaignField('warmUpHourlyVolume', debouncedHourlyVolume);
	}, [debouncedHourlyVolume, setCampaignField]);

	useEffect(() => {
		setCampaignField('warmUpDailyVolumeIncrease', debouncedDailyIncrease);
	}, [debouncedDailyIncrease, setCampaignField]);

	useEffect(() => {
		setCampaignField('warmUpDailyLimit', debouncedDailyLimit);
	}, [debouncedDailyLimit, setCampaignField]);

	return (
		<Box>
			<Text variant="heading-md" fontWeight="medium" className="mb-4">
				Chunk Sending Settings
			</Text>
			<Flex direction="col" gap={'4'}>
				<Flex gap={'4'}>
					<Box>
						<Field label={<label htmlFor="start-time-input">Start Time</label>}>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select start time" />
								</SelectTrigger>
								<SelectContent>
									{TIME_OPTIONS.map(item => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					</Box>
					<Box className="mb-2">
						<Field label={<label htmlFor="end-time-input">End Time</label>}>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select end time" />
								</SelectTrigger>
								<SelectContent>
									{TIME_OPTIONS.map(item => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					</Box>
					<Box>
						<Field label="Send on these days">
							<ToggleGroup
								type="multiple"
								value={campaignData.warmupSendDays || ['everyday']}
								onValueChange={value => {
									console.log('value', value);

									const currentDays = new Set(campaignData.warmupSendDays || ['everyday']);
									const lowerValue = value.map(item => item.toLowerCase());

									if (lowerValue.includes('everyday')) {
										setCampaignField('warmupSendDays', ['everyday']);
										return;
									}

									if (currentDays.has(lowerValue)) {
										currentDays.delete(lowerValue);
										if (currentDays.size === 0) {
											setCampaignField('warmupSendDays', ['everyday']);
											return;
										}
									} else {
										currentDays.delete('everyday');
										currentDays.add(lowerValue);
									}

									setCampaignField('warmupSendDays', Array.from(currentDays));
								}}
							>
								<ToggleGroupItem
									value="everyday"
									data-active={campaignData.warmupSendDays?.includes('everyday')}
								>
									Everyday
								</ToggleGroupItem>
								<ToggleGroupItem
									value="mon"
									data-active={campaignData.warmupSendDays?.includes('mon')}
								>
									Mon
								</ToggleGroupItem>
								<ToggleGroupItem
									value="tue"
									data-active={campaignData.warmupSendDays?.includes('tue')}
								>
									Tue
								</ToggleGroupItem>
								<ToggleGroupItem
									value="wed"
									data-active={campaignData.warmupSendDays?.includes('wed')}
								>
									Wed
								</ToggleGroupItem>
								<ToggleGroupItem
									value="thu"
									data-active={campaignData.warmupSendDays?.includes('thu')}
								>
									Thu
								</ToggleGroupItem>
								<ToggleGroupItem
									value="fri"
									data-active={campaignData.warmupSendDays?.includes('fri')}
								>
									Fri
								</ToggleGroupItem>
								<ToggleGroupItem
									value="sat"
									data-active={campaignData.warmupSendDays?.includes('sat')}
								>
									Sat
								</ToggleGroupItem>
								<ToggleGroupItem
									value="sun"
									data-active={campaignData.warmupSendDays?.includes('sun')}
								>
									Sun
								</ToggleGroupItem>
							</ToggleGroup>
						</Field>
					</Box>
				</Flex>

				<Flex gap={'4'}>
					<Box>
						<Field
							label={
								<label htmlFor="hourly-send-volume-input">
									Hourly send volume
									<HoverCard>
										<HoverCardTrigger>
											<IconButton
												variant="ghost"
												size="sm"
												className="w-4 h-4 ml-1 cursor-pointer"
												icon={<MdOutlineInfo />}
											/>
										</HoverCardTrigger>
										<HoverCardContent>
											<Text variant="body-sm">
												Choose the maximum number of emails to send per hour
											</Text>
										</HoverCardContent>
									</HoverCard>
								</label>
							}
						>
							<NumberInput
								min={0}
								step={1}
								value={hourlyVolume.toString()}
								onValueChange={value => setHourlyVolume(Number(value))}
								className="w-full"
							/>
						</Field>
					</Box>
					<Box className="flex-1">
						<Field
							label={
								<label htmlFor="increase-daily-volume-by-input">
									Increase daily volume by
									<HoverCard>
										<HoverCardTrigger>
											<IconButton variant="ghost" size="sm" icon={<MdOutlineInfo />} />
										</HoverCardTrigger>
										<HoverCardContent>
											<Text variant="body-sm">
												Percentage of increase day by day from the moment you launch the campaign
											</Text>
										</HoverCardContent>
									</HoverCard>
								</label>
							}
						>
							<NumberInput
								min={0}
								max={100}
								step={1}
								value={dailyIncrease.toString()}
								onValueChange={value => setDailyIncrease(Number(value))}
								width="100%"
							/>
						</Field>
					</Box>
					<Box>
						<Field
							label={
								<label htmlFor="daily-limit-input">
									Daily limit (0 = Unlimited)
									<HoverCard>
										<HoverCardTrigger>
											<Icon color="text.light" w={4} h={4} ml={1} cursor="pointer">
												<MdOutlineInfo />
											</Icon>
										</HoverCardTrigger>
										<HoverCardContent>
											<Text variant="body-sm">Maximum number of recipients to send to per day</Text>
										</HoverCardContent>
									</HoverCard>
								</label>
							}
						>
							<NumberInput
								min={0}
								step={1}
								value={dailyLimit.toString()}
								onValueChange={value => setDailyLimit(Number(value))}
								className="w-full"
							/>
						</Field>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
}
