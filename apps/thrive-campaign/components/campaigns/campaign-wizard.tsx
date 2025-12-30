// @ts-nocheck
'use client';

import { useEffect, useMemo, useState } from 'react';

import { useCampaignStore } from '@/store/use-campaign-store';
import SetupStep from './steps/setup-step';
import RecipientsStep from './steps/recipients-step';
import DesignStep from './steps/design-step';
import SummaryStep from './steps/summary-step';
import { MdCheckCircle } from 'react-icons/md';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	Flex,
	Icon,
	IconButton,
	Stepper,
	StepperContent,
	StepperDescription,
	StepperItem,
	StepperItemIndicator,
	StepperList,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
	Text,
	PageSection,
} from '@thrive/ui';

// Create placeholder components for missing steps
// const DesignStep = ({ onNext, onPrev }: StepComponentProps) => (
//   <Box>
//     <Text fontSize="xl" fontWeight="bold" mb={4}>Design Your Campaign</Text>
//     <Text mb={6}>This is where users will select a template for their campaign.</Text>
//     <Flex gap={4} justifyContent="space-between">
//       {onPrev && <Button onClick={onPrev} variant="outline">Back</Button>}
//       <Button onClick={onNext} colorScheme="blue">Continue</Button>
//     </Flex>
//   </Box>
// );

// const SummaryStep = ({ onNext, onPrev }: StepComponentProps) => (
//   <Box>
//     <Text fontSize="xl" fontWeight="bold" mb={4}>Review Your Campaign</Text>
//     <Text mb={6}>This is where users will review their campaign before sending it.</Text>
//     <Flex gap={4} justifyContent="space-between">
//       {onPrev && <Button onClick={onPrev} variant="outline">Back</Button>}
//       <Button onClick={onNext} colorScheme="green">Send Campaign</Button>
//     </Flex>
//   </Box>
// );

// Define step types
// Removed unused StepId type

export default function CampaignWizard({ editedCampaignId }: { editedCampaignId: string | null }) {
	const router = useRouter();
	const { loadCampaign, setCampaignField, resetCampaign, campaignData, saveCampaign } =
		useCampaignStore();
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect(() => {
		const loadCampaignData = async () => {
			if (editedCampaignId) {
				await loadCampaign(editedCampaignId);
			} else {
				resetCampaign();
			}
		};
		loadCampaignData();
	}, [editedCampaignId, loadCampaign, resetCampaign]);

	const [savedMessage, setSavedMessage] = useState<string | null>(null);

	const stepSequence = useMemo(
		() => [
			{ value: 'setup', title: 'Setup', description: 'Campaign basics' },
			{ value: 'recipients', title: 'Recipients', description: 'Target audiences' },
			{
				value: 'design',
				title: campaignData.abTestVariable === 'content' ? 'Design (A/B)' : 'Design',
				description: 'Template & content',
			},
			{ value: 'summary', title: 'Summary', description: 'Review & schedule' },
		],
		[campaignData.abTestVariable]
	);

	const [activeStep, setActiveStep] = useState<string>(stepSequence[0]?.value ?? 'setup');

	useEffect(() => {
		if (activeStep === 'completed') return;
		if (!stepSequence.some(step => step.value === activeStep) && stepSequence.length > 0) {
			setActiveStep(stepSequence[0].value);
		}
	}, [activeStep, stepSequence]);

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
	};

	useEffect(() => {
		if (isCompletedView) {
			setShowConfetti(true);
		} else {
			setShowConfetti(false);
		}
	}, [isCompletedView]);

	const handleSaveDraft = () => {
		saveCampaign({ isDraft: true });
		setSavedMessage('Campaign saved as draft');
		// Clear message after 3 seconds
		setTimeout(() => {
			setSavedMessage(null);
		}, 3000);
	};

	const handleSendCampaign = () => {
		saveCampaign({ isDraft: false });
		setActiveStep('completed');
	};

	const handleStepAdvance = (currentValue: string) => {
		const currentIndex = stepSequence.findIndex(step => step.value === currentValue);
		if (currentIndex === -1) return;
		if (currentIndex >= totalSteps - 1) {
			handleSendCampaign();
			return;
		}
		setActiveStep(stepSequence[currentIndex + 1].value);
	};

	const handleStepBack = () => {
		if (isFirstStep) return;
		setActiveStep(stepSequence[activeStepIndex - 1].value);
	};

	const handleContinue = () => {
		handleStepAdvance(activeStep);
	};

	return (
		<>
			<Stepper value={activeStep} onValueChange={handleStepChange} className="flex relative">
				{!isCompletedView && (
					<>
						<PageSection
							variant="create-wizard"
							pageTitle="New Campaign Name"
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
					{savedMessage ? (
						<Box bg="green.50" p={3} borderRadius="md" mb={4} color="green.500">
							{savedMessage}
						</Box>
					) : null}

					<Box p={2} borderRadius="lg" mb={6}>
						<StepperContent value="setup">
							<SetupStep onNext={() => handleStepAdvance('setup')} />
						</StepperContent>
						<StepperContent value="recipients">
							<RecipientsStep
								onNext={() => handleStepAdvance('recipients')}
								onPrev={handleStepBack}
							/>
						</StepperContent>
						<StepperContent value="design">
							<DesignStep onNext={() => handleStepAdvance('design')} onPrev={handleStepBack} />
						</StepperContent>
						<StepperContent value="summary">
							<SummaryStep onNext={handleSendCampaign} onPrev={handleStepBack} />
						</StepperContent>
						<StepperContent value="completed">
							<Box className="max-w-4xl mx-auto min-h-80vh mb-4 flex flex-col items-center justify-center gap-6 py-12">
								<div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
									<MdCheckCircle className="size-12" />
								</div>
								<Box className="text-center space-y-2">
									<Text className="text-xl font-bold">Great Job! Your Campaign is On Its Way!</Text>
									<Text className="text-muted-foreground">
										We&apos;ll handle the sending in the background. You&apos;ve done your part!
									</Text>
								</Box>
								<Flex className="gap-3">
									<Button
										variant="primary"
										onClick={() => router.push(`/campaigns/${campaignData.id}`)}
									>
										See Campaign Details
									</Button>
									<Button variant="secondary" onClick={() => router.push('/campaigns')}>
										Return to Campaigns
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
								Save & Finish Later
							</Button>
							{isFinalStep ? (
								<Button variant="primary" onClick={handleSendCampaign}>
									Send Campaign
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
