'use client';

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { MdAdd, MdImage, MdClose } from 'react-icons/md';
import { Box, Text, Input, Button, Flex, IconButton } from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { FieldItem } from './field-item';
import { StepManager } from './step-manager';
import { AddFieldInlineButton } from './add-field-inline-button';
import type { FormField, FieldTypeDefinition } from '@/types/form-builder';

const DRAG_TYPE_PALETTE = 'FIELD_PALETTE';
const DRAG_TYPE_CANVAS = 'FIELD_CANVAS';

export function FormCanvas() {
	const {
		formTitle,
		formLogo,
		fields,
		steps,
		setFormField,
		addField,
		selectField,
		submitButtonLabel,
		nextButtonLabel,
		previousButtonLabel,
		afterSubmitLabel,
	} = useFormBuilderStore();

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const defaultStep = steps.find(s => s.isDefault) || steps[0];
	const customSteps = steps.filter(s => !s.isDefault);
	const hasMultipleSteps = customSteps.length > 0;

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormField('formTitle', e.target.value);
	};

	const handleTitleClick = () => {
		setIsEditingTitle(true);
		setTimeout(() => {
			titleInputRef.current?.focus();
			titleInputRef.current?.select();
		}, 0);
	};

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === 'Escape') {
			setIsEditingTitle(false);
		}
	};

	const handleLogoUpload = () => {
		// TODO: Implement file manager integration
		console.log('Upload logo');
	};

	const handleRemoveLogo = () => {
		setFormField('formLogo', '');
	};

	return (
		<Box className="h-full rounded-lg bg-white overflow-hidden flex flex-col">
			{/* Header */}
			<Box className="p-4 space-y-4">
				{/* Logo Section */}
				<Box>
					<Text className="text-sm font-medium mb-2">Form Logo</Text>
					{formLogo ? (
						<Box className="relative w-32 h-32 border border-border rounded-lg overflow-hidden group">
							<img
								src={formLogo}
								alt="Form logo"
								className="w-full h-full object-contain bg-gray-50"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
								<Button size="sm" variant="secondary" onClick={handleLogoUpload}>
									Change
								</Button>
								<IconButton
									size="sm"
									variant="secondary"
									onClick={handleRemoveLogo}
									aria-label="Remove logo"
								>
									<MdClose />
								</IconButton>
							</div>
						</Box>
					) : (
						<button
							onClick={handleLogoUpload}
							className="w-32 h-32 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-gray-50 transition-colors"
						>
							<MdImage className="text-2xl text-gray-400" />
							<Text className="text-xs text-gray-600">Add Logo</Text>
						</button>
					)}
				</Box>

				{/* Form Title - Inline Editable */}
				<div>
					{isEditingTitle ? (
						<Input
							ref={titleInputRef}
							value={formTitle}
							onChange={handleTitleChange}
							onBlur={handleTitleBlur}
							onKeyDown={handleTitleKeyDown}
							placeholder="Untitled Form"
							className="text-2xl font-bold border-0 p-0 focus:outline-none focus:ring-0"
						/>
					) : (
						<div
							onClick={handleTitleClick}
							className="text-2xl font-bold cursor-text hover:bg-gray-50 px-2 py-1 rounded -ml-2 transition-colors min-h-[2.5rem] flex items-center"
						>
							{formTitle || <span className="text-gray-400">Click to add form title</span>}
						</div>
					)}
				</div>
			</Box>

			{/* Form Fields Area */}
			<Box className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Default Step Fields */}
				{!hasMultipleSteps && (
					<DropZone stepId={defaultStep?.id || 'step-0'}>
						{defaultStep?.fields.map((field, index) => (
							<React.Fragment key={field.id}>
								{/* Add button before first field */}
								{index === 0 && (
									<AddFieldInlineButton
										stepId={defaultStep?.id || 'step-0'}
										position="between"
										beforeFieldId={field.id}
									/>
								)}
								<FieldItem field={field} />
								{/* Add button after each field */}
								<AddFieldInlineButton stepId={defaultStep?.id || 'step-0'} position="between" />
							</React.Fragment>
						))}
						{/* If no fields, show one add button */}
						{defaultStep?.fields.length === 0 && (
							<AddFieldInlineButton stepId={defaultStep?.id || 'step-0'} position="end" />
						)}
					</DropZone>
				)}

				{/* Multi-step Sections */}
				{hasMultipleSteps && <StepManager />}

				{/* Add Step Button */}
				<Box className="mt-4">
					{/* <Button
						variant="secondary"
						onClick={() => {
							const store = useFormBuilderStore.getState();
							const customSteps = store.steps.filter(s => !s.isDefault);

							// If this is the first time adding steps, convert single form to multi-step
							if (customSteps.length === 0) {
								store.convertToMultiStep();
							} else {
								// Add another step with incremented number
								const stepNumber = customSteps.length + 1;
								store.addStep({ title: `Step ${stepNumber}`, description: '', fields: [] });
							}
						}}
						className="w-full"
					>
						<MdAdd className="mr-2" />
						Add New Step
					</Button> */}
				</Box>

				{/* Button Labels Configuration */}
				<Box className="mt-6 pt-6 border-t border-border">
					<Text className="text-sm font-medium mb-3">Button Labels</Text>
					<div className="space-y-3">
						{hasMultipleSteps && (
							<div>
								<label className="text-xs text-gray-600 block mb-1">Previous Button</label>
								<Input
									value={previousButtonLabel}
									onChange={e => setFormField('previousButtonLabel', e.target.value)}
									placeholder="Previous"
									className="text-sm"
								/>
							</div>
						)}
						{hasMultipleSteps && (
							<div>
								<label className="text-xs text-gray-600 block mb-1">Next Button</label>
								<Input
									value={nextButtonLabel}
									onChange={e => setFormField('nextButtonLabel', e.target.value)}
									placeholder="Next"
									className="text-sm"
								/>
							</div>
						)}
						<div>
							<label className="text-xs text-gray-600 block mb-1">Submit Button</label>
							<Input
								value={submitButtonLabel}
								onChange={e => setFormField('submitButtonLabel', e.target.value)}
								placeholder="Submit"
								className="text-sm"
							/>
						</div>
						<div>
							<label className="text-xs text-gray-600 block mb-1">After Submit Label</label>
							<Input
								value={afterSubmitLabel}
								onChange={e => setFormField('afterSubmitLabel', e.target.value)}
								placeholder="< Back to Form"
								className="text-sm"
							/>
						</div>
					</div>
				</Box>
			</Box>
		</Box>
	);
}

interface DropZoneProps {
	stepId: string;
	children: React.ReactNode;
}

export function DropZone({ stepId, children }: DropZoneProps) {
	const { addField, updateField } = useFormBuilderStore();
	const dropRef = useRef<HTMLDivElement>(null);

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: [DRAG_TYPE_PALETTE, DRAG_TYPE_CANVAS],
			drop: (item: any, monitor) => {
				// Check if it's from palette or canvas
				const itemType = monitor.getItemType();

				if (itemType === DRAG_TYPE_CANVAS) {
					// Moving existing field to different step
					const { id: fieldId, stepId: fromStepId } = item;

					if (fromStepId !== stepId) {
						// Update field's step (updateField now handles moving between steps)
						updateField(fieldId, { stepId });
					}
				} else if (itemType === DRAG_TYPE_PALETTE) {
					// Adding new field from palette
					const { field: fieldData } = item;
					console.log(fieldData);
					if ('type' in fieldData) {
						// It's a FieldTypeDefinition (new field)
						const newField: Omit<FormField, 'id' | 'order'> = {
							type: fieldData.type,
							name: fieldData.label,
							description: fieldData.description || '',
							placeholder: '',
							defaultValue: '',
							required: false,
							private: false,
							options: getDefaultOptionsForFieldType(fieldData.type),
						};

						console.log(newField);
						addField(newField, stepId);
					} else {
						// It's an existing FormField
						addField(fieldData, stepId);
					}
				}
			},
			collect: monitor => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
		}),
		[stepId, addField, updateField]
	);

	drop(dropRef);

	const hasFields = React.Children.count(children) > 0;

	return (
		<div
			ref={dropRef}
			className={`
				p-4 transition-colors
				${isOver && canDrop ? 'border-primary bg-primary/5' : 'border-gray-300'}
				${!hasFields ? 'flex items-center justify-center' : ''}
			`}
		>
			{hasFields ? (
				<div className="space-y-2">{children}</div>
			) : (
				<div className="text-center">
					<Text className="text-gray-500 text-sm">Drag fields here to add them to your form</Text>
				</div>
			)}
		</div>
	);
}

function getDefaultOptionsForFieldType(type: string): any[] {
	if (['select', 'radio', 'checkbox'].includes(type)) {
		return [
			{ label: 'Option 1', value: 'option-1' },
			{ label: 'Option 2', value: 'option-2' },
			{ label: 'Option 3', value: 'option-3' },
		];
	}

	if (type === 'gdpr') {
		return [
			{
				label: 'You agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.',
				value: 'gdpr',
				required: true,
				default: false,
			},
			{
				label: 'You agree to receive our Newsletter',
				value: 'newsletter',
				required: false,
				default: false,
			},
		];
	}

	return [];
}
