'use client';

import { Radio, RadioGroup } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface RadioFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function RadioFieldPreview({ field, mode = 'preview' }: RadioFieldPreviewProps) {
	const options = Array.isArray(field.options) ? field.options : [];

	return (
		<RadioGroup disabled={mode === 'builder'}>
			<div className="space-y-2">
				{options.map((option, index) => (
					<Radio key={index} value={option.value}>
						{option.label}
					</Radio>
				))}
			</div>
		</RadioGroup>
	);
}
