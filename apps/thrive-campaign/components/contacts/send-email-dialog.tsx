'use client';

import { useState } from 'react';
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@thrive/ui';
import { MdEmail, MdSend } from 'react-icons/md';
import type { Contact } from '@/types/contacts';

interface SendEmailDialogProps {
	onClose: () => void;
	contact: Contact;
	dialogTitle?: string;
	dialogDescription?: string;
	onSubmit?: (data: EmailData) => void;
}

interface EmailData {
	to: string;
	subject: string;
	message: string;
	template?: string;
}

const emailTemplates = [
	{ value: '', label: 'No template' },
	{ value: 'welcome', label: 'Welcome Email' },
	{ value: 'newsletter', label: 'Newsletter' },
	{ value: 'promotion', label: 'Promotional Email' },
	{ value: 'followup', label: 'Follow-up Email' },
];

export default function SendEmailDialog({
	onClose,
	contact,
	dialogTitle = 'Send Email',
	dialogDescription = 'Send an email to this contact',
	onSubmit,
}: SendEmailDialogProps) {
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [selectedTemplate, setSelectedTemplate] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleTemplateChange = (templateValue: string) => {
		setSelectedTemplate(templateValue);

		// Auto-fill based on template
		switch (templateValue) {
			case 'welcome':
				setSubject('Welcome to our platform!');
				setMessage(
					`Hi there,\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`
				);
				break;
			case 'newsletter':
				setSubject('Our Latest Newsletter');
				setMessage(
					`Hi,\n\nHere's our latest newsletter with updates and news.\n\nBest regards,\nThe Team`
				);
				break;
			case 'promotion':
				setSubject('Special Offer Just for You!');
				setMessage(
					`Hi,\n\nWe have a special offer that we think you'll love!\n\nBest regards,\nThe Team`
				);
				break;
			case 'followup':
				setSubject('Following up on our conversation');
				setMessage(
					`Hi,\n\nI wanted to follow up on our recent conversation.\n\nBest regards,\nThe Team`
				);
				break;
			default:
				// Don't clear if no template selected
				break;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!subject.trim() || !message.trim()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const emailData: EmailData = {
				to: contact.email,
				subject: subject.trim(),
				message: message.trim(),
				template: selectedTemplate || undefined,
			};

			if (onSubmit) {
				await onSubmit(emailData);
			}
			onClose();
		} catch (error) {
			console.error('Failed to send email:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
						<MdEmail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-4 py-4">
				{/* Recipient Info */}
				<div className="bg-bg-subtle p-3 rounded-md">
					<div className="flex items-center gap-2 text-sm">
						<MdEmail className="w-4 h-4 text-ink-light" />
						<span className="font-medium">To:</span>
						<span>{contact.email}</span>
					</div>
					{contact.phone && (
						<div className="mt-1 text-xs text-ink-light">Phone: {contact.phone}</div>
					)}
				</div>

				{/* Email Template */}
				<div>
					<label htmlFor="email-template" className="block text-sm font-medium text-ink mb-1">
						Email Template
					</label>
					<Select value={selectedTemplate} onValueChange={handleTemplateChange}>
						<SelectTrigger>
							<SelectValue placeholder="Choose a template (optional)" />
						</SelectTrigger>
						<SelectContent>
							{emailTemplates.map(template => (
								<SelectItem key={template.value} value={template.value}>
									{template.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Subject */}
				<div>
					<label htmlFor="email-subject" className="block text-sm font-medium text-ink mb-1">
						Subject *
					</label>
					<Input
						id="email-subject"
						value={subject}
						onChange={e => setSubject(e.target.value)}
						placeholder="Enter email subject"
						required
					/>
				</div>

				{/* Message */}
				<div>
					<label htmlFor="email-message" className="block text-sm font-medium text-ink mb-1">
						Message *
					</label>
					<textarea
						id="email-message"
						value={message}
						onChange={e => setMessage(e.target.value)}
						placeholder="Enter your message"
						required
						rows={8}
						className="w-full px-3 py-2 border border-border rounded-md bg-bg text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
					/>
				</div>

				{/* Character count */}
				<div className="text-xs text-ink-light text-right">{message.length} characters</div>
			</div>

			<DialogFooter>
				<Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					disabled={!subject.trim() || !message.trim() || isSubmitting}
				>
					<MdSend className="mr-2 w-4 h-4" />
					{isSubmitting ? 'Sending...' : 'Send Email'}
				</Button>
			</DialogFooter>
		</form>
	);
}
