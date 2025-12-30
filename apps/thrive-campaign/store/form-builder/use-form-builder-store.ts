import { create } from 'zustand';
import { produce } from 'immer';
import type {
	FormBuilderData,
	FormField,
	FormStep,
	FormSettings,
	FormDependency,
	PaymentSettings,
} from '@/types/form-builder';

interface FormBuilderState {
	// Form data
	formId: string | null;
	formName: string;
	formTitle: string;
	formLogo: string;
	fields: FormField[];
	steps: FormStep[];
	settings: FormSettings;
	dependencies: FormDependency[];
	payment: PaymentSettings | null;
	submitButtonLabel: string;
	nextButtonLabel: string;
	previousButtonLabel: string;
	afterSubmitLabel: string;

	// UI state
	activeWizardStep: 'builder' | 'settings';
	selectedFieldId: string | null;
	isDragging: boolean;
	hasUnsavedChanges: boolean;

	// Actions
	loadForm: (data: FormBuilderData) => void;
	resetForm: () => void;
	setFormField: (field: keyof FormBuilderState, value: any) => void;

	// Field actions
	addField: (field: Omit<FormField, 'id' | 'order'>, stepId?: string) => void;
	removeField: (fieldId: string) => void;
	updateField: (fieldId: string, updates: Partial<FormField>) => void;
	reorderFields: (stepId: string, fieldIds: string[]) => void;
	selectField: (fieldId: string | null) => void;

	// Step actions
	addStep: (step: Omit<FormStep, 'id' | 'order'>) => void;
	convertToMultiStep: () => void;
	removeStep: (stepId: string) => void;
	updateStep: (stepId: string, updates: Partial<FormStep>) => void;
	reorderSteps: (stepIds: string[]) => void;

	// Settings actions
	updateSettings: (settings: Partial<FormSettings>) => void;

	// Dependency actions
	addDependency: (dependency: Omit<FormDependency, 'id'>) => void;
	removeDependency: (dependencyId: string) => void;
	updateDependency: (dependencyId: string, updates: Partial<FormDependency>) => void;

	// Payment actions
	updatePayment: (payment: Partial<PaymentSettings>) => void;

	// Utility actions
	setIsDragging: (isDragging: boolean) => void;
	setActiveWizardStep: (step: 'builder' | 'settings') => void;
}

const DEFAULT_SETTINGS: FormSettings = {
	multipleSubmissions: false,
	doubleOptIn: true,
	hideSubscribeAgain: false,
	confirmRedirect: false,
	confirmRedirectUrl: '',
	confirmRedirectDirect: false,
	autoresponder: false,
	notifyAdmins: false,
	notifyEmails: [],
	redirect: false,
	redirectUrl: '',
	redirectDirect: false,
	skipSuccessMessage: false,
	overrideErrorMessages: false,
	customErrorMessages: {},
	allowEmptyFields: false,
	autoTag: false,
	autoTagTags: [],
	fromEmail: '',
	fromName: '',
	replyTo: '',
	emailSubject: 'Please confirm your subscription',
	confirmationEmail: {
		subject: 'Please confirm your subscription',
		content:
			'<p>Please click on the link below to confirm your subscription.</p><p><br></p><p>[CONFIRMATION_URL]</p><p><br></p><p>[BUSINESS_NAME]</p>',
	},
	successEmail: {
		subject: 'Welcome!',
		content:
			'<p>Your email is now confirmed! We are excited to have you on our list.</p><p><br></p><p>[BUSINESS_NAME]</p>',
	},
	confirmationMessage:
		'Your signup is almost complete! Please check your email for a confirmation message.',
	successMessage: 'Your subscription is now complete!',
	errorMessage: 'You have already been subscribed to this list!',
	notifyEmailSubject: 'New subscriber: [NEW_SUBSCRIBER_EMAIL]',
	notifyEmailMessage:
		'<p>A new subscriber [NEW_SUBSCRIBER_EMAIL] has joined your list: [LIST_NAME]</p>',
};

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
	// Initial state
	formId: null,
	formName: '',
	formTitle: '',
	formLogo: '',
	fields: [],
	steps: [
		{
			id: 'step-0',
			title: '',
			description: '',
			order: 0,
			isDefault: true,
			fields: [],
		},
	],
	settings: DEFAULT_SETTINGS,
	dependencies: [],
	payment: null,
	submitButtonLabel: 'Submit',
	nextButtonLabel: 'Next',
	previousButtonLabel: 'Previous',
	afterSubmitLabel: '< Back to Form',

	// UI state
	activeWizardStep: 'builder',
	selectedFieldId: null,
	isDragging: false,
	hasUnsavedChanges: false,

	// Actions
	loadForm: (data: FormBuilderData) =>
		set(
			produce((state: FormBuilderState) => {
				state.formId = data.id;
				state.formName = data.name;
				state.formTitle = data.title;
				state.formLogo = data.logo || '';
				state.fields = data.fields;
				state.steps = data.steps.length > 0 ? data.steps : state.steps;
				state.settings = { ...DEFAULT_SETTINGS, ...data.settings };
				state.dependencies = data.dependencies;
				state.payment = data.payment || null;
				state.submitButtonLabel = data.submitButtonLabel;
				state.nextButtonLabel = data.nextButtonLabel;
				state.previousButtonLabel = data.previousButtonLabel;
				state.afterSubmitLabel = data.afterSubmitLabel;
				state.hasUnsavedChanges = false;
			})
		),

	resetForm: () =>
		set(
			produce((state: FormBuilderState) => {
				state.formId = null;
				state.formName = '';
				state.formTitle = '';
				state.formLogo = '';
				state.fields = [];
				state.steps = [
					{
						id: 'step-0',
						title: '',
						description: '',
						order: 0,
						isDefault: true,
						fields: [],
					},
				];
				state.settings = DEFAULT_SETTINGS;
				state.dependencies = [];
				state.payment = null;
				state.selectedFieldId = null;
				state.hasUnsavedChanges = false;
			})
		),

	setFormField: (field, value) =>
		set(
			produce((state: FormBuilderState) => {
				(state as any)[field] = value;
				state.hasUnsavedChanges = true;
			})
		),

	// Field actions
	addField: (field, stepId) =>
		set(
			produce((state: FormBuilderState) => {
				const newFieldId = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				const targetStepId = stepId || 'step-0';
				const step = state.steps.find(s => s.id === targetStepId);

				if (!step) {
					console.error('Step not found:', targetStepId);
					return;
				}

				// Get max order within this step
				const maxOrder = Math.max(0, ...step.fields.map(f => f.order));

				const newField: FormField = {
					...field,
					id: newFieldId,
					order: maxOrder + 1,
					stepId: targetStepId,
				};

				state.fields.push(newField);
				step.fields.push(newField);
				state.hasUnsavedChanges = true;
			})
		),

	removeField: fieldId =>
		set(
			produce((state: FormBuilderState) => {
				state.fields = state.fields.filter(f => f.id !== fieldId);
				state.steps.forEach(step => {
					step.fields = step.fields.filter(f => f.id !== fieldId);
				});
				// Remove dependencies related to this field
				state.dependencies = state.dependencies.filter(
					d => d.targetFieldId !== fieldId && d.sourceFieldId !== fieldId
				);
				if (state.selectedFieldId === fieldId) {
					state.selectedFieldId = null;
				}
				state.hasUnsavedChanges = true;
			})
		),

	updateField: (fieldId, updates) =>
		set(
			produce((state: FormBuilderState) => {
				const field = state.fields.find(f => f.id === fieldId);
				if (field) {
					const oldStepId = field.stepId;
					const newStepId = updates.stepId;

					// If changing steps, handle the move
					if (newStepId && oldStepId !== newStepId) {
						// Remove from old step
						const oldStep = state.steps.find(s => s.id === oldStepId);
						if (oldStep) {
							oldStep.fields = oldStep.fields.filter(f => f.id !== fieldId);
						}

						// Add to new step
						const newStep = state.steps.find(s => s.id === newStepId);
						if (newStep) {
							newStep.fields.push(field);
						}
					}

					// Apply updates to field
					Object.assign(field, updates);

					// Update in step as well
					state.steps.forEach(step => {
						const stepField = step.fields.find(f => f.id === fieldId);
						if (stepField) {
							Object.assign(stepField, updates);
						}
					});
				}
				state.hasUnsavedChanges = true;
			})
		),

	reorderFields: (stepId, fieldIds) =>
		set(
			produce((state: FormBuilderState) => {
				const step = state.steps.find(s => s.id === stepId);
				if (step) {
					const reorderedFields = fieldIds
						.map(id => state.fields.find(f => f.id === id))
						.filter(Boolean) as FormField[];

					// Update order
					reorderedFields.forEach((field, index) => {
						field.order = index;
						field.stepId = stepId;
					});

					step.fields = reorderedFields;
					state.hasUnsavedChanges = true;
				}
			})
		),

	selectField: fieldId =>
		set(
			produce((state: FormBuilderState) => {
				state.selectedFieldId = fieldId;
			})
		),

	// Step actions
	addStep: step =>
		set(
			produce((state: FormBuilderState) => {
				const newStepId = `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				const maxOrder = Math.max(0, ...state.steps.map(s => s.order));

				const newStep: FormStep = {
					...step,
					id: newStepId,
					order: maxOrder + 1,
					fields: step.fields || [],
				};

				state.steps.push(newStep);
				state.hasUnsavedChanges = true;
			})
		),

	convertToMultiStep: () =>
		set(
			produce((state: FormBuilderState) => {
				const defaultStep = state.steps.find(s => s.isDefault);
				if (!defaultStep) return;

				// Get all current fields from default step
				const currentFields = [...defaultStep.fields];

				// Create Step 1 with current fields
				const step1Id = `step-${Date.now()}-1`;
				const step1: FormStep = {
					id: step1Id,
					title: 'Step 1',
					description: '',
					order: 1,
					isDefault: false,
					fields: [...currentFields],
				};

				// Create Step 2 empty
				const step2Id = `step-${Date.now()}-2`;
				const step2: FormStep = {
					id: step2Id,
					title: 'Step 2',
					description: '',
					order: 2,
					isDefault: false,
					fields: [],
				};

				// Update all fields in state.fields array to belong to Step 1
				state.fields.forEach(field => {
					if (field.stepId === defaultStep.id) {
						field.stepId = step1Id;
					}
				});

				// Update currentFields references to Step 1
				currentFields.forEach(field => {
					field.stepId = step1Id;
				});

				// Clear default step
				defaultStep.fields = [];

				// Add new steps
				state.steps.push(step1, step2);
				state.hasUnsavedChanges = true;
			})
		),

	removeStep: stepId =>
		set(
			produce((state: FormBuilderState) => {
				const step = state.steps.find(s => s.id === stepId);
				if (step && !step.isDefault) {
					// Move fields from this step to default step
					const defaultStep = state.steps.find(s => s.isDefault);
					if (defaultStep) {
						step.fields.forEach(field => {
							field.stepId = defaultStep.id;
							defaultStep.fields.push(field);
						});
					}

					state.steps = state.steps.filter(s => s.id !== stepId);
					state.hasUnsavedChanges = true;
				}
			})
		),

	updateStep: (stepId, updates) =>
		set(
			produce((state: FormBuilderState) => {
				const step = state.steps.find(s => s.id === stepId);
				if (step) {
					Object.assign(step, updates);
				}
				state.hasUnsavedChanges = true;
			})
		),

	reorderSteps: stepIds =>
		set(
			produce((state: FormBuilderState) => {
				const reorderedSteps = stepIds
					.map(id => state.steps.find(s => s.id === id))
					.filter(Boolean) as FormStep[];

				reorderedSteps.forEach((step, index) => {
					step.order = index;
				});

				state.steps = reorderedSteps;
				state.hasUnsavedChanges = true;
			})
		),

	// Settings actions
	updateSettings: settings =>
		set(
			produce((state: FormBuilderState) => {
				state.settings = { ...state.settings, ...settings };
				state.hasUnsavedChanges = true;
			})
		),

	// Dependency actions
	addDependency: dependency =>
		set(
			produce((state: FormBuilderState) => {
				const newDependency: FormDependency = {
					...dependency,
					id: `dep-${Date.now()}`,
				};
				state.dependencies.push(newDependency);
				state.hasUnsavedChanges = true;
			})
		),

	removeDependency: dependencyId =>
		set(
			produce((state: FormBuilderState) => {
				state.dependencies = state.dependencies.filter(d => d.id !== dependencyId);
				state.hasUnsavedChanges = true;
			})
		),

	updateDependency: (dependencyId, updates) =>
		set(
			produce((state: FormBuilderState) => {
				const dependency = state.dependencies.find(d => d.id === dependencyId);
				if (dependency) {
					Object.assign(dependency, updates);
				}
				state.hasUnsavedChanges = true;
			})
		),

	// Payment actions
	updatePayment: payment =>
		set(
			produce((state: FormBuilderState) => {
				state.payment = state.payment ? { ...state.payment, ...payment } : null;
				state.hasUnsavedChanges = true;
			})
		),

	// Utility actions
	setIsDragging: isDragging =>
		set(
			produce((state: FormBuilderState) => {
				state.isDragging = isDragging;
			})
		),

	setActiveWizardStep: step =>
		set(
			produce((state: FormBuilderState) => {
				state.activeWizardStep = step;
			})
		),
}));
