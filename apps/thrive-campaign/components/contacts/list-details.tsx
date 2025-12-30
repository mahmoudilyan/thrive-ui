import { MdCalendarMonth } from 'react-icons/md';
import Link from 'next/link';
import { HoverCard, HoverCardContent, HoverCardTrigger, Flex, Text, Icon, Badge } from '@thrive/ui';

interface ListDetailsProps {
	name: string;
	contactsCount: string | number;
	confirmed: string | number;
	unconfirmed: string | number;
	unsubscribed: string | number;
	bounced: string | number;
	complaints: string | number;
	createdDate?: string;
	folderName?: string;
}

export function ListDetails({
	name,
	contactsCount,
	confirmed,
	unconfirmed,
	unsubscribed,
	bounced,
	complaints,
	createdDate,
	folderName,
}: ListDetailsProps) {
	return (
		<Flex direction="col" gap="2" className="max-w-[400px] py-2">
			<HoverCard>
				<HoverCardTrigger asChild>
					<Text as="p" truncate className="max-w-[400px]">
						<Link href={`/contacts/lists/${name}`} className="font-medium">
							{name}
						</Link>
					</Text>
				</HoverCardTrigger>
				<HoverCardContent className="p-4 min-w-[250px]">
					<Flex direction="col" gap="3">
						<Text variant="body-md" fontWeight="semibold">
							Contact Breakdown
						</Text>
						<Flex direction="col" gap="2">
							<Flex justify="between">
								<Text variant="body-sm" className="text-ink-light">
									Total Contacts:
								</Text>
								<Text variant="body-sm" fontWeight="medium">
									{contactsCount}
								</Text>
							</Flex>
							<Flex justify="between">
								<Text variant="body-sm" className="text-ink-light">
									Confirmed:
								</Text>
								<Text variant="body-sm" fontWeight="medium" className="text-green-600">
									{confirmed}
								</Text>
							</Flex>
							<Flex justify="between">
								<Text variant="body-sm" className="text-ink-light">
									Unconfirmed:
								</Text>
								<Text variant="body-sm" fontWeight="medium" className="text-yellow-600">
									{unconfirmed}
								</Text>
							</Flex>
							<Flex justify="between">
								<Text variant="body-sm" className="text-ink-light">
									Unsubscribed:
								</Text>
								<Text variant="body-sm" fontWeight="medium" className="text-gray-600">
									{unsubscribed}
								</Text>
							</Flex>
							<Flex justify="between">
								<Text variant="body-sm" className="text-ink-light">
									Bounced:
								</Text>
								<Text variant="body-sm" fontWeight="medium" className="text-red-600">
									{bounced}
								</Text>
							</Flex>
							<Flex justify="between">
								<Text variant="body-sm" className="text-ink-light">
									Complaints:
								</Text>
								<Text variant="body-sm" fontWeight="medium" className="text-red-700">
									{complaints}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</HoverCardContent>
			</HoverCard>
			<Flex direction="row" gap="2" justify="start" align="center">
				<Text variant="body-sm" className="text-ink-light">
					{contactsCount} contacts
				</Text>
				{folderName && <Badge variant="normal">{folderName}</Badge>}
			</Flex>
			{createdDate && (
				<Flex direction="row" gap="1" align="center">
					<Icon icon={<MdCalendarMonth />} fill="icon" size="sm" />
					<Text variant="body-xs" as="p" className="text-ink-light">
						{createdDate}
					</Text>
				</Flex>
			)}
		</Flex>
	);
}
