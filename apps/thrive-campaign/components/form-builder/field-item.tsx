'use client';

import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import {
	MdDragIndicator,
	MdEdit,
	MdDelete,
	MdExpandMore,
	MdExpandLess,
	MdMoreVert,
} from 'react-icons/md';
import { Box, Text, Badge, IconButton } from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { FieldRenderer } from './field-types/field-renderer';
import { FieldOptionsPopover } from './field-options-popover';
import type { FormField } from '@/types/form-builder';

const DRAG_TYPE = 'FIELD_CANVAS';

interface DragItem {
	id: string;
	index: number;
	stepId: string;
}

interface FieldItemProps {
	field: FormField;
}

export function FieldItem({ field }: FieldItemProps) {
	const { steps, reorderFields } = useFormBuilderStore();
	const ref = useRef<HTMLDivElement>(null);
	const [isOptionsOpen, setIsOptionsOpen] = useState(false);

	// Find the current step and get fields in order
	const currentStep = steps.find(s => s.id === field.stepId);
	const stepFields = currentStep?.fields || [];

	const moveField = (dragFieldId: string, hoverFieldId: string) => {
		if (!currentStep) return;

		// Get current order of field IDs
		const fieldIds = stepFields.map(f => f.id);
		const dragIndex = fieldIds.indexOf(dragFieldId);
		const hoverIndex = fieldIds.indexOf(hoverFieldId);

		if (dragIndex === -1 || hoverIndex === -1) return;
		if (dragIndex === hoverIndex) return;

		// Create new order
		const newFieldIds = [...fieldIds];
		const [removed] = newFieldIds.splice(dragIndex, 1);
		newFieldIds.splice(hoverIndex, 0, removed);

		// Update order in store
		reorderFields(currentStep.id, newFieldIds);
	};

	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: DRAG_TYPE,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}

			// Only reorder within same step
			if (item.stepId !== field.stepId) {
				return;
			}

			const dragId = item.id;
			const hoverId = field.id;

			// Don't replace items with themselves
			if (dragId === hoverId) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Get current positions
			const dragIndex = stepFields.findIndex(f => f.id === dragId);
			const hoverIndex = stepFields.findIndex(f => f.id === hoverId);

			// Only perform the move when the mouse has crossed half of the items height
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Perform the move
			moveField(dragId, hoverId);

			// Update the index for next hover
			item.index = stepFields.findIndex(f => f.id === dragId);
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: DRAG_TYPE,
		item: () => {
			const index = stepFields.findIndex(f => f.id === field.id);
			return { id: field.id, index, stepId: field.stepId };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));

	const handleCardClick = (e: React.MouseEvent) => {
		// Don't open popover if clicking on drag handle
		const target = e.target as HTMLElement;
		if (target.closest('[data-drag-handle]')) {
			return;
		}
		setIsOptionsOpen(true);
	};

	return (
		<FieldOptionsPopover
			field={field}
			isOpen={isOptionsOpen}
			onOpenChange={setIsOptionsOpen}
			trigger={
				<div
					ref={ref}
					data-handler-id={handlerId}
					onClick={handleCardClick}
					className={`
						group border rounded-lg p-4 bg-white transition-all hover:border-gray-400 cursor-pointer
						${isDragging ? 'opacity-50' : ''}
						${isOptionsOpen ? 'border-primary ring-2 ring-primary/20' : ''}
					`}
				>
					{/* Field Header with Actions */}
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<div data-drag-handle className="cursor-move">
								<MdDragIndicator className="text-gray-400 flex-shrink-0" />
							</div>
							<Text className="font-semibold text-base">{field.name}</Text>
							{field.required && <span className="text-red-500 text-sm">*</span>}
						</div>

						{/* More icon appears on hover */}
						<div className="opacity-0 group-hover:opacity-100 transition-opacity">
							<MdMoreVert className="text-gray-500" />
						</div>
					</div>

					{/* Field Description */}
					{field.description && (
						<Text className="text-sm text-gray-600 mb-2">{field.description}</Text>
					)}

					{/* Field Preview (Input) */}
					<div className="mt-2">
						<FieldRenderer field={field} mode="builder" />
					</div>

					{/* Field Badges */}
					<div className="flex items-center gap-2 mt-3">
						{field.private && (
							<Badge size="sm" variant="outline" className="border-blue-500 text-blue-700 text-xs">
								Private
							</Badge>
						)}
						<Text className="text-xs text-gray-500 capitalize">{field.type}</Text>
					</div>
				</div>
			}
		/>
	);
}
