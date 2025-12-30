'use client';

import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { MdDragIndicator, MdExpandMore, MdExpandLess, MdSearch } from 'react-icons/md';
import { Box, Text, Input, Flex, Icon } from '@thrive/ui';
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import type {
	DefaultFieldGroup,
	FieldsByList,
	FieldTypeDefinition,
	FormField,
} from '@/types/form-builder';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';

const DRAG_TYPE = 'FIELD_PALETTE';

interface DraggableFieldItemProps {
	field: FormField | FieldTypeDefinition;
	disabled?: boolean;
	sourceListId?: string;
}

function DraggableFieldItem({ field, disabled, sourceListId }: DraggableFieldItemProps) {
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: DRAG_TYPE,
			item: { field, sourceListId },
			canDrag: !disabled,
			collect: monitor => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[field, disabled, sourceListId]
	);

	const fieldName = 'name' in field ? field.name : field.label;
	const fieldType = 'type' in field ? field.type : '';

	return (
		<div
			ref={drag}
			className={`
				flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
				${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
				${isDragging ? 'opacity-50' : ''}
			`}
		>
			{!disabled && <MdDragIndicator className="text-gray-400 flex-shrink-0" />}
			<div className="flex items-center gap-2 flex-1 min-w-0">
				<Box className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
					{/* Field icon would go here */}
					<div className="w-4 h-4 bg-gray-300 rounded" />
				</Box>
				<Text className="text-sm truncate">{fieldName}</Text>
			</div>
		</div>
	);
}

interface AccordionSectionProps {
	title: string;
	children: React.ReactNode;
	searchable?: boolean;
	defaultOpen?: boolean;
}

function AccordionSection({
	title,
	children,
	searchable,
	defaultOpen = false,
}: AccordionSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [searchTerm, setSearchTerm] = useState('');

	return (
		<Box className="border-b border-border">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
			>
				<Text className="font-semibold text-sm">{title}</Text>
				{isOpen ? <MdExpandLess /> : <MdExpandMore />}
			</button>
			{isOpen && (
				<Box className="px-3 pb-3">
					{searchable && (
						<Box className="mb-2">
							<Input
								placeholder="Search fields..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								size="sm"
							/>
						</Box>
					)}
					<Box className="space-y-1">{children}</Box>
				</Box>
			)}
		</Box>
	);
}

export function FieldPalette() {
	const { fields: existingFields } = useFormBuilderStore();

	// Fetch default fields
	const { data: defaultFieldsData } = useApi<{ groups: DefaultFieldGroup[] }>(
		API_CONFIG.formBuilder.getDefaultFields,
		{ enabled: true }
	);

	// Fetch fields by list
	const { data: fieldsByListData } = useApi<{ lists: FieldsByList[] }>(
		API_CONFIG.formBuilder.getFieldsByList,
		{ enabled: true }
	);

	// Fetch available field types - using static import since it's a local JSON file
	const [fieldTypesData, setFieldTypesData] = useState<{
		fieldTypes: FieldTypeDefinition[];
	} | null>(null);

	useEffect(() => {
		import('@/mock/form-builder/form-fields.json').then(data => {
			setFieldTypesData(data.default || data);
		});
	}, []);

	const existingFieldIds = new Set(existingFields.map(f => f.id));

	return (
		<Box className="h-full border border-border rounded-lg bg-white overflow-hidden flex flex-col">
			<Box className="p-3 border-b border-border">
				<Text className="font-semibold">Field Library</Text>
			</Box>

			<Box className="flex-1 overflow-y-auto">
				{/* Default Fields */}
				<AccordionSection title="Default Fields" searchable defaultOpen>
					{defaultFieldsData?.groups.map(group => (
						<Box key={group.id} className="mb-3">
							<Text className="text-xs font-semibold text-gray-600 mb-1 px-2">{group.name}</Text>
							{group.fields.map(field => (
								<DraggableFieldItem
									key={field.id}
									field={field}
									disabled={existingFieldIds.has(field.id)}
								/>
							))}
						</Box>
					))}
				</AccordionSection>

				{/* Fields by List */}
				<AccordionSection title="Fields by List" searchable>
					{fieldsByListData?.lists.map(list => (
						<Box key={list.listId} className="mb-3">
							<Text className="text-xs font-semibold text-gray-600 mb-1 px-2">{list.listName}</Text>
							{list.fields.map(field => (
								<DraggableFieldItem
									key={field.id}
									field={field}
									disabled={existingFieldIds.has(field.id)}
									sourceListId={list.listId}
								/>
							))}
						</Box>
					))}
				</AccordionSection>

				{/* Create New Field */}
				<AccordionSection title="Create New Field">
					{fieldTypesData?.fieldTypes
						.filter(ft => ft.category !== 'payment')
						.map(fieldType => {
							const isDisabled =
								fieldType.unique && existingFields.some(f => f.type === fieldType.type);

							return (
								<DraggableFieldItem key={fieldType.type} field={fieldType} disabled={isDisabled} />
							);
						})}
				</AccordionSection>

				{/* Payment Fields */}
				{fieldTypesData?.fieldTypes.some(ft => ft.category === 'payment') && (
					<AccordionSection title="Payment Fields">
						{fieldTypesData?.fieldTypes
							.filter(ft => ft.category === 'payment')
							.map(fieldType => {
								const isDisabled =
									fieldType.unique && existingFields.some(f => f.type === fieldType.type);

								return (
									<DraggableFieldItem
										key={fieldType.type}
										field={fieldType}
										disabled={isDisabled}
									/>
								);
							})}
					</AccordionSection>
				)}
			</Box>
		</Box>
	);
}
