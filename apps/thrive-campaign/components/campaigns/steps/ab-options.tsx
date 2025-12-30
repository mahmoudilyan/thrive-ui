'use client';

import { useState, useEffect } from 'react';

import { AbWinningMetric, useCampaignStore } from '@/store/use-campaign-store';

import useDebounce from '@/hooks/use-debounce';
import {
	ABCSplitter,
	Field,
	InputGroupInput,
	NumberInput,
	ToggleGroup,
	ToggleGroupItem,
	Box,
	Flex,
	Text,
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	ButtonGroup,
	Button,
} from '@thrive/ui';

export default function ABSettings() {
	const { campaignData, setCampaignField } = useCampaignStore();

	const [segmentA, setSegmentA] = useState(25);
	const [segmentB, setSegmentB] = useState(25);
	const [segmentC, setSegmentC] = useState(50);
	const segmentDebounceA = useDebounce(segmentA, 400);
	const segmentDebounceB = useDebounce(segmentB, 400);
	const segmentDebounceC = useDebounce(segmentC, 400);

	// Update segment C when A or B changes
	useEffect(() => {
		const total = segmentA + segmentB;
		if (total <= 100) {
			setSegmentC(100 - total);
		}
	}, [segmentA, segmentB]);

	useEffect(() => {
		setCampaignField('segmentA', segmentDebounceA);
		setCampaignField('segmentB', segmentDebounceB);
		setCampaignField('segmentC', segmentDebounceC);
	}, [segmentDebounceA, segmentDebounceB, segmentDebounceC, setCampaignField]);

	return (
		<Box>
			<Box>
				<Text fontWeight="medium" className="mb-4">
					How would you like to split your list(s)
				</Text>
				<Box className="h-96px mb-4">
					<ABCSplitter
						defaultSizes={[segmentA, segmentB, segmentC]}
						onSizesChange={sizes => {
							if (sizes && sizes.length >= 3) {
								setSegmentA(Math.round(sizes[0]));
								setSegmentB(Math.round(sizes[1]));
								setSegmentC(Math.round(sizes[2]));
							}
						}}
						className="w-full h-36"
					>
						<Box>
							<Text className="font-semibold mb-0" as="h5">
								Segment A
							</Text>
							<Text className="text-sm">{segmentA}% of your list</Text>
							<Box className="absolute bottom-[4px] left-[4px] w-[calc(200%-8px)] h-7 bg-bg text-light px-2 py-2 rounded-sm text-sm text-center flex justify-center items-center z-100 border-t-1px border-t-dashed border-t-muted">
								Test Size (A+B): <span className="font-semibold ml-1">{segmentA + segmentB} %</span>
							</Box>
						</Box>
						<Box>
							<Text className="font-semibold mb-0" as="h5">
								Segment B
							</Text>
							<Text className="text-sm">{segmentB}% of your list</Text>
						</Box>
						<Box>
							<Text className="font-semibold mb-0" as="h5">
								Segment C
							</Text>
							<Text className="text-sm">
								{segmentC}% of your list
								<span className="font-semibold ml-1">Will receive the winning version</span>
							</Text>
						</Box>
					</ABCSplitter>
				</Box>
			</Box>

			<Box className="flex gap-4 justify-start">
				<Field>
					<Text as="h6" fontWeight="medium">
						What determines winning version?
					</Text>
					<ToggleGroup
						value={campaignData.winningMetric}
						orientation="horizontal"
						onValueChange={value => {
							setCampaignField('winningMetric', value as AbWinningMetric);
						}}
						type="single"
						className="mb-2"
					>
						<ToggleGroupItem
							value="openRate"
							data-active={campaignData.winningMetric === 'openRate'}
						>
							Open Rate
						</ToggleGroupItem>
						<ToggleGroupItem
							value="clickRate"
							data-active={campaignData.winningMetric === 'clickRate'}
						>
							Click Rate
						</ToggleGroupItem>
						<ToggleGroupItem
							value="fullyRead"
							data-active={campaignData.winningMetric === 'fullyRead'}
						>
							Fully Read
						</ToggleGroupItem>
						<ToggleGroupItem
							value="conversion"
							data-active={campaignData.winningMetric === 'conversion'}
						>
							Conversion
						</ToggleGroupItem>
					</ToggleGroup>
				</Field>
				<Field>
					<Text as="h6" fontWeight="medium">
						Fallback in case A/B matches
					</Text>
					<ToggleGroup
						type="single"
						value={campaignData.winningFallback}
						orientation="horizontal"
						onValueChange={value => {
							setCampaignField('winningFallback', value as AbWinningMetric);
						}}
						className="mb-2"
					>
						<ToggleGroupItem
							value="openRate"
							data-active={campaignData.winningFallback === 'openRate'}
						>
							Open Rate
						</ToggleGroupItem>
						<ToggleGroupItem
							value="clickRate"
							data-active={campaignData.winningFallback === 'clickRate'}
						>
							Click Rate
						</ToggleGroupItem>
						<ToggleGroupItem
							value="fullyRead"
							data-active={campaignData.winningFallback === 'fullyRead'}
						>
							Fully Read
						</ToggleGroupItem>
						<ToggleGroupItem
							value="conversion"
							data-active={campaignData.winningFallback === 'conversion'}
						>
							Conversion
						</ToggleGroupItem>
					</ToggleGroup>
				</Field>
			</Box>

			<Field>
				<Text as="h6" fontWeight="medium" className="mt-2">
					If all results are tie, run the following version
				</Text>
				<ToggleGroup
					type="single"
					value={campaignData.finalVariant}
					orientation="horizontal"
					onValueChange={value => {
						setCampaignField('finalVariant', value as 'A' | 'B');
					}}
					className="mb-2"
				>
					<ToggleGroupItem value="A" data-active={campaignData.finalVariant === 'A'}>
						A
					</ToggleGroupItem>
					<ToggleGroupItem value="B" data-active={campaignData.finalVariant === 'B'}>
						B
					</ToggleGroupItem>
				</ToggleGroup>
				<Flex gap={'2'} align={'center'}>
					<Text className="text-sm">And send remainder after</Text>
					<InputGroup className="w-32">
						<InputGroupInput
							type="number"
							value={campaignData.remainingHours ?? 1}
							min={1}
							max={240}
							onValueChange={value => {
								setCampaignField('remainingHours', value ?? 1);
							}}
						/>
						<ButtonGroup orientation="vertical" size="sm">
							<Button variant="secondary">+</Button>
							<Button variant="secondary">-</Button>
						</ButtonGroup>
						<InputGroupAddon align="inline-end">hours</InputGroupAddon>
					</InputGroup>
				</Flex>
			</Field>
		</Box>
	);
}
