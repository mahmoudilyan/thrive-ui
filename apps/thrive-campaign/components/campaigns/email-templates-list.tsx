'use client';

import { Flex, Heading, HStack, IconButton, Button, Text } from '@chakra-ui/react';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';

import type { Campaign } from '@/types/campaigns';
import { CampaignDetails } from './campaign-details';
import { TargetDetails } from './target-details';
import CampaignActions from './campaign-actions';
import CampaignStats from './campaign-stats';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@thrive/ui';

interface CampaignListProps {
	initialData: Campaign[];
}

export function CampaignList({ initialData }: CampaignListProps) {
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
				<Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxW="200px">
					{row.getValue('subject')}
				</Text>
			),
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
				total: row.target.total ?? 0,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				totalA: row.target.a ?? 0,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				totalB: row.target.b ?? 0,
				opened: {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					r: row.campaign.details.email_opened?.r ?? 0,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					a: row.campaign.details.email_opened?.a ?? 0,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					b: row.campaign.details.email_opened?.b ?? 0,
				},
				clicked: {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					r: row.campaign.details.link_clicked?.r ?? 0,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					a: row.campaign.details.link_clicked?.a ?? 0,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					b: row.campaign.details.link_clicked?.b ?? 0,
				},
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
					<Button variant="primary">
						<MdAdd />
						Create Campaign
					</Button>
				</HStack>
			</Flex>
			<DataTable data={initialData} columns={columns} />
		</>
	);
}
