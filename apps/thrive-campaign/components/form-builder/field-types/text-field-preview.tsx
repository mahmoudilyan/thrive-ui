'use client';

import { Input, Textarea } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface TextFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function TextFieldPreview({ field, mode = 'preview' }: TextFieldPreviewProps) {
	const isTextarea = field.type === 'textarea';

	return (
		<div className="w-full">
			{isTextarea ? (
				<Textarea
					placeholder={field.placeholder || field.name}
					defaultValue={field.defaultValue}
					required={field.required}
					disabled={mode === 'builder'}
					rows={4}
				/>
			) : (
				<Input
					type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
					placeholder={field.placeholder || field.name}
					defaultValue={field.defaultValue}
					required={field.required}
					disabled={mode === 'builder'}
				/>
			)}
		</div>
	);
}
