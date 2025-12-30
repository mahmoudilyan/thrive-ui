'use client';

import { Text, Box } from '@thrive/ui';
import type { FormField } from '@/types/form-builder';
import { TextFieldPreview } from './text-field-preview';
import { SelectFieldPreview } from './select-field-preview';
import { RadioFieldPreview } from './radio-field-preview';
import { CheckboxFieldPreview } from './checkbox-field-preview';
import { DateFieldPreview } from './date-field-preview';
import { FileFieldPreview } from './file-field-preview';
import { PhoneFieldPreview } from './phone-field-preview';
import { NumberFieldPreview } from './number-field-preview';
import { GdprFieldPreview } from './gdpr-field-preview';

interface FieldRendererProps {
	field: FormField;
	mode?: 'builder' | 'preview';
}

export function FieldRenderer({ field, mode = 'preview' }: FieldRendererProps) {
	const renderField = () => {
		switch (field.type) {
			case 'text':
			case 'email':
			case 'url':
			case 'textarea':
				return <TextFieldPreview field={field} mode={mode} />;

			case 'select':
				return <SelectFieldPreview field={field} mode={mode} />;

			case 'radio':
				return <RadioFieldPreview field={field} mode={mode} />;

			case 'checkbox':
				return <CheckboxFieldPreview field={field} mode={mode} />;

			case 'date':
			case 'birthday':
				return <DateFieldPreview field={field} mode={mode} />;

			case 'file':
				return <FileFieldPreview field={field} mode={mode} />;

			case 'phone':
				return <PhoneFieldPreview field={field} mode={mode} />;

			case 'digits':
				return <NumberFieldPreview field={field} mode={mode} />;

			case 'gdpr':
				return <GdprFieldPreview field={field} mode={mode} />;

			case 'captcha':
				return (
					<Box className="border border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
						<Text className="text-sm text-gray-600">reCAPTCHA will appear here</Text>
					</Box>
				);

			case 'payment-products':
			case 'payment-shipping':
			case 'payment-billing':
			case 'payment-checkout':
				return (
					<Box className="border border-gray-300 rounded-lg p-4 bg-gray-50">
						<Text className="text-sm text-gray-600">
							Payment field: {field.type.replace('payment-', '')}
						</Text>
					</Box>
				);

			default:
				return (
					<Box className="border border-gray-300 rounded-lg p-4 bg-gray-50">
						<Text className="text-sm text-gray-600">Unknown field type: {field.type}</Text>
					</Box>
				);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<label className="text-sm font-medium">
					{field.name}
					{field.required && <span className="text-red-500 ml-1">*</span>}
				</label>
				{field.private && (
					<span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Private</span>
				)}
			</div>
			{field.description && field.type !== 'gdpr' && (
				<Text className="text-xs text-gray-600">{field.description}</Text>
			)}
			{renderField()}
		</div>
	);
}
