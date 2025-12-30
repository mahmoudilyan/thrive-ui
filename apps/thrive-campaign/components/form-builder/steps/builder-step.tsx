'use client';

import { useState } from 'react';
import { Box, Flex, Button, Tabs } from '@thrive/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MdVisibility, MdEdit } from 'react-icons/md';

import { FormCanvas } from '../form-canvas';
import { FormPreview } from '../form-preview';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';

interface BuilderStepProps {
	onNext?: () => void;
}

export function BuilderStep({ onNext }: BuilderStepProps) {
	const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

	return (
		<DndProvider backend={HTML5Backend}>
			<Box className="space-y-4">
				{/* View Mode Toggle */}
				<Flex className="justify-end gap-2">
					<Button
						size="sm"
						variant={viewMode === 'edit' ? 'primary' : 'secondary'}
						onClick={() => setViewMode('edit')}
					>
						<MdEdit className="mr-2" />
						Edit
					</Button>
					<Button
						size="sm"
						variant={viewMode === 'preview' ? 'primary' : 'secondary'}
						onClick={() => setViewMode('preview')}
					>
						<MdVisibility className="mr-2" />
						Preview
					</Button>
				</Flex>

				{/* Content Area */}
				{viewMode === 'edit' ? (
					<Box className="h-full min-h-[600px]">
						{/* Form Canvas - Full Width */}
						<FormCanvas />
					</Box>
				) : (
					<Box className="min-h-[600px] bg-gray-50 p-8">
						<FormPreview />
					</Box>
				)}
			</Box>
		</DndProvider>
	);
}
