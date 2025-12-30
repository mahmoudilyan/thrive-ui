import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageSection, PageSectionWizard, Stepper, StepperContent, Button } from '@thrive/ui';
import { MdOutlineEdit, MdOutlineDelete, MdOutlineArchive, MdOutlineCopyAll } from 'react-icons/md';

// Mock Link component for Storybook
const MockLink = ({ href, children, ...props }: any) => (
	<a href={href || '#'} {...props}>
		{children}
	</a>
);

const meta = {
	title: 'Layout/Page Section',
	component: PageSection,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
# Page Section

A layout component for page headers with breadcrumb navigation, titles, and action buttons. Provides consistent spacing and layout patterns across applications.

## Features

- **Breadcrumb navigation**: Hierarchical navigation with clickable links
- **Page titles**: Support for both standalone titles and breadcrumb-based titles
- **Action buttons**: Primary and secondary actions with overflow menu
- **Responsive design**: Adapts to different screen sizes
- **Sidebar integration**: Optional sidebar toggle functionality
- **Flexible layout**: Two variants - default and create-wizard

## Usage

\`\`\`tsx
import PageSection from '@thrive/ui/src/components/layout/page-section';

// Basic page with title
<PageSection pageTitle="Dashboard" />

// With breadcrumbs and actions
<PageSection
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Website Redesign' }
  ]}
  primaryAction={{
    label: 'Save Changes',
    onClick: () => {}
  }}
  secondaryActions={[
    { label: 'Preview', onClick: () => {} }
  ]}
/>
\`\`\`

## Variants

- **default**: Standard page header layout
- **create-wizard**: Specialized layout for multi-step forms
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		showSidebarToggle: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof PageSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		pageTitle: 'Dashboard',
	},
	render: args => (
		<div className="bg-bg min-h-screen">
			<PageSection {...args} />
		</div>
	),
};

export const WithBreadcrumbs: Story = {
	render: () => (
		<div className="bg-panel min-h-screen">
			<PageSection
				breadcrumbs={[
					{ label: 'Home', href: '/' },
					{ label: 'Projects', href: '/projects' },
					{ label: 'Website Redesign' },
				]}
			/>
		</div>
	),
};

export const WithActions: Story = {
	render: () => (
		<div className="bg-panel min-h-screen">
			<PageSection
				pageTitle="User Management"
				primaryAction={{
					label: 'Add User',
					href: '/add-user',
					onClick: () => alert('Add user clicked'),
				}}
				secondaryActions={[
					{
						label: 'Import Users',
						onClick: () => alert('Import clicked'),
						href: '/import-users',
					},
					{
						label: 'Export CSV',
						onClick: () => alert('Export clicked'),
						href: '/export-csv',
					},
				]}
				otherActions={[
					{
						label: 'Settings',
						onClick: () => alert('Settings clicked'),
					},
					{
						label: 'Help',
						onClick: () => alert('Help clicked'),
					},
				]}
			/>
		</div>
	),
};

export const WithBreadcrumbActions: Story = {
	name: 'With Breadcrumb Actions',
	parameters: {
		docs: {
			description: {
				story: `
Breadcrumbs can have actions attached to them. When the last breadcrumb has actions defined, 
a dropdown menu appears next to the title with the specified actions.

Each action can have:
- \`label\`: The action text
- \`icon\`: An optional icon (React element)
- \`onClick\`: Handler function
- \`isDelete\`: Boolean to style as destructive action
				`,
			},
		},
	},
	render: () => (
		<div className="bg-panel min-h-screen">
			<PageSection
				breadcrumbs={[
					{ label: 'Campaigns', href: '/campaigns' },
					{
						label: 'Summer Sale Campaign',
						actions: [
							{
								label: 'Rename',
								icon: <MdOutlineEdit />,
								onClick: () => alert('Rename clicked'),
							},
							{
								label: 'Duplicate',
								icon: <MdOutlineCopyAll />,
								onClick: () => alert('Duplicate clicked'),
							},
							{
								label: 'Archive',
								icon: <MdOutlineArchive />,
								onClick: () => alert('Archive clicked'),
							},
							{
								label: 'Delete',
								icon: <MdOutlineDelete />,
								isDelete: true,
								onClick: () => alert('Delete clicked'),
							},
						],
					},
				]}
				primaryAction={{
					label: 'Save Changes',
					onClick: () => alert('Save clicked'),
				}}
			/>
		</div>
	),
};

export const BreadcrumbActionsFolder: Story = {
	name: 'Breadcrumb Actions - Folder Example',
	render: () => (
		<div className="bg-panel min-h-screen">
			<PageSection
				breadcrumbs={[
					{ label: 'Documents', href: '/documents' },
					{ label: 'Projects', href: '/documents/projects' },
					{
						label: 'Q4 Reports',
						actions: [
							{
								label: 'Rename folder',
								icon: <MdOutlineEdit />,
								onClick: () => alert('Rename folder'),
							},
							{
								label: 'Delete folder',
								icon: <MdOutlineDelete />,
								isDelete: true,
								onClick: () => alert('Delete folder'),
							},
						],
					},
				]}
			/>
		</div>
	),
};

// --- Page Section Wizard Stories ---

function StandaloneWizardDemo() {
	const [title, setTitle] = useState('My New Campaign');
	const [currentStep, setCurrentStep] = useState(0);

	const steps = [
		{ id: 'details', label: 'Details' },
		{ id: 'content', label: 'Content' },
		{ id: 'audience', label: 'Audience' },
		{ id: 'review', label: 'Review' },
	];

	return (
		<div className="bg-bg min-h-screen">
			<PageSectionWizard
				title={title}
				onTitleChange={setTitle}
				onTitleChangeEnd={newTitle => console.log('Title saved:', newTitle)}
				currentStep={currentStep}
				totalSteps={steps.length}
				steps={steps}
				onStepClick={setCurrentStep}
			/>
			<div className="p-8">
				<div className="bg-panel rounded-lg p-6 border border-border">
					<h2 className="text-lg font-semibold mb-4">{steps[currentStep].label}</h2>
					<p className="text-muted-foreground">
						Content for step {currentStep + 1}: {steps[currentStep].label}
					</p>
					<div className="mt-6 flex gap-2">
						<Button
							variant="secondary"
							onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
							disabled={currentStep === 0}
						>
							Previous
						</Button>
						<Button
							variant="primary"
							onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
							disabled={currentStep === steps.length - 1}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export const WizardDefault: Story = {
	name: 'Wizard Default',
	render: () => (
		<div className="bg-bg min-h-screen">
			<PageSectionWizard
				title="Create Campaign"
				currentStep={1}
				totalSteps={4}
				steps={[
					{ id: 'details', label: 'Campaign Details' },
					{ id: 'content', label: 'Email Content' },
					{ id: 'audience', label: 'Select Audience' },
					{ id: 'review', label: 'Review & Send' },
				]}
			/>
		</div>
	),
};

export const WizardEditableTitle: Story = {
	name: 'Wizard Editable Title',

	parameters: {
		docs: {
			description: {
				story: `
When \`onTitleChange\` is provided, the title becomes editable. 
Click the title or the edit icon to start editing. 
Press Enter or click outside to finish editing.
				`,
			},
		},
	},

	render: () => <StandaloneWizardDemo />,
};

export const WizardWithStepperContext: Story = {
	name: 'Wizard With Stepper Context',
	parameters: {
		docs: {
			description: {
				story: `
PageSectionWizard can read step state from the parent \`<Stepper>\` context.
This allows seamless integration with the full Stepper component system.
				`,
			},
		},
	},
	render: () => {
		const [activeStep, setActiveStep] = useState('step-1');
		const [title, setTitle] = useState('Campaign Builder');

		const stepValues = ['step-1', 'step-2', 'step-3'];
		const stepLabels = ['Details', 'Content', 'Review'];

		return (
			<div className="bg-bg min-h-screen">
				<Stepper value={activeStep} onValueChange={setActiveStep}>
					<PageSectionWizard
						title={title}
						onTitleChange={setTitle}
						steps={stepValues.map((id, i) => ({ id, label: stepLabels[i] }))}
					/>
					<div className="p-8">
						<StepperContent value="step-1">
							<div className="bg-panel rounded-lg p-6 border border-border">
								<h2 className="text-lg font-semibold mb-2">Step 1: Details</h2>
								<p className="text-muted-foreground">Enter campaign details here.</p>
							</div>
						</StepperContent>
						<StepperContent value="step-2">
							<div className="bg-panel rounded-lg p-6 border border-border">
								<h2 className="text-lg font-semibold mb-2">Step 2: Content</h2>
								<p className="text-muted-foreground">Create your email content.</p>
							</div>
						</StepperContent>
						<StepperContent value="step-3">
							<div className="bg-panel rounded-lg p-6 border border-border">
								<h2 className="text-lg font-semibold mb-2">Step 3: Review</h2>
								<p className="text-muted-foreground">Review and send your campaign.</p>
							</div>
						</StepperContent>
					</div>
				</Stepper>
			</div>
		);
	},
};
