'use client';

import { useState } from 'react';
import { MdMoreVert, MdDelete, MdClose, MdDragIndicator, MdContentCopy } from 'react-icons/md';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Box,
	Text,
	Input,
	Switch,
	Button,
	IconButton,
} from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { FieldDependencyManager } from './field-dependency-manager';
import type { FormField, FieldOption } from '@/types/form-builder';

interface FieldOptionsPopoverProps {
	field: FormField;
	trigger?: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function FieldOptionsPopover({
	field,
	trigger,
	isOpen,
	onOpenChange,
}: FieldOptionsPopoverProps) {
	const { updateField, removeField } = useFormBuilderStore();

	const handleUpdate = (updates: Partial<FormField>) => {
		updateField(field.id, updates);
	};

	const handleDelete = () => {
		if (confirm('Are you sure you want to delete this field?')) {
			removeField(field.id);
			onOpenChange(false);
		}
	};

	const handleAddOption = () => {
		const currentOptions = Array.isArray(field.options) ? field.options : [];
		const newOption: FieldOption = {
			label: `Option ${currentOptions.length + 1}`,
			value: `option-${currentOptions.length + 1}`,
		};
		handleUpdate({ options: [...currentOptions, newOption] });
	};

	const handleUpdateOption = (index: number, updates: Partial<FieldOption>) => {
		const currentOptions = Array.isArray(field.options) ? [...field.options] : [];
		currentOptions[index] = { ...currentOptions[index], ...updates };
		handleUpdate({ options: currentOptions });
	};

	const handleRemoveOption = (index: number) => {
		const currentOptions = Array.isArray(field.options) ? [...field.options] : [];
		currentOptions.splice(index, 1);
		handleUpdate({ options: currentOptions });
	};

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				{/* Header */}
				<div className="p-3 border-b border-border flex items-center justify-between">
					<Text className="font-semibold text-sm">Field Options</Text>
					<button onClick={() => onOpenChange(false)} className="hover:bg-gray-100 p-1 rounded">
						<MdClose className="text-gray-500" />
					</button>
				</div>

				{/* Content */}
				<div className="p-3 space-y-3 max-h-96 overflow-y-auto">
					{/* Required Toggle */}
					{field.secret !== 'email' && (
						<OptionRow label="Required" icon={<span className="text-red-500">*</span>}>
							<Switch
								checked={field.required}
								onCheckedChange={checked => handleUpdate({ required: checked })}
							/>
						</OptionRow>
					)}

					{/* Description Toggle & Input */}
					<div>
						<OptionRow label="Description" icon="≡">
							<Switch
								checked={!!field.description}
								onCheckedChange={checked => handleUpdate({ description: checked ? '' : undefined })}
							/>
						</OptionRow>
						{field.description !== undefined && (
							<div className="mt-2 ml-6">
								<Input
									value={field.description || ''}
									onChange={e => handleUpdate({ description: e.target.value })}
									placeholder="Add description"
									className="text-sm"
								/>
							</div>
						)}
					</div>

					{/* Placeholder (for applicable types) */}
					{shouldShowPlaceholder(field.type) && (
						<div className="ml-6">
							<label className="text-xs text-gray-600 block mb-1">Placeholder</label>
							<Input
								value={field.placeholder || ''}
								onChange={e => handleUpdate({ placeholder: e.target.value })}
								placeholder="Enter placeholder"
								className="text-sm"
							/>
						</div>
					)}

					{/* Private Toggle */}
					{field.secret !== 'email' && (
						<OptionRow label="Private" icon="👁">
							<Switch
								checked={field.private}
								onCheckedChange={checked => handleUpdate({ private: checked })}
							/>
						</OptionRow>
					)}

					{/* Field Type (read-only) */}
					<OptionRow label="Field type" icon="⚙" expandable>
						<Text className="text-sm text-gray-600 capitalize">{field.type}</Text>
					</OptionRow>

					{/* Field-Specific Options */}
					<FieldTypeOptions field={field} onUpdate={handleUpdate} />

					{/* Conditional Logic */}
					{field.secret !== 'email' && field.type !== 'captcha' && (
						<div className="pt-3 border-t border-border">
							<FieldDependencyManager fieldId={field.id} />
						</div>
					)}
				</div>

				{/* Footer Actions */}
				<div className="border-t border-border p-2">
					<Button
						variant="ghost"
						className="w-full justify-start text-sm h-9 text-red-600 hover:bg-red-50"
						onClick={handleDelete}
					>
						<MdDelete className="mr-2" />
						Delete field
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

interface OptionRowProps {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	expandable?: boolean;
}

function OptionRow({ label, icon, children, expandable }: OptionRowProps) {
	return (
		<div className="flex items-center justify-between py-1">
			<div className="flex items-center gap-2">
				<span className="text-gray-500 text-sm w-4">{icon}</span>
				<Text className="text-sm font-medium">{label}</Text>
			</div>
			<div className="flex items-center gap-2">
				{children}
				{expandable && <span className="text-gray-400">›</span>}
			</div>
		</div>
	);
}

interface FieldTypeOptionsProps {
	field: FormField;
	onUpdate: (updates: Partial<FormField>) => void;
}

function FieldTypeOptions({ field, onUpdate }: FieldTypeOptionsProps) {
	const handleAddOption = () => {
		const currentOptions = Array.isArray(field.options) ? field.options : [];
		const newOption: FieldOption = {
			label: `Option ${currentOptions.length + 1}`,
			value: `option-${currentOptions.length + 1}`,
		};
		onUpdate({ options: [...currentOptions, newOption] });
	};

	const handleUpdateOption = (index: number, updates: Partial<FieldOption>) => {
		const currentOptions = Array.isArray(field.options) ? [...field.options] : [];
		currentOptions[index] = { ...currentOptions[index], ...updates };
		onUpdate({ options: currentOptions });
	};

	const handleRemoveOption = (index: number) => {
		const currentOptions = Array.isArray(field.options) ? [...field.options] : [];
		currentOptions.splice(index, 1);
		onUpdate({ options: currentOptions });
	};

	switch (field.type) {
		case 'select':
		case 'radio':
		case 'checkbox':
			if (field.validation && ['countries', 'states', 'cities'].includes(field.validation)) {
				return (
					<Box className="ml-6 p-2 bg-blue-50 rounded text-xs text-blue-800">
						Dynamic {field.validation} field
					</Box>
				);
			}

			return (
				<div className="ml-6 space-y-2">
					<div className="flex items-center justify-between">
						<Text className="text-xs text-gray-600">Options</Text>
						<Button size="xs" variant="ghost" onClick={handleAddOption}>
							+ Add
						</Button>
					</div>
					{Array.isArray(field.options) &&
						field.options.map((option, index) => (
							<div key={index} className="flex items-center gap-2">
								<Input
									value={option.label}
									onChange={e =>
										handleUpdateOption(index, {
											label: e.target.value,
											value: e.target.value.toLowerCase().replace(/\s+/g, '-'),
										})
									}
									placeholder="Option label"
									className="text-sm"
								/>
								<IconButton
									size="sm"
									variant="ghost"
									onClick={() => handleRemoveOption(index)}
									aria-label="Remove"
									className="text-red-600"
								>
									<MdClose />
								</IconButton>
							</div>
						))}
				</div>
			);

		case 'date':
		case 'birthday':
			return (
				<div className="ml-6">
					<label className="text-xs text-gray-600 block mb-1">Date Format</label>
					<select
						value={field.dateFormat || 'm/d/Y'}
						onChange={e => onUpdate({ dateFormat: e.target.value })}
						className="w-full border border-border rounded-md px-2 py-1 text-sm"
					>
						<option value="m/d/Y">MM/DD/YYYY</option>
						<option value="d/m/Y">DD/MM/YYYY</option>
						<option value="Y-m-d">YYYY-MM-DD</option>
						{field.type === 'birthday' && <option value="m/d">MM/DD</option>}
					</select>
				</div>
			);

		case 'file':
			return (
				<div className="ml-6 space-y-2">
					<div>
						<label className="text-xs text-gray-600 block mb-1">Allowed Extensions</label>
						<Input
							value={field.allowedExtensions?.join(', ') || 'png, jpg, jpeg, gif'}
							onChange={e =>
								onUpdate({
									allowedExtensions: e.target.value.split(',').map(ext => ext.trim()),
								})
							}
							placeholder="png, jpg, pdf"
							className="text-sm"
						/>
					</div>
					<div>
						<label className="text-xs text-gray-600 block mb-1">Max Size (MB)</label>
						<Input
							type="number"
							value={field.maxFileSize || 10}
							onChange={e => onUpdate({ maxFileSize: parseInt(e.target.value) })}
							min="1"
							max="100"
							className="text-sm"
						/>
					</div>
				</div>
			);

		case 'digits':
			return (
				<div className="ml-6 space-y-2">
					<div>
						<label className="text-xs text-gray-600 block mb-1">Currency Symbol</label>
						<Input
							value={field.currency || ''}
							onChange={e => onUpdate({ currency: e.target.value })}
							placeholder="$ or leave empty"
							className="text-sm"
						/>
					</div>
					{field.currency && (
						<div>
							<label className="text-xs text-gray-600 block mb-1">Position</label>
							<select
								value={field.currencyPosition || 'before'}
								onChange={e => onUpdate({ currencyPosition: e.target.value as 'before' | 'after' })}
								className="w-full border border-border rounded-md px-2 py-1 text-sm"
							>
								<option value="before">Before</option>
								<option value="after">After</option>
							</select>
						</div>
					)}
				</div>
			);

		default:
			return null;
	}
}

function shouldShowPlaceholder(type: string): boolean {
	return ['text', 'email', 'url', 'textarea', 'phone', 'digits'].includes(type);
}
