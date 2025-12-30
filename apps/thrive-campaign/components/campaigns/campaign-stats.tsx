import { MdMarkEmailRead, MdTouchApp, MdInfoOutline } from 'react-icons/md';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	ProgressBar,
	ProgressLabel,
	ProgressRoot,
	Tooltip,
	Flex,
	Text,
	Box,
} from '@thrive/ui';

interface CampaignStatsProps {
	stats: {
		total?: number;
		opened: {
			r: number;
			a?: number;
			b?: number;
		};
		clicked: {
			r: number;
			a?: number;
			b?: number;
		};
		totalA?: number;
		totalB?: number;
	};
	campaignInfo: {
		from: string;
		replyTo: string;
		subject: string;
		fromName: string;
		status: 'draft' | 'sent' | 'scheduled';
	};
}

const CampaignInfoPopover = ({ info }: { info: CampaignStatsProps['campaignInfo'] }) => (
	<HoverCard>
		<HoverCardTrigger asChild className="ml-1">
			<MdInfoOutline />
		</HoverCardTrigger>
		<HoverCardContent className="w-fit">
			<Box>
				<Text variant="body-xs" as="p">
					<span className="font-semibold text-ink-dark">From:</span> {info.from}
				</Text>
			</Box>
			<Box>
				<Text variant="body-xs" as="p">
					<span className="font-semibold text-ink-dark">Reply to:</span> {info.replyTo}
				</Text>
			</Box>
			<Box>
				<Text variant="body-xs" as="p">
					<span className="font-semibold text-ink-dark">Subject:</span> {info.subject}
				</Text>
			</Box>
			<Box>
				<Text variant="body-xs" as="p">
					<span className="font-semibold text-ink-dark">From Name:</span> {info.fromName}
				</Text>
			</Box>
		</HoverCardContent>
	</HoverCard>
	//   <PopoverRoot>
	//     <PopoverTrigger>
	//       <Flex align="center" cursor="pointer">
	//         <MdInfoOutline />
	//       </Flex>
	//     </PopoverTrigger>
	//     <PopoverContent className="w-fit min-w-[200px] p-2">
	//       <VStack align="flex-start" gap={1}>
	//         <Text fontSize="sm">
	//           <strong>From:</strong> {info.from}
	//         </Text>
	//         <Text fontSize="sm">
	//           <strong>Reply to:</strong> {info.replyTo}
	//         </Text>
	//         <Text fontSize="sm">
	//           <strong>Subject:</strong> {info.subject}
	//         </Text>
	//         <Text fontSize="sm">
	//           <strong>From Name:</strong> {info.fromName}
	//         </Text>
	//       </VStack>
	//     </PopoverContent>
	//   </PopoverRoot>
);

const ProgressBarSet = ({
	totalOpen,
	totalClick,
	label = '',
	contacts = 0,
	info,
}: {
	totalOpen: number;
	totalClick?: number;
	label?: string;
	contacts?: number;
	info: CampaignStatsProps['campaignInfo'];
}) => {
	const openRate = Math.floor((totalOpen / contacts) * 100);
	const clickRate = totalClick && Math.floor((totalClick / contacts) * 100);

	return (
		<Flex className="flex flex-col gap-2 w-full relative">
			{label && (
				<Flex className="flex flex-start gap-2 justify-between relative">
					<Text className="font-xs font-medium absolute top-[-16px] left-0">{label}</Text>
					<Text
						variant="body-xs"
						color="gray.600"
						className="absolute top-[-16px] right-0 flex items-center"
					>
						{contacts.toLocaleString()}
						<CampaignInfoPopover info={info} />
					</Text>
				</Flex>
			)}
			<Tooltip content={`Opens: ${totalOpen} (${openRate}%)`} delayDuration={200}>
				<Box>
					<ProgressRoot value={50} className="max-w-60">
						<Flex className="flex flex-start gap-5">
							<ProgressLabel>
								<MdMarkEmailRead />
							</ProgressLabel>
							<ProgressBar className="flex-1 rounded-lg" />
						</Flex>
					</ProgressRoot>
				</Box>
			</Tooltip>
			<Tooltip
				content={`Clicks: ${totalClick} (${clickRate && clickRate.toFixed(1)}%)`}
				delayDuration={200}
			>
				<Box>
					<ProgressRoot value={clickRate}>
						<Flex className="flex flex-start gap-5">
							<ProgressLabel>
								<MdTouchApp />
							</ProgressLabel>
							<ProgressBar className="flex-1 rounded-lg" />
						</Flex>
					</ProgressRoot>
				</Box>
			</Tooltip>
		</Flex>
	);
};

export default function CampaignStats({ stats, campaignInfo }: CampaignStatsProps) {
	if (campaignInfo.status === 'draft') {
		return (
			<Flex align="center" gap="2">
				<HoverCard>
					<HoverCardTrigger asChild className="ml-2">
						<Text variant="body-xs" className="cursor-pointer underline underline-dotted">
							Draft Mode
						</Text>
					</HoverCardTrigger>
					<HoverCardContent className="w-fit">
						<Box>
							<Text variant="body-xs" as="p">
								<span className="font-semibold text-ink-dark">From:</span> {campaignInfo.from}
							</Text>
						</Box>
						<Box>
							<Text variant="body-xs" as="p">
								<span className="font-semibold text-ink-dark">Reply to:</span>{' '}
								{campaignInfo.replyTo}
							</Text>
						</Box>
						<Box>
							<Text variant="body-xs" as="p">
								<span className="font-semibold text-ink-dark">Subject:</span> {campaignInfo.subject}
							</Text>
						</Box>
						<Box>
							<Text variant="body-xs" as="p">
								<span className="font-semibold text-ink-dark">From Name:</span>{' '}
								{campaignInfo.fromName}
							</Text>
						</Box>
					</HoverCardContent>
				</HoverCard>
			</Flex>
		);
	}

	if (!stats.total) {
		return <Text>No data</Text>;
	}
	if (stats.opened.a !== undefined && stats.opened.b !== undefined) {
		//console.log('totalB', stats, totalB);

		return (
			<Flex direction="row" gap={'2'} className="max-w-64">
				<ProgressBarSet
					totalOpen={stats.opened.a}
					totalClick={stats.clicked.a}
					label="A"
					contacts={stats.totalA}
					info={campaignInfo}
				/>
				<ProgressBarSet
					totalOpen={stats.opened.b}
					totalClick={stats.clicked.b}
					label="B"
					contacts={stats.totalB}
					info={campaignInfo}
				/>
			</Flex>
		);
	}

	return (
		<Box className="w-60">
			<Flex className="flex flex-end gap-2 ml-8 relative">
				<Text
					variant="body-xs"
					color="gray-600"
					className="absolute top-[-16px] right-0 flex items-center"
				>
					{stats.total.toLocaleString()} Contacts
					<CampaignInfoPopover info={campaignInfo} />
				</Text>
			</Flex>
			<ProgressBarSet
				totalOpen={stats.opened.r}
				totalClick={stats.clicked.r}
				contacts={stats.total}
				info={campaignInfo}
			/>
		</Box>
	);
}
