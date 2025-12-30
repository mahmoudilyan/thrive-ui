'use client';

import React, { useState } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Box,
	Text,
	Input,
	Button,
	Tabs,
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

interface AddFieldPopoverProps {
	stepId: string;
	trigger: React.ReactNode;
	position?: 'between' | 'end';
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddFieldPopover({
	stepId,
	trigger,
	position = 'between',
	isOpen,
	onOpenChange,
}: AddFieldPopoverProps) {
	const { fields: existingFields, addField } = useFormBuilderStore();
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
				setFieldTypesData((data.default || data) as { fieldTypes: FieldTypeDefinition[] });
			});
		}
	}, [isOpen]);

	const existingFieldIds = new Set(existingFields.map(f => f.id));

	const handleAddField = (field: FormField | FieldTypeDefinition, sourceListId?: string) => {
		// Check if it's a FieldTypeDefinition (has 'label') or FormField (has 'name')
		if ('label' in field && !('name' in field)) {
			// It's a FieldTypeDefinition (new field from catalog)
			const fieldType = field as FieldTypeDefinition;
			const newField: Omit<FormField, 'id' | 'order'> = {
				type: fieldType.type,
				name: fieldType.label,
				description: fieldType.description || '',
				placeholder: '',
				defaultValue: '',
				required: false,
				private: false,
				options: getDefaultOptionsForFieldType(fieldType.type),
			};
			addField(newField, stepId);
		} else {
			// It's an existing FormField
			addField(field as FormField, stepId);
		}

		onOpenChange(false);
		setSearchTerm('');
	};

	const filterBySearch = (name: string) => {
		if (!searchTerm) return true;
		return name.toLowerCase().includes(searchTerm.toLowerCase());
	};

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className="w-80 p-0">
				{/* Search */}
				<Box className="p-3 border-b border-border">
					<div className="relative">
						<MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
						<Input
							placeholder="Search for a field"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="pl-9 text-sm h-9"
						/>
					</div>
				</Box>

				{/* Tabs */}
				<div className="flex border-b border-border px-2 bg-gray-50">
					<TabButton active={activeTab === 'default'} onClick={() => setActiveTab('default')}>
						Default
					</TabButton>
					<TabButton active={activeTab === 'lists'} onClick={() => setActiveTab('lists')}>
						Lists
					</TabButton>
					<TabButton active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
						New
					</TabButton>
					{fieldTypesData?.fieldTypes.some(ft => ft.category === 'payment') && (
						<TabButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')}>
							Payment
						</TabButton>
					)}
				</div>

				{/* Content */}
				<div className="max-h-80 overflow-y-auto">
					{/* Default Fields */}
					{activeTab === 'default' && (
						<div className="py-2">
							{defaultFieldsData?.groups.map(group => {
								const visibleFields = group.fields.filter(f => filterBySearch(f.name));
								if (visibleFields.length === 0) return null;

								return (
									<div key={group.id} className="mb-1">
										<Text className="text-xs font-medium text-gray-500 px-3 py-1">
											{group.name}
										</Text>
										{visibleFields.map(field => (
											<FieldOption
												key={field.id}
												field={field}
												disabled={existingFieldIds.has(field.id)}
												onSelect={() => handleAddField(field)}
											/>
										))}
									</div>
								);
							})}
						</div>
					)}

					{/* From Lists */}
					{activeTab === 'lists' && (
						<div className="py-2">
							{fieldsByListData?.lists.map(list => {
								const visibleFields = list.fields.filter(f => filterBySearch(f.name));
								if (visibleFields.length === 0) return null;

								return (
									<div key={list.listId} className="mb-1">
										<Text className="text-xs font-medium text-gray-500 px-3 py-1">
											{list.listName}
										</Text>
										{visibleFields.map(field => (
											<FieldOption
												key={field.id}
												field={field}
												disabled={existingFieldIds.has(field.id)}
												onSelect={() => handleAddField(field, list.listId)}
											/>
										))}
									</div>
								);
							})}
						</div>
					)}

					{/* Create New */}
					{activeTab === 'new' && (
						<div className="py-2">
							{fieldTypesData?.fieldTypes
								.filter(ft => ft.category !== 'payment' && filterBySearch(ft.label))
								.map(fieldType => {
									const isDisabled =
										fieldType.unique && existingFields.some(f => f.type === fieldType.type);

									return (
										<FieldOption
											key={fieldType.type}
											field={fieldType}
											disabled={isDisabled}
											onSelect={() => handleAddField(fieldType)}
										/>
									);
								})}
						</div>
					)}

					{/* Payment */}
					{activeTab === 'payment' && (
						<div className="py-2">
							{fieldTypesData?.fieldTypes
								.filter(ft => ft.category === 'payment' && filterBySearch(ft.label))
								.map(fieldType => {
									const isDisabled =
										fieldType.unique && existingFields.some(f => f.type === fieldType.type);

									return (
										<FieldOption
											key={fieldType.type}
											field={fieldType}
											disabled={isDisabled}
											onSelect={() => handleAddField(fieldType)}
										/>
									);
								})}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="border-t border-border p-2">
					<Button
						variant="ghost"
						className="w-full justify-start text-sm h-9"
						onClick={() => setActiveTab('new')}
					>
						<MdAdd className="mr-2" />
						Create field
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

interface FieldOptionProps {
	field: FormField | FieldTypeDefinition;
	disabled?: boolean;
	onSelect: () => void;
}

function FieldOption({ field, disabled, onSelect }: FieldOptionProps) {
	const fieldName = 'name' in field ? field.name : field.label;
	const fieldType = 'type' in field ? field.type : '';

	return (
		<button
			onClick={onSelect}
			disabled={disabled}
			className={`
				w-full flex items-center gap-2 px-3 py-2 text-left
				transition-colors text-sm
				${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
			`}
		>
			<div className="w-4 h-4 flex-shrink-0">
				<div className="w-4 h-4 bg-gray-300 rounded" />
			</div>
			<div className="flex-1 min-w-0">
				<Text className="text-sm font-medium truncate">{fieldName}</Text>
				{fieldType && (
					<Text className="text-xs text-gray-500 truncate capitalize">{fieldType}</Text>
				)}
			</div>
		</button>
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
				px-3 py-1.5 text-xs font-medium transition-colors relative
				${active ? 'text-primary bg-white' : 'text-gray-600 hover:text-gray-900'}
				${active ? 'rounded-t' : ''}
			`}
		>
			{children}
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
