'use client';

import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@thrive/ui';
import MessageComposer from '@thrive/ui/components/common-dialogs/compose/message-composer';
import { MdSend } from 'react-icons/md';

interface MessageComposerDialogProps {
	onClose: () => void;
	initialMessage?: string;
	selectedChannels?: string[];
	characterLimit?: number;
	onSubmit?: (message: string) => void | Promise<void>;
	title?: string;
	description?: string;
	submitButtonText?: string;
}

export default function MessageComposerDialog({
	onClose,
	initialMessage = '',
	selectedChannels = [],
	characterLimit,
	onSubmit,
	title = 'Compose Message',
	description = 'Write your message for social media channels',
	submitButtonText = 'Send',
}: MessageComposerDialogProps) {
	const [message, setMessage] = useState(initialMessage);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!message.trim()) {
			return;
		}

		setIsSubmitting(true);

		try {
			if (onSubmit) {
				await onSubmit(message);
			}
			onClose();
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleMediaPicker = () => {
		console.log('Open media picker');
		// You can implement media picker logic here
	};

	return (
		<>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
						<MdSend className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="py-4">
				<MessageComposer
					message={message}
					onMessageChange={setMessage}
					characterLimit={characterLimit}
					selectedChannels={selectedChannels}
					onOpenMediaPicker={handleMediaPicker}
				/>
			</div>

			<DialogFooter>
				<Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleSubmit} disabled={!message.trim() || isSubmitting}>
					{isSubmitting ? 'Sending...' : submitButtonText}
				</Button>
			</DialogFooter>
		</>
	);
}
