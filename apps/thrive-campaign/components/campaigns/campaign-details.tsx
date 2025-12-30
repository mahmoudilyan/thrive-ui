import { MdCalendarMonth, MdOutlineCheck } from 'react-icons/md';
import Link from 'next/link';
import { HoverCard, HoverCardContent, HoverCardTrigger, Flex, Badge, Text, Icon } from '@thrive/ui';

interface CampaignDetailsProps {
	name: string;
	type: 'Regular' | 'A/B Campaign';
	status: 'draft' | 'sent' | 'paused';
	sendingType?: 'Predictive Sending';
	startDate?: string;
	completedDate?: string;
	createdDate?: string;
}

export function CampaignDetails({
	name,
	type,
	status,
	sendingType,
	startDate,
	completedDate,
	createdDate,
}: CampaignDetailsProps) {
	return (
		<Flex direction="col" gap="2" className="max-w-[400px] py-2">
			<HoverCard>
				<HoverCardTrigger asChild>
					<Text as="p" truncate className="max-w-[400px]">
						<Link href={`/campaigns/${name}`} className="font-medium">
							{name}
						</Link>
					</Text>
				</HoverCardTrigger>
				<HoverCardContent className="p-1">
					<Flex className="flex flex-start gap-2">
						<img src="https://assets.vbt.io/public/capture_url/capture_7171177006.png" alt={name} />
					</Flex>
				</HoverCardContent>
			</HoverCard>
			<Flex direction="row" gap="2" justify="start">
				{type !== 'Regular' && <Text variant="caps-sm">{type}</Text>}
				{status === 'sent' ? (
					<Badge variant="success" leftIcon={<MdOutlineCheck size={12} className="mr-0.5" />}>
						Sent
					</Badge>
				) : (
					<Badge variant="normal">{status}</Badge>
				)}
				{sendingType && <Badge variant="info">{sendingType}</Badge>}
			</Flex>
			<Flex direction="row" gap="1" align="center">
				{startDate && completedDate && (
					<>
						<Icon icon={<MdCalendarMonth />} fill="icon" size="sm" />
						<Text variant="body-xs" as="p" className="text-ink-light">
							{startDate} <br /> {completedDate}
						</Text>
					</>
				)}
				{createdDate && (
					<>
						<Icon icon={<MdCalendarMonth />} fill="icon" size="sm" />
						<Text variant="body-xs" as="p" className="text-ink-light">
							{createdDate}
						</Text>
					</>
				)}
			</Flex>
		</Flex>
	);
}
