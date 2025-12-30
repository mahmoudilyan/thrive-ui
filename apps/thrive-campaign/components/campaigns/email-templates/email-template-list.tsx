'use client';

import { Flex, Heading, HStack, IconButton, Button, Text, Image } from '@chakra-ui/react';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';

import type { EmailTemplate } from '@/types/email-templates';
import { ColumnDef } from '@tanstack/react-table';
import EmailTemplateActions from '@/components/campaigns/email-templates/email-template-actions';
import { DataTable } from '@thrive/ui';

interface EmailTemplateListProps {
  initialData: EmailTemplate[];
}

export function EmailTemplateList({ initialData }: EmailTemplateListProps) {
  const columns: ColumnDef<EmailTemplate>[] = [
    {
      id: 'template',
      header: 'Template',
      accessorFn: row => ({
        label: row.template.label,
        type: row.template.type,
        thumb: row.thumb,
      }),
      cell: ({ row }) => {
        const template = row.original;
        return (
          <HStack gap={3}>
            <Image
              src={template.thumb}
              alt={template.template.label}
              width="50px"
              height="50px"
              objectFit="cover"
              borderRadius="md"
            />
            <Flex direction="column">
              <Text fontWeight="medium">{template.template.label}</Text>
              <Text fontSize="sm" color="gray.600">
                {template.template.type}
              </Text>
            </Flex>
          </HStack>
        );
      },
      enableHiding: false,
    },
    {
      id: 'created',
      header: 'Created',
      accessorFn: row => ({
        date: row.created_on,
        by: row.created_by,
      }),
      cell: ({ row }) => {
        const { created_on, created_by } = row.original;
        return (
          <Flex direction="column">
            <Text>{created_on}</Text>
            <Text fontSize="sm" color="gray.600">
              {created_by}
            </Text>
          </Flex>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        return <EmailTemplateActions template={row.original} />;
      },
      enableHiding: false,
    },
  ];

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>Email Templates</Heading>
        <HStack>
          <IconButton aria-label="More options" variant="secondary">
            <MdMoreHoriz />
          </IconButton>
          <Button variant="primary">
            <MdAdd />
            Create Template
          </Button>
        </HStack>
      </Flex>
      <DataTable<EmailTemplate> data={initialData} columns={columns} />
    </>
  );
}
