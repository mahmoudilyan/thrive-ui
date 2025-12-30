'use client';

import { Input } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface DateFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function DateFieldPreview({ field, mode = 'preview' }: DateFieldPreviewProps) {
	const formatPlaceholder = field.dateFormat || 'mm/dd/yyyy';

	return (
		<div className="w-full">
			<Input
				type="date"
				placeholder={formatPlaceholder}
				required={field.required}
				disabled={mode === 'builder'}
			/>
		</div>
	);
}
