'use client';

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { MdDragIndicator, MdSearch, MdAdd, MdClose } from 'react-icons/md';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Box,
	Text,
	Input,
	Button,
} from '@thrive/ui';
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

interface AddFieldModalProps {
	isOpen: boolean;
	onClose: () => void;
	targetStepId?: string;
	insertBeforeFieldId?: string;
}

interface DraggableFieldItemProps {
	field: FormField | FieldTypeDefinition;
	disabled?: boolean;
	sourceListId?: string;
	onAdd: () => void;
}

function DraggableFieldItem({ field, disabled, sourceListId, onAdd }: DraggableFieldItemProps) {
	const { addField } = useFormBuilderStore();

	const handleClick = () => {
		if (disabled) return;

		// Add field directly when clicked (not dragged)
		const fieldData = field;

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
			addField(newField, sourceListId);
		} else {
			// It's an existing FormField
			addField(fieldData, sourceListId);
		}

		onAdd();
	};

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: DRAG_TYPE,
			item: { field, sourceListId },
			canDrag: !disabled,
			collect: monitor => ({
				isDragging: monitor.isDragging(),
			}),
			end: (item, monitor) => {
				if (monitor.didDrop()) {
					onAdd();
				}
			},
		}),
		[field, disabled, sourceListId, onAdd]
	);

	const fieldName = 'name' in field ? field.name : field.label;
	const fieldIcon = 'icon' in field ? field.icon : '/assets/images/svg/other-icons/input.svg';

	return (
		<div
			ref={drag}
			onClick={handleClick}
			className={`
				flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors
				${disabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-100'}
				${isDragging ? 'opacity-50' : ''}
			`}
		>
			{!disabled && <MdDragIndicator className="text-gray-400 flex-shrink-0" />}
			<div className="flex items-center gap-2 flex-1 min-w-0">
				<div className="w-4 h-4 flex-shrink-0 text-gray-600">
					<div className="w-4 h-4 bg-gray-300 rounded" />
				</div>
				<Text className="text-sm font-medium truncate">{fieldName}</Text>
			</div>
		</div>
	);
}

export function AddFieldModal({
	isOpen,
	onClose,
	targetStepId,
	insertBeforeFieldId,
}: AddFieldModalProps) {
	const { fields: existingFields } = useFormBuilderStore();
	const [activeTab, setActiveTab] = useState<'default' | 'lists' | 'new' | 'payment'>('default');
	const [searchTerm, setSearchTerm] = useState('');

	// Fetch default fields
	const { data: defaultFieldsData } = useApi<{ groups: DefaultFieldGroup[] }>(
		API_CONFIG.formBuilder.getDefaultFields,
		{ enabled: isOpen }
	);

	// Fetch fields by list
	const { data: fieldsByListData } = useApi<{ lists: FieldsByList[] }>(
		API_CONFIG.formBuilder.getFieldsByList,
		{ enabled: isOpen }
	);

	// Fetch available field types
	const [fieldTypesData, setFieldTypesData] = useState<{
		fieldTypes: FieldTypeDefinition[];
	} | null>(null);

	React.useEffect(() => {
		if (isOpen) {
			import('@/mock/form-builder/form-fields.json').then(data => {
				setFieldTypesData(data.default || data);
			});
		}
	}, [isOpen]);

	const existingFieldIds = new Set(existingFields.map(f => f.id));

	// Filter fields based on search
	const filterBySearch = (name: string) => {
		if (!searchTerm) return true;
		return name.toLowerCase().includes(searchTerm.toLowerCase());
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-sm max-h-[600px] p-0">
				<DialogHeader className="px-4 pt-4 pb-2 flex items-center justify-between">
					<DialogTitle className="text-base font-semibold">Add Field</DialogTitle>
				</DialogHeader>

				{/* Search Bar */}
				<Box className="px-4 pt-2">
					<div className="relative">
						<MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search for a field"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</Box>

				{/* Tabs */}
				<div className="flex border-b border-border px-4 mt-3">
					<TabButton active={activeTab === 'default'} onClick={() => setActiveTab('default')}>
						Default Fields
					</TabButton>
					<TabButton active={activeTab === 'lists'} onClick={() => setActiveTab('lists')}>
						From Lists
					</TabButton>
					<TabButton active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
						Create New
					</TabButton>
					<TabButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')}>
						Payment
					</TabButton>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto px-4 pb-4 min-h-[300px] max-h-[400px]">
					{/* Default Fields Tab */}
					{activeTab === 'default' && (
						<div className="space-y-4 pt-3">
							{defaultFieldsData?.groups.map(group => {
								const visibleFields = group.fields.filter(f => filterBySearch(f.name));
								if (visibleFields.length === 0) return null;

								return (
									<div key={group.id}>
										<Text className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">
											{group.name}
										</Text>
										{visibleFields.map(field => (
											<DraggableFieldItem
												key={field.id}
												field={field}
												disabled={existingFieldIds.has(field.id)}
												onAdd={onClose}
											/>
										))}
									</div>
								);
							})}
							{!defaultFieldsData && (
								<div className="text-center py-8 text-gray-500 text-sm">Loading fields...</div>
							)}
						</div>
					)}

					{/* Fields by List Tab */}
					{activeTab === 'lists' && (
						<div className="space-y-4 pt-3">
							{fieldsByListData?.lists.map(list => {
								const visibleFields = list.fields.filter(f => filterBySearch(f.name));
								if (visibleFields.length === 0) return null;

								return (
									<div key={list.listId}>
										<Text className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">
											{list.listName}
										</Text>
										{visibleFields.map(field => (
											<DraggableFieldItem
												key={field.id}
												field={field}
												disabled={existingFieldIds.has(field.id)}
												sourceListId={list.listId}
												onAdd={onClose}
											/>
										))}
									</div>
								);
							})}
							{!fieldsByListData && (
								<div className="text-center py-8 text-gray-500 text-sm">Loading fields...</div>
							)}
						</div>
					)}

					{/* Create New Field Tab */}
					{activeTab === 'new' && (
						<div className="space-y-2 pt-3">
							{fieldTypesData?.fieldTypes
								.filter(ft => ft.category !== 'payment' && filterBySearch(ft.label))
								.map(fieldType => {
									const isDisabled =
										fieldType.unique && existingFields.some(f => f.type === fieldType.type);

									return (
										<DraggableFieldItem
											key={fieldType.type}
											field={fieldType}
											disabled={isDisabled}
											onAdd={onClose}
										/>
									);
								})}
							{!fieldTypesData && (
								<div className="text-center py-8 text-gray-500 text-sm">Loading fields...</div>
							)}
						</div>
					)}

					{/* Payment Fields Tab */}
					{activeTab === 'payment' && (
						<div className="space-y-2 pt-3">
							{fieldTypesData?.fieldTypes
								.filter(ft => ft.category === 'payment' && filterBySearch(ft.label))
								.map(fieldType => {
									const isDisabled =
										fieldType.unique && existingFields.some(f => f.type === fieldType.type);

									return (
										<DraggableFieldItem
											key={fieldType.type}
											field={fieldType}
											disabled={isDisabled}
											onAdd={onClose}
										/>
									);
								})}
							{!fieldTypesData && (
								<div className="text-center py-8 text-gray-500 text-sm">Loading fields...</div>
							)}
							{fieldTypesData?.fieldTypes.filter(ft => ft.category === 'payment').length === 0 && (
								<div className="text-center py-8 text-gray-500 text-sm">
									No payment fields available
								</div>
							)}
						</div>
					)}

					{/* No Results */}
					{searchTerm && activeTab === 'default' && (
						<>
							{defaultFieldsData?.groups.every(
								g => g.fields.filter(f => filterBySearch(f.name)).length === 0
							) && (
								<div className="text-center py-8 text-gray-500 text-sm">
									No fields found matching "{searchTerm}"
								</div>
							)}
						</>
					)}
				</div>

				{/* Footer with Create New Field button */}
				<div className="border-t border-border p-4">
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={() => setActiveTab('new')}
					>
						<MdAdd className="mr-2" />
						Create field
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface TabButtonProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`
				px-3 py-2 text-sm font-medium transition-colors relative
				${active ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}
			`}
		>
			{children}
			{active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />}
		</button>
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
