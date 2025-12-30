'use client';

import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier } from 'dnd-core';
import { MdDragIndicator, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { Box, Text, Input, IconButton, Flex } from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { FieldItem } from './field-item';
import { DropZone } from './form-canvas';
import { AddFieldInlineButton } from './add-field-inline-button';
import type { FormStep } from '@/types/form-builder';

const DRAG_TYPE = 'STEP';

interface DragItem {
	id: string;
	index: number;
}

interface StepCardProps {
	step: FormStep;
	index: number;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

function StepCard({ step, index, isExpanded, onToggleExpand }: StepCardProps) {
	const { updateStep, removeStep, reorderSteps, steps } = useFormBuilderStore();
	const ref = useRef<HTMLDivElement>(null);

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
			const dragIndex = item.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex) {
				return;
			}

			const hoverBoundingRect = ref.current?.getBoundingClientRect();
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			const clientOffset = monitor.getClientOffset();
			const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Reorder steps
			const newSteps = [...steps];
			const dragStep = newSteps[dragIndex];
			newSteps.splice(dragIndex, 1);
			newSteps.splice(hoverIndex, 0, dragStep);

			reorderSteps(newSteps.map(s => s.id));
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: DRAG_TYPE,
		item: () => {
			return { id: step.id, index };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (step.fields.length > 0) {
			alert('Please remove or move all fields from this step before deleting it.');
			return;
		}
		if (confirm('Are you sure you want to delete this step?')) {
			removeStep(step.id);
		}
	};

	const toggleExpand = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggleExpand();
	};

	return (
		<div
			ref={ref}
			data-handler-id={handlerId}
			className={`
				border rounded-lg bg-white mb-3 transition-all
				${isDragging ? 'opacity-50' : ''}
				${isExpanded ? 'p-4' : 'p-3'}
			`}
		>
			{/* Step Header */}
			<div className={`flex items-center gap-2 ${isExpanded ? 'mb-3' : ''}`}>
				<MdDragIndicator className="text-gray-400 cursor-move flex-shrink-0" />

				<div className="flex-1 space-y-2">
					<Input
						value={step.title}
						onChange={e => updateStep(step.id, { title: e.target.value })}
						placeholder="Step Title"
						size="sm"
						className="font-semibold"
					/>
					<Input
						value={step.description || ''}
						onChange={e => updateStep(step.id, { description: e.target.value })}
						placeholder="Step Description (optional)"
						size="sm"
						className="text-sm"
					/>
				</div>

				<div className="flex items-center gap-1">
					<IconButton
						size="sm"
						variant="ghost"
						onClick={toggleExpand}
						aria-label={isExpanded ? 'Collapse' : 'Expand'}
					>
						{isExpanded ? <MdExpandLess /> : <MdExpandMore />}
					</IconButton>
					<IconButton
						size="sm"
						variant="ghost"
						onClick={handleDelete}
						aria-label="Delete step"
						className="text-red-600 hover:bg-red-50"
					>
						<MdDelete />
					</IconButton>
				</div>
			</div>

			{/* Step Fields */}
			{isExpanded && (
				<DropZone stepId={step.id}>
					{step.fields.map((field, index) => (
						<React.Fragment key={field.id}>
							{/* Add button before first field */}
							{index === 0 && (
								<AddFieldInlineButton
									stepId={step.id}
									position="between"
									beforeFieldId={field.id}
								/>
							)}
							<FieldItem field={field} />
							{/* Add button after each field */}
							<AddFieldInlineButton stepId={step.id} position="between" />
						</React.Fragment>
					))}
					{/* If no fields, show one add button */}
					{step.fields.length === 0 && <AddFieldInlineButton stepId={step.id} position="end" />}
				</DropZone>
			)}
		</div>
	);
}

export function StepManager() {
	const { steps } = useFormBuilderStore();
	const customSteps = steps.filter(s => !s.isDefault);
	const [expandedStepId, setExpandedStepId] = useState<string | null>(
		customSteps[0]?.id || null
	);

	return (
		<Box className="space-y-3">
			<Text className="font-semibold mb-2">Form Steps</Text>
			{customSteps.map((step, index) => (
				<StepCard
					key={step.id}
					step={step}
					index={index}
					isExpanded={expandedStepId === step.id}
					onToggleExpand={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
				/>
			))}
		</Box>
	);
}
