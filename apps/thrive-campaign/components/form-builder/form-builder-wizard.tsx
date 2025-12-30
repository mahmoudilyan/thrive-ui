'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdCheckCircle } from 'react-icons/md';
import Confetti from 'react-confetti';
import {
	Box,
	Button,
	Flex,
	Stepper,
	StepperContent,
	StepperItem,
	StepperItemIndicator,
	StepperList,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
	Text,
	PageSection,
} from '@thrive/ui';

import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { BuilderStep, SettingsStep } from './steps';
import { useApi } from '@/hooks/use-api';
import { API_CONFIG } from '@/services/config/api';
import { validateForm } from '@/lib/form-builder-validation';
import type { FormBuilderData } from '@/types/form-builder';

interface FormBuilderWizardProps {
	listId: string;
}

export function FormBuilderWizard({ listId }: FormBuilderWizardProps) {
	const router = useRouter();
	const {
		formId,
		formName,
		formTitle,
		formLogo,
		fields,
		steps,
		settings,
		dependencies,
		payment,
		submitButtonLabel,
		nextButtonLabel,
		previousButtonLabel,
		afterSubmitLabel,
		loadForm,
		resetForm,
		activeWizardStep,
		setActiveWizardStep,
		hasUnsavedChanges,
	} = useFormBuilderStore();

	const [showConfetti, setShowConfetti] = useState(false);
	const [savedMessage, setSavedMessage] = useState<string | null>(null);

	// Fetch form data
	const { data: formData, isLoading } = useApi<FormBuilderData, { id: string }>(
		API_CONFIG.formBuilder.getForm,
		{
			params: { id: listId },
			enabled: true,
		}
	);

	useEffect(() => {
		if (formData) {
			loadForm(formData);
		} else {
			resetForm();
		}
	}, [formData, loadForm, resetForm]);

	const stepSequence = useMemo(
		() => [
			{ value: 'builder', title: 'Form Builder', description: 'Fields & layout' },
			{ value: 'settings', title: 'Form Settings', description: 'Subscription & emails' },
		],
		[]
	);

	const [activeStep, setActiveStep] = useState<string>(stepSequence[0]?.value ?? 'builder');

	const activeStepIndex = useMemo(
		() => stepSequence.findIndex(step => step.value === activeStep),
		[activeStep, stepSequence]
	);

	const totalSteps = stepSequence.length;
	const isCompletedView = activeStep === 'completed';
	const isFirstStep = activeStepIndex <= 0;
	const isFinalStep = activeStepIndex === totalSteps - 1;

	const handleStepChange = (value: string) => {
		const targetIndex = stepSequence.findIndex(step => step.value === value);
		if (targetIndex === -1) return;
		if (targetIndex > activeStepIndex) return;
		setActiveStep(value);
		setActiveWizardStep(value as 'builder' | 'settings');
	};

	useEffect(() => {
		if (isCompletedView) {
			setShowConfetti(true);
		} else {
			setShowConfetti(false);
		}
	}, [isCompletedView]);

	const handleSaveDraft = async () => {
		// TODO: Implement save API call
		setSavedMessage('Form saved successfully');
		setTimeout(() => {
			setSavedMessage(null);
		}, 3000);
	};

	const handleSaveForm = async () => {
		const formBuilderData = {
			id: formId || listId,
			name: formName,
			title: formTitle,
			logo: formLogo,
			fields,
			steps,
			settings,
			dependencies,
			payment,
			submitButtonLabel,
			nextButtonLabel,
			previousButtonLabel,
			afterSubmitLabel,
		};

		// Validate form
		const errors = validateForm(formBuilderData);
		const hasErrors = errors.some(e => e.type === 'error');

		if (hasErrors) {
			alert('Please fix the following errors:\n\n' + errors.map(e => `- ${e.message}`).join('\n'));
			return;
		}

		// TODO: Implement actual save API call
		console.log('Saving form:', formBuilderData);

		setActiveStep('completed');
	};

	const handleStepAdvance = (currentValue: string) => {
		const currentIndex = stepSequence.findIndex(step => step.value === currentValue);
		if (currentIndex === -1) return;
		if (currentIndex >= totalSteps - 1) {
			handleSaveForm();
			return;
		}
		const nextStep = stepSequence[currentIndex + 1].value;
		setActiveStep(nextStep);
		setActiveWizardStep(nextStep as 'builder' | 'settings');
	};

	const handleStepBack = () => {
		if (isFirstStep) return;
		const prevStep = stepSequence[activeStepIndex - 1].value;
		setActiveStep(prevStep);
		setActiveWizardStep(prevStep as 'builder' | 'settings');
	};

	const handleContinue = () => {
		handleStepAdvance(activeStep);
	};

	if (isLoading) {
		return <div>Loading form builder...</div>;
	}

	return (
		<>
			<Stepper value={activeStep} onValueChange={handleStepChange} className="flex relative">
				{!isCompletedView && (
					<>
						<PageSection
							variant="create-wizard"
							pageTitle={formTitle || 'Form Builder'}
							className="sticky -top-4 z-10 bg-panel -mt-4 py-2"
							steps={
								<StepperList className="flex items-center gap-4 overflow-x-auto">
									{stepSequence.map((step, index) => (
										<StepperItem
											key={step.value}
											value={step.value}
											completed={index < activeStepIndex}
										>
											<StepperTrigger>
												<StepperItemIndicator />
												<StepperTitle>{step.title}</StepperTitle>
											</StepperTrigger>
											<StepperSeparator />
										</StepperItem>
									))}
								</StepperList>
							}
						/>
					</>
				)}

				<Box className="flex-grow p-4">
					{savedMessage && (
						<Box className="bg-green-50 p-3 rounded-md mb-4 text-green-500">{savedMessage}</Box>
					)}

					<Box className="p-2 rounded-lg mb-6">
						<StepperContent value="builder">
							<BuilderStep onNext={() => handleStepAdvance('builder')} />
						</StepperContent>
						<StepperContent value="settings">
							<SettingsStep onNext={handleSaveForm} onPrev={handleStepBack} />
						</StepperContent>
						<StepperContent value="completed">
							<Box className="max-w-4xl mx-auto min-h-80vh mb-4 flex flex-col items-center justify-center gap-6 py-12">
								<div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
									<MdCheckCircle className="size-12" />
								</div>
								<Box className="text-center space-y-2">
									<Text className="text-xl font-bold">Great Job! Your Form is Ready!</Text>
									<Text className="text-muted-foreground">
										Your form has been saved and is ready to use.
									</Text>
								</Box>
								<Flex className="gap-3">
									<Button
										variant="primary"
										onClick={() => router.push(`/contacts/lists/${listId}`)}
									>
										View List Details
									</Button>
									<Button variant="secondary" onClick={() => router.push('/contacts/lists')}>
										Return to Lists
									</Button>
								</Flex>
							</Box>
						</StepperContent>
					</Box>
				</Box>
				{!isCompletedView && (
					<Flex className="bg-panel border-t border-border-secondary px-8 py-4 justify-between sticky -bottom-4 -mb-4 -ml-2xl -mr-2xl pl-2xl pr-2xl w-[calc(100% + 2xl * 2)]">
						<Flex>
							{!isFirstStep && (
								<Button variant="secondary" onClick={handleStepBack}>
									Back
								</Button>
							)}
						</Flex>
						<Flex className="gap-3">
							<Button variant="secondary" onClick={handleSaveDraft}>
								Save & Exit
							</Button>
							{isFinalStep ? (
								<Button variant="primary" onClick={handleSaveForm}>
									Save Form
								</Button>
							) : (
								<Button variant="primary" onClick={handleContinue}>
									Continue
								</Button>
							)}
						</Flex>
					</Flex>
				)}
			</Stepper>

			{showConfetti && (
				<Confetti
					width={typeof window !== 'undefined' ? window.innerWidth : 0}
					height={typeof window !== 'undefined' ? window.innerHeight : 0}
					numberOfPieces={300}
					gravity={0.2}
					recycle={false}
					confettiSource={
						typeof window !== 'undefined'
							? (() => {
									const sourceSize = window.innerWidth * 0.2;
									return {
										x: window.innerWidth / 2 - sourceSize / 2,
										y: window.innerHeight / 2 - sourceSize / 2,
										w: sourceSize,
										h: sourceSize,
									};
								})()
							: undefined
					}
					initialVelocityX={{ min: -10, max: 10 }}
					initialVelocityY={{ min: -15, max: -5 }}
					onConfettiComplete={() => {
						setShowConfetti(false);
					}}
				/>
			)}
		</>
	);
}
