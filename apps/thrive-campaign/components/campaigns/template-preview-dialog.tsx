'use client';

import { useEffect, useState } from 'react';
import { Box, DialogHeader, DialogTitle, Flex, Spinner, Text } from '@thrive/ui';

interface TemplatePreviewDialogProps {
	templateId: string;
	templateName?: string;
	onClose: () => void;
}

export function TemplatePreviewDialog({
	templateId,
	templateName,
	onClose,
}: TemplatePreviewDialogProps) {
	const [htmlContent, setHtmlContent] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPreview = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const response = await fetch(`/api/App/Templates/PreviewTemplate/${templateId}.html`);

				if (!response.ok) {
					throw new Error('Failed to load preview');
				}

				const html = await response.text();
				setHtmlContent(html);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load preview');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPreview();
	}, [templateId]);

	return (
		<>
			<DialogHeader>
				<DialogTitle>{templateName ? `Preview: ${templateName}` : 'Template Preview'}</DialogTitle>
			</DialogHeader>
			<Box>
				{isLoading && (
					<Flex
						direction="col"
						align="center"
						justify="center"
						gap="4"
						className="h-[calc(100vh-200px)]"
					>
						<Spinner size="lg" />
						<Text>Loading preview...</Text>
					</Flex>
				)}

				{error && (
					<Flex direction="col" align="center" justify="center" className="h-[calc(100vh-200px)]">
						<Text className="text-red-500">{error}</Text>
					</Flex>
				)}

				{!isLoading && !error && htmlContent && (
					<Box className="w-full h-[calc(100vh-200px)] border rounded-md overflow-hidden">
						<iframe
							srcDoc={htmlContent}
							title="Email Template Preview"
							style={{
								width: '100%',
								height: '100%',
								border: 'none',
							}}
							sandbox="allow-same-origin"
						/>
					</Box>
				)}
			</Box>
		</>
	);
}
