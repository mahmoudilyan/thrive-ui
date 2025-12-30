'use client';

import { useState } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import { Box, Text, Button, Input, IconButton, Flex } from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import type { FormDependency } from '@/types/form-builder';

interface FieldDependencyManagerProps {
	fieldId: string;
}

export function FieldDependencyManager({ fieldId }: FieldDependencyManagerProps) {
	const { fields, dependencies, addDependency, removeDependency, updateDependency } =
		useFormBuilderStore();

	const [grouping, setGrouping] = useState<'and' | 'or'>('and');

	const fieldDependencies = dependencies.filter(d => d.targetFieldId === fieldId);

	// Get available source fields (exclude current field and private fields)
	const availableSourceFields = fields.filter(
		f => f.id !== fieldId && !f.private && f.type !== 'captcha'
	);

	const handleAddRule = () => {
		if (availableSourceFields.length === 0) {
			alert('No available fields to create dependencies');
			return;
		}

		addDependency({
			targetFieldId: fieldId,
			sourceFieldId: availableSourceFields[0].id,
			condition: 'equals',
			value: '',
			grouping,
		});
	};

	const handleRemoveRule = (dependencyId: string) => {
		removeDependency(dependencyId);
	};

	const handleUpdateRule = (dependencyId: string, updates: Partial<FormDependency>) => {
		updateDependency(dependencyId, updates);
	};

	if (availableSourceFields.length === 0) {
		return (
			<Box className="p-4 bg-gray-50 rounded border border-gray-200">
				<Text className="text-sm text-gray-600">
					No fields available for conditional logic. Add more fields to enable this feature.
				</Text>
			</Box>
		);
	}

	return (
		<Box className="space-y-4">
			<div className="flex items-center justify-between">
				<Text className="text-sm font-semibold">Conditional Logic</Text>
				<Button size="xs" variant="secondary" onClick={handleAddRule}>
					<MdAdd className="mr-1" />
					Add Rule
				</Button>
			</div>

			{fieldDependencies.length > 0 && (
				<>
					{/* Grouping Selector */}
					<div className="flex items-center gap-2">
						<Text className="text-xs text-gray-600">Show this field when:</Text>
						<select
							value={grouping}
							onChange={e => setGrouping(e.target.value as 'and' | 'or')}
							className="w-24 border border-border rounded-md px-2 py-1 text-sm"
						>
							<option value="and">ALL</option>
							<option value="or">ANY</option>
						</select>
						<Text className="text-xs text-gray-600">of these conditions match</Text>
					</div>

					{/* Rules List */}
					<div className="space-y-3">
						{fieldDependencies.map(dependency => (
							<DependencyRule
								key={dependency.id}
								dependency={dependency}
								availableFields={availableSourceFields}
								onUpdate={updates => handleUpdateRule(dependency.id, updates)}
								onRemove={() => handleRemoveRule(dependency.id)}
							/>
						))}
					</div>
				</>
			)}

			{fieldDependencies.length === 0 && (
				<Box className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
					<Text className="text-sm text-gray-600">
						No conditional rules. Click "Add Rule" to create one.
					</Text>
				</Box>
			)}
		</Box>
	);
}

interface DependencyRuleProps {
	dependency: FormDependency;
	availableFields: any[];
	onUpdate: (updates: Partial<FormDependency>) => void;
	onRemove: () => void;
}

function DependencyRule({ dependency, availableFields, onUpdate, onRemove }: DependencyRuleProps) {
	const sourceField = availableFields.find(f => f.id === dependency.sourceFieldId);
	const needsValue = !['is_empty', 'is_not_empty'].includes(dependency.condition);

	return (
		<Box className="p-3 border border-border rounded-lg bg-gray-50 space-y-2">
			<Flex className="gap-2 items-start">
				{/* Source Field */}
				<div className="flex-1">
					<select
						value={dependency.sourceFieldId}
						onChange={e => onUpdate({ sourceFieldId: e.target.value })}
						className="w-full border border-border rounded-md px-3 py-2 text-sm"
					>
						{availableFields.map(field => (
							<option key={field.id} value={field.id}>
								{field.name}
							</option>
						))}
					</select>
				</div>

				{/* Condition */}
				<div className="flex-1">
					<select
						value={dependency.condition}
						onChange={e =>
							onUpdate({
								condition: e.target.value as FormDependency['condition'],
							})
						}
						className="w-full border border-border rounded-md px-3 py-2 text-sm"
					>
						<option value="equals">Equals</option>
						<option value="not_equals">Not Equals</option>
						<option value="contains">Contains</option>
						<option value="greater_than">Greater Than</option>
						<option value="less_than">Less Than</option>
						<option value="is_empty">Is Empty</option>
						<option value="is_not_empty">Is Not Empty</option>
					</select>
				</div>

				{/* Delete Button */}
				<IconButton
					size="sm"
					variant="ghost"
					onClick={onRemove}
					aria-label="Delete rule"
					className="text-red-600 hover:bg-red-50"
				>
					<MdDelete />
				</IconButton>
			</Flex>

			{/* Value Input */}
			{needsValue && (
				<div>
					{sourceField?.type === 'select' ||
					sourceField?.type === 'radio' ||
					sourceField?.type === 'checkbox' ? (
						<select
							value={dependency.value || ''}
							onChange={e => onUpdate({ value: e.target.value })}
							className="w-full border border-border rounded-md px-3 py-2 text-sm"
						>
							<option value="">-- Select Value --</option>
							{Array.isArray(sourceField.options) &&
								sourceField.options.map((option: any, index: number) => (
									<option key={index} value={option.value}>
										{option.label}
									</option>
								))}
						</select>
					) : (
						<Input
							value={dependency.value || ''}
							onChange={e => onUpdate({ value: e.target.value })}
							placeholder="Enter value"
							className="text-sm"
						/>
					)}
				</div>
			)}
		</Box>
	);
}
