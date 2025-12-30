'use client';

import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { Button, Box, Text } from '@thrive/ui';
import { AddFieldModal } from './add-field-modal';

export function FieldPaletteButton() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Box className="flex items-center justify-between mb-4">
				<Text className="font-semibold text-sm text-gray-700">Form Fields</Text>
				<Button
					size="sm"
					variant="primary"
					onClick={() => setIsModalOpen(true)}
					className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
				>
					<MdAdd className="text-lg" />
				</Button>
			</Box>

			<AddFieldModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</>
	);
}

