'use client';

import { useState } from 'react';
import { Box, Text, Button, Flex } from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { FieldRenderer } from './field-types/field-renderer';

export function FormPreview() {
	const { formTitle, formLogo, steps, submitButtonLabel, nextButtonLabel, previousButtonLabel } =
		useFormBuilderStore();

	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	const customSteps = steps.filter(s => !s.isDefault);
	const hasMultipleSteps = customSteps.length > 0;
	const visibleSteps = hasMultipleSteps ? customSteps : [steps.find(s => s.isDefault) || steps[0]];
	const currentStep = visibleSteps[currentStepIndex];

	const handleNext = () => {
		if (currentStepIndex < visibleSteps.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1);
		}
	};

	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === visibleSteps.length - 1;

	// Filter out private fields for preview
	const visibleFields = currentStep?.fields.filter(f => !f.private) || [];

	return (
		<Box className="max-w-container-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			{/* Logo */}
			{formLogo && (
				<Box className="mb-6 flex justify-center">
					<img src={formLogo} alt="Form logo" className="max-h-24 object-contain" />
				</Box>
			)}

			{/* Form Title */}
			<Text className="text-2xl font-bold text-center mb-6">{formTitle || 'Form Title'}</Text>

			{/* Multi-step Progress */}
			{hasMultipleSteps && (
				<Box className="mb-6">
					<Flex className="items-center justify-between mb-2">
						{visibleSteps.map((step, index) => (
							<div key={step.id} className="flex items-center flex-1">
								<div
									className={`
										w-8 h-8 rounded-full flex items-center justify-center font-semibold
										${index <= currentStepIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}
									`}
								>
									{index + 1}
								</div>
								{index < visibleSteps.length - 1 && (
									<div
										className={`
											flex-1 h-1 mx-2
											${index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'}
										`}
									/>
								)}
							</div>
						))}
					</Flex>
					{currentStep && (
						<Box className="text-center">
							<Text className="font-semibold">{currentStep.title}</Text>
							{currentStep.description && (
								<Text className="text-sm text-gray-600">{currentStep.description}</Text>
							)}
						</Box>
					)}
				</Box>
			)}

			{/* Form Fields */}
			<div className="space-y-4 mb-6">
				{visibleFields.length > 0 ? (
					visibleFields.map(field => <FieldRenderer key={field.id} field={field} mode="preview" />)
				) : (
					<Box className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
						<Text className="text-gray-500">No fields in this step</Text>
					</Box>
				)}
			</div>

			{/* Form Buttons */}
			<Flex className="gap-3">
				{/* Back Button - Show in all steps except first (in multi-step) */}
				{hasMultipleSteps && !isFirstStep && (
					<Button variant="secondary" onClick={handlePrevious}>
						{previousButtonLabel}
					</Button>
				)}

				{/* Spacer */}
				{hasMultipleSteps && !isFirstStep && <div className="flex-1" />}

				{/* Next Button - Show in all steps except last (in multi-step) */}
				{hasMultipleSteps && !isLastStep && (
					<Button variant="primary" onClick={handleNext}>
						{nextButtonLabel}
					</Button>
				)}

				{/* Submit Button - Show in last step (multi-step) or always (single-step) */}
				{(!hasMultipleSteps || isLastStep) && (
					<Button variant="primary" className={!hasMultipleSteps ? 'ml-auto' : ''}>
						{submitButtonLabel}
					</Button>
				)}
			</Flex>
		</Box>
	);
}
