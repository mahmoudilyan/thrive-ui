'use client';

import { Checkbox } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface CheckboxFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function CheckboxFieldPreview({ field, mode = 'preview' }: CheckboxFieldPreviewProps) {
	const options = Array.isArray(field.options) ? field.options : [];

	// If styled as select, show multi-select dropdown
	if (field.styleAs === 'select') {
		return (
			<div className="w-full">
				<select
					multiple
					disabled={mode === 'builder'}
					className="w-full border border-border rounded-md p-2"
					size={Math.min(options.length, 5)}
				>
					{options.map((option, index) => (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{options.map((option, index) => (
				<Checkbox key={index} value={option.value} disabled={mode === 'builder'}>
					{option.label}
				</Checkbox>
			))}
		</div>
	);
}
