'use client';

import { Flex, Heading, HStack, IconButton, Button } from '@chakra-ui/react';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';

import type { Campaign } from '@/types/campaigns';
import { CampaignDetails } from './campaign-details';
import { TargetDetails } from './target-details';
import CampaignActions from './campaign-actions';
import CampaignStats from './campaign-stats';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { DataTable, Text } from '@thrive/ui';
interface CampaignListProps {
	initialData: Campaign[];
}

export function CampaignList({ initialData }: CampaignListProps) {
	const router = useRouter();
	const columns: ColumnDef<Campaign>[] = [
		{
			id: 'name',
			// Add a sortable header
			// Dropdown to filter by campaign name
			// Check if the column is sorted
			header: 'Campaign',
			accessorFn: row => ({
				name: row.campaign.name,
				status: row.type === 'draft' ? 'Draft' : 'Regular',
				sendingType: row.campaign.status.scheduled ? 'Predictive Sending' : undefined,
				startDate: row.startsenddate,
				completedDate: row.endsenddate,
				createdDate: row.date,
			}),
			cell: ({ row }) => {
				const campaignData = row.original;
				return (
					<CampaignDetails
						name={campaignData.campaign.name}
						type={campaignData.campaign.type === 'ab' ? 'A/B Campaign' : 'Regular'}
						status={campaignData.campaign.status.name as 'draft' | 'sent' | 'paused'}
						sendingType={campaignData.labels.warmup ? 'Predictive Sending' : undefined}
						startDate={campaignData.startsenddate}
						completedDate={campaignData.endsenddate}
						createdDate={campaignData.date}
					/>
				);
			},
			enableHiding: false,
		},
		{
			id: 'subject',
			header: 'Subject',
			accessorFn: row => row.campaign.subject,
			cell: ({ row }) => (
				<Text truncate className="max-w-[200px]" variant="body-sm">
					{row.getValue('subject')}
				</Text>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			id: 'target',
			header: 'Target',
			accessorFn: row => ({
				lists: row.target.lists,
				audience: row.target.audiences,
			}),
			cell: ({ row }) => {
				return (
					<TargetDetails
						lists={row.original.target.lists}
						audiences={row.original.target.audiences}
					/>
				);
			},
		},
		{
			id: 'stats',
			header: 'Details',
			accessorFn: row => ({
				total: row.target.total,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				totalA: row.target.a,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				totalB: row.target.b,
				opened: row.campaign.details.email_opened,
				clicked: row.campaign.details.link_clicked,
				campaignInfo: {
					from: row.campaign.from,
					replyTo: row.campaign.replyto,
					subject: row.campaign.subject,
					fromName: row.campaign.fromname,
					status: row.campaign.status.name as 'draft' | 'sent' | 'scheduled',
				},
			}),
			cell: ({ row }) => {
				const stats = row.getValue('stats');
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				return <CampaignStats stats={stats} campaignInfo={stats.campaignInfo} />;
			},
			enableSorting: false,
		},
		{
			id: 'actions',
			header: '',
			cell: ({ row }) => {
				return <CampaignActions campaignData={row.original} />;
			},
			enableHiding: false,
		},
	];

	return (
		<>
			<Flex justify="space-between" align="center" mb={4}>
				<Heading>Campaigns</Heading>
				<HStack>
					<IconButton aria-label="More options" variant="secondary">
						<MdMoreHoriz />
					</IconButton>
					<Button variant="primary" onClick={() => router.push('/campaigns/create')}>
						<MdAdd />
						Create Campaign
					</Button>
				</HStack>
			</Flex>
			<DataTable data={initialData} columns={columns} />
		</>
	);
}
