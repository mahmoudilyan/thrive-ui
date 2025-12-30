'use client';

import { Input, Text } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';

interface FileFieldPreviewProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function FileFieldPreview({ field, mode = 'preview' }: FileFieldPreviewProps) {
	const acceptExtensions = field.allowedExtensions
		? field.allowedExtensions.map(ext => `.${ext}`).join(',')
		: '';

	return (
		<div className="w-full">
			<Input
				type="file"
				accept={acceptExtensions}
				required={field.required}
				disabled={mode === 'builder'}
			/>
			{field.allowedExtensions && field.allowedExtensions.length > 0 && (
				<Text className="text-xs text-gray-600 mt-1">
					Allowed: {field.allowedExtensions.join(', ')}
				</Text>
			)}
			{field.maxFileSize && (
				<Text className="text-xs text-gray-600 mt-1">Max size: {field.maxFileSize}MB</Text>
			)}
		</div>
	);
}
