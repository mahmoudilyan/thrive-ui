'use client';

import { Input, Text } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface NumberFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function NumberFieldPreview({ field, mode = 'preview' }: NumberFieldPreviewProps) {
	const prefix = field.currency && field.currencyPosition === 'before' ? field.currency : '';
	const suffix = field.currency && field.currencyPosition === 'after' ? field.currency : '';

	return (
		<div className="w-full">
			<div className="relative">
				{prefix && (
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">{prefix}</span>
				)}
				<Input
					type="number"
					placeholder={field.placeholder || '0'}
					defaultValue={field.defaultValue}
					required={field.required}
					disabled={mode === 'builder'}
					className={`${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
					step={
						field.decimals && field.decimals >= 0 ? `0.${'0'.repeat(field.decimals - 1)}1` : '0.01'
					}
				/>
				{suffix && (
					<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">{suffix}</span>
				)}
			</div>
		</div>
	);
}
