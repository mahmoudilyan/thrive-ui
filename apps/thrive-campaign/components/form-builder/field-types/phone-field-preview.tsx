'use client';

import { Input } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface PhoneFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function PhoneFieldPreview({ field, mode = 'preview' }: PhoneFieldPreviewProps) {
	return (
		<div className="w-full">
			<Input
				type="tel"
				placeholder={field.placeholder || '+1 (234) 567-8900'}
				defaultValue={field.defaultValue}
				required={field.required}
				disabled={mode === 'builder'}
			/>
		</div>
	);
}
