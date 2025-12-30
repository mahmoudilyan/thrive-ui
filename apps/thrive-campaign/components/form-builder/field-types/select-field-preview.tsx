'use client';

import type { FormField, FieldOption } from '@/types/form-builder';

interface SelectFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function SelectFieldPreview({ field, mode = 'preview' }: SelectFieldPreviewProps) {
	const options = Array.isArray(field.options) ? field.options : [];
	const isDynamic =
		field.validation && ['countries', 'states', 'cities'].includes(field.validation);

	return (
		<div className="w-full">
			<select
				disabled={mode === 'builder'}
				required={field.required}
				className="w-full border border-border rounded-md px-3 py-2 text-sm"
			>
				<option value="">-- Select --</option>
				{isDynamic ? (
					<>
						<option value="sample-1">Sample Option 1</option>
						<option value="sample-2">Sample Option 2</option>
						<option value="sample-3">Sample Option 3</option>
					</>
				) : (
					options.map((option, index) => (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					))
				)}
			</select>
		</div>
	);
}
