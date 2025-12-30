import { MdCalendarMonth } from 'react-icons/md';
import Link from 'next/link';
import { Flex, Badge, Text, Icon, Switch } from '@thrive/ui';

interface AutomationDetailsProps {
	name: string;
	status: number;
	createdDate?: string;
	completed?: string;
	pending?: string;
	folderName?: string;
}

export function AutomationDetails({
	name,
	status,
	createdDate,
	completed,
	pending,
	folderName,
}: AutomationDetailsProps) {
	return (
		<Flex direction="col" gap="2" className="max-w-[400px] py-2">
			<Text as="p" truncate className="max-w-[400px]">
				<Link href={`/automations/${name}`} className="font-medium">
					{name}
				</Link>
			</Text>
			<Flex direction="row" gap="2" justify="start" align="center">
				<Badge variant={status === 1 ? 'success' : 'normal'}>
					{status === 1 ? 'Active' : 'Inactive'}
				</Badge>
				{folderName && (
					<Text variant="body-xs" className="text-ink-light">
						{folderName}
					</Text>
				)}
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
