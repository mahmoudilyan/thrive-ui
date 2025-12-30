'use client';

import { Checkbox, Text } from '@thrive/ui';
import type { FormField, FieldOption } from '@/types/form-builder';

interface GdprFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function GdprFieldPreview({ field, mode = 'preview' }: GdprFieldPreviewProps) {
	const options = Array.isArray(field.options) ? field.options : [];
	return (
		<div className="space-y-3">
			{field.description && <p className="text-xs text-gray-700">{field.description}</p>}
			<div className="space-y-2">
				{options.map((option, index) => (
					<div key={index}>
						<input
							type="checkbox"
							value={option.value}
							disabled={mode === 'builder'}
							defaultChecked={option.default}
							id={option.value}
						/>
						<label
							htmlFor={option.value}
							className="text-sm"
							dangerouslySetInnerHTML={{ __html: option.label }}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
