import type { FormBuilderData, FormField, FormDependency } from '@/types/form-builder';

export interface ValidationError {
	type: 'error' | 'warning';
	message: string;
	field?: string;
	step?: string;
}

export function validateForm(formData: FormBuilderData): ValidationError[] {
	const errors: ValidationError[] = [];

	// Validate form has at least one field
	if (formData.fields.length === 0) {
		errors.push({
			type: 'error',
			message: 'Form must have at least one field',
		});
	}

	// Validate email field exists
	const hasEmailField = formData.fields.some(f => f.secret === 'email');
	if (!hasEmailField) {
		errors.push({
			type: 'error',
			message: 'Form must have an email field',
		});
	}

	// Validate required fields
	formData.fields.forEach(field => {
		if (!field.name.trim()) {
			errors.push({
				type: 'error',
				message: `Field is missing a name`,
				field: field.id,
			});
		}

		// Validate options for select/radio/checkbox fields
		if (['select', 'radio', 'checkbox'].includes(field.type)) {
			if (!field.validation || !['countries', 'states', 'cities'].includes(field.validation)) {
				if (!Array.isArray(field.options) || field.options.length === 0) {
					errors.push({
						type: 'error',
						message: `Field "${field.name}" must have at least one option`,
						field: field.id,
					});
				}
			}
		}

		// Validate file field
		if (field.type === 'file') {
			if (
				!field.allowedExtensions ||
				!Array.isArray(field.allowedExtensions) ||
				field.allowedExtensions.length === 0
			) {
				errors.push({
					type: 'warning',
					message: `File field "${field.name}" should specify allowed extensions`,
					field: field.id,
				});
			}
		}
	});

	// Validate steps
	formData.steps.forEach(step => {
		if (!step.isDefault) {
			const visibleFields = step.fields.filter(f => !f.private);
			if (visibleFields.length === 0) {
				errors.push({
					type: 'warning',
					message: `Step "${step.title || 'Untitled'}" has no visible fields`,
					step: step.id,
				});
			}
		}
	});

	// Validate sender details
	if (
		formData.settings.doubleOptIn ||
		formData.settings.autoresponder ||
		formData.settings.notifyAdmins
	) {
		if (!formData.settings.fromEmail) {
			errors.push({
				type: 'error',
				message: 'From Email is required for email communications',
			});
		}

		if (!isValidEmail(formData.settings.fromEmail)) {
			errors.push({
				type: 'error',
				message: 'From Email is invalid',
			});
		}

		if (!formData.settings.fromName.trim()) {
			errors.push({
				type: 'error',
				message: 'From Name is required for email communications',
			});
		}

		if (!formData.settings.replyTo) {
			errors.push({
				type: 'error',
				message: 'Reply-to Email is required for email communications',
			});
		}

		if (!isValidEmail(formData.settings.replyTo)) {
			errors.push({
				type: 'error',
				message: 'Reply-to Email is invalid',
			});
		}
	}

	// Validate redirect URLs
	if (formData.settings.redirect && formData.settings.redirectUrl) {
		if (!isValidUrl(formData.settings.redirectUrl)) {
			errors.push({
				type: 'error',
				message: 'Redirect URL is invalid',
			});
		}
	}

	if (formData.settings.confirmRedirect && formData.settings.confirmRedirectUrl) {
		if (!isValidUrl(formData.settings.confirmRedirectUrl)) {
			errors.push({
				type: 'error',
				message: 'Confirmation Redirect URL is invalid',
			});
		}
	}

	// Validate circular dependencies
	const circularDeps = findCircularDependencies(formData.dependencies);
	if (circularDeps.length > 0) {
		errors.push({
			type: 'error',
			message: 'Circular dependencies detected in conditional logic',
		});
	}

	return errors;
}

export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
	} catch {
		return false;
	}
}

export function findCircularDependencies(dependencies: FormDependency[]): string[] {
	const graph = new Map<string, Set<string>>();

	// Build dependency graph
	dependencies.forEach(dep => {
		if (!graph.has(dep.targetFieldId)) {
			graph.set(dep.targetFieldId, new Set());
		}
		graph.get(dep.targetFieldId)!.add(dep.sourceFieldId);
	});

	// Check for cycles using DFS
	const visited = new Set<string>();
	const recursionStack = new Set<string>();
	const cycles: string[] = [];

	const hasCycle = (node: string): boolean => {
		visited.add(node);
		recursionStack.add(node);

		const neighbors = graph.get(node);
		if (neighbors) {
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					if (hasCycle(neighbor)) {
						cycles.push(node);
						return true;
					}
				} else if (recursionStack.has(neighbor)) {
					cycles.push(node);
					return true;
				}
			}
		}

		recursionStack.delete(node);
		return false;
	};

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			hasCycle(node);
		}
	}

	return cycles;
}

export function getFieldTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		text: 'Text',
		email: 'Email',
		url: 'URL',
		textarea: 'Textarea',
		digits: 'Number',
		phone: 'Phone',
		select: 'Select',
		radio: 'Radio',
		checkbox: 'Checkbox',
		date: 'Date',
		birthday: 'Birthday',
		file: 'File',
		gdpr: 'GDPR Consent',
		captcha: 'reCAPTCHA',
		'payment-products': 'Products',
		'payment-shipping': 'Shipping',
		'payment-billing': 'Billing',
		'payment-checkout': 'Checkout',
	};

	return labels[type] || type;
}
