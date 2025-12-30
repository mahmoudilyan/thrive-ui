'use client';

import { Box, Text, Input, Textarea, Switch, Button, Flex, IconButton } from '@thrive/ui';
import { MdClose } from 'react-icons/md';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { FieldDependencyManager } from './field-dependency-manager';
import type { FormField, FieldOption } from '@/types/form-builder';

export function FieldPropertiesPanel() {
	const { selectedFieldId, fields, updateField, selectField } = useFormBuilderStore();

	const field = fields.find(f => f.id === selectedFieldId);

	if (!field) {
		return null;
	}

	const handleClose = () => {
		selectField(null);
	};

	const handleUpdate = (updates: Partial<FormField>) => {
		updateField(field.id, updates);
	};

	return (
		<Box className="h-full border border-border rounded-lg bg-white overflow-hidden flex flex-col">
			{/* Header */}
			<div className="p-4 border-b border-border flex items-center justify-between">
				<Text className="font-semibold">Field Properties</Text>
				<button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
					<MdClose />
				</button>
			</div>

			{/* Properties Form */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Field Name */}
				<div>
					<label className="block text-sm font-medium mb-1">Field Label</label>
					<Input
						value={field.name}
						onChange={e => handleUpdate({ name: e.target.value })}
						placeholder="Enter field label"
					/>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-medium mb-1">Description</label>
					<Textarea
						value={field.description || ''}
						onChange={e => handleUpdate({ description: e.target.value })}
						placeholder="Enter field description (optional)"
						rows={2}
					/>
				</div>

				{/* Placeholder (for applicable field types) */}
				{shouldShowPlaceholder(field.type) && (
					<div>
						<label className="block text-sm font-medium mb-1">Placeholder</label>
						<Input
							value={field.placeholder || ''}
							onChange={e => handleUpdate({ placeholder: e.target.value })}
							placeholder="Enter placeholder text"
						/>
					</div>
				)}

				{/* Default Value */}
				{shouldShowDefaultValue(field.type) && (
					<div>
						<label className="block text-sm font-medium mb-1">Default Value</label>
						<Input
							value={field.defaultValue || ''}
							onChange={e => handleUpdate({ defaultValue: e.target.value })}
							placeholder="Enter default value"
						/>
					</div>
				)}

				{/* Required Toggle */}
				{field.secret !== 'email' && (
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium">Required Field</label>
						<Switch
							checked={field.required}
							onCheckedChange={checked => handleUpdate({ required: checked })}
						/>
					</div>
				)}

				{/* Private Toggle */}
				{field.secret !== 'email' && (
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium">Private Field</label>
						<Switch
							checked={field.private}
							onCheckedChange={checked => handleUpdate({ private: checked })}
						/>
					</div>
				)}

				{/* Field-Specific Options */}
				<FieldTypeSpecificOptions field={field} onUpdate={handleUpdate} />

				{/* Conditional Logic */}
				{field.secret !== 'email' && field.type !== 'captcha' && (
					<div className="pt-4 border-t border-border">
						<FieldDependencyManager fieldId={field.id} />
					</div>
				)}
			</div>
		</Box>
	);
}

interface FieldTypeSpecificOptionsProps {
	field: FormField;
	onUpdate: (updates: Partial<FormField>) => void;
}

function FieldTypeSpecificOptions({ field, onUpdate }: FieldTypeSpecificOptionsProps) {
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
					<Box className="p-3 bg-blue-50 rounded border border-blue-200">
						<Text className="text-sm text-blue-800">
							This field uses dynamic {field.validation} data.
						</Text>
					</Box>
				);
			}

			return (
				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="text-sm font-medium">Options</label>
						<Button size="xs" variant="secondary" onClick={handleAddOption}>
							Add Option
						</Button>
					</div>
					<div className="space-y-2">
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
										aria-label="Remove option"
										className="text-red-600 hover:bg-red-50"
									>
										<MdClose />
									</IconButton>
								</div>
							))}
					</div>
				</div>
			);

		case 'date':
		case 'birthday':
			return (
				<div>
					<label className="block text-sm font-medium mb-1">Date Format</label>
					<select
						value={field.dateFormat || 'm/d/Y'}
						onChange={e => onUpdate({ dateFormat: e.target.value })}
						className="w-full border border-border rounded-md px-3 py-2 text-sm"
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
				<div className="space-y-3">
					<div>
						<label className="block text-sm font-medium mb-1">Allowed Extensions</label>
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
						<Text className="text-xs text-gray-600 mt-1">Comma-separated file extensions</Text>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Max File Size (MB)</label>
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

		case 'phone':
			return (
				<div className="flex items-center justify-between">
					<label className="text-sm font-medium">Show Country List</label>
					<Switch
						checked={field.showCountryList ?? true}
						onCheckedChange={checked => onUpdate({ showCountryList: checked })}
					/>
				</div>
			);

		case 'digits':
			return (
				<div className="space-y-3">
					<div>
						<label className="block text-sm font-medium mb-1">Currency Symbol</label>
						<Input
							value={field.currency || ''}
							onChange={e => onUpdate({ currency: e.target.value })}
							placeholder="$ or leave empty"
							className="text-sm"
						/>
					</div>
					{field.currency && (
						<div>
							<label className="block text-sm font-medium mb-1">Currency Position</label>
							<select
								value={field.currencyPosition || 'before'}
								onChange={e => onUpdate({ currencyPosition: e.target.value as 'before' | 'after' })}
								className="w-full border border-border rounded-md px-3 py-2 text-sm"
							>
								<option value="before">Before (e.g., $100)</option>
								<option value="after">After (e.g., 100$)</option>
							</select>
						</div>
					)}
					<div>
						<label className="block text-sm font-medium mb-1">Decimal Places</label>
						<select
							value={String(field.decimals ?? -1)}
							onChange={e => onUpdate({ decimals: parseInt(e.target.value) })}
							className="w-full border border-border rounded-md px-3 py-2 text-sm"
						>
							<option value="-1">Auto</option>
							<option value="0">0</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
						</select>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium">Number Formatting</label>
						<Switch
							checked={field.numberFormat ?? false}
							onCheckedChange={checked => onUpdate({ numberFormat: checked })}
						/>
					</div>
				</div>
			);

		case 'checkbox':
			return (
				<div>
					<label className="block text-sm font-medium mb-1">Display Style</label>
					<select
						value={field.styleAs || 'checkbox'}
						onChange={e => onUpdate({ styleAs: e.target.value })}
						className="w-full border border-border rounded-md px-3 py-2 text-sm"
					>
						<option value="checkbox">Checkboxes</option>
						<option value="select">Dropdown (Multi-select)</option>
					</select>
				</div>
			);

		case 'gdpr':
			return (
				<div>
					<label className="block text-sm font-medium mb-1">Options</label>
					<Button size="xs" variant="secondary" onClick={handleAddOption}>
						Add Option
					</Button>
					<div className="space-y-2">
						{Array.isArray(field.options) &&
							field.options.map((option, index) => (
								<div key={index} className="flex items-center gap-2">
									<Input
										value={option.label}
										onChange={e => handleUpdateOption(index, { label: e.target.value })}
										placeholder="Option label"
										className="text-sm"
									/>
								</div>
							))}
					</div>
				</div>
			);

		default:
			return null;
	}
}

function shouldShowPlaceholder(type: string): boolean {
	return ['text', 'email', 'url', 'textarea', 'phone', 'digits'].includes(type);
}

function shouldShowDefaultValue(type: string): boolean {
	return ['text', 'email', 'url', 'textarea', 'digits'].includes(type);
}
