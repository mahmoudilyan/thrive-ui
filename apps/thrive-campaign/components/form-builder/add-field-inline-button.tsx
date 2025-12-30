'use client';

import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { AddFieldPopover } from './add-field-popover';
import { IconButton } from '@thrive/ui';

interface AddFieldInlineButtonProps {
	stepId: string;
	position?: 'between' | 'end';
	beforeFieldId?: string;
}

export function AddFieldInlineButton({
	stepId,
	position = 'between',
	beforeFieldId,
}: AddFieldInlineButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const trigger = (
		<div className="w-full flex items-center justify-center py-1 group">
			<IconButton
				variant="ghost"
				data-active={isOpen}
				className={`
					${
						isOpen
							? 'opacity-100'
							: position === 'between'
								? 'opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-400'
								: 'opacity-100 hover:bg-gray-100 text-gray-400'
					}
				`}
				aria-label="Add field"
				icon={<MdAdd className="text-xl" />}
			/>
		</div>
	);

	return (
		<AddFieldPopover
			stepId={stepId}
			trigger={trigger}
			position={position}
			isOpen={isOpen}
			onOpenChange={setIsOpen}
		/>
	);
}
