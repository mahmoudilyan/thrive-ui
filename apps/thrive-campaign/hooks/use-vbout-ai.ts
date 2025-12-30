import { useState, useCallback } from 'react';
import { useApiMutation } from '@/hooks/use-api';
import { ApiEndpoint } from '@/services/config/api';

export type AIGenerationType =
	| 'existing-post'
	| 'top-performing'
	| 'custom-topic'
	| 'article'
	| 'generate-more'
	| 'make-confident'
	| 'make-friendly'
	| 'make-professional'
	| 'translate';

export interface AIGenerationOptions {
	type: AIGenerationType;
	topic?: string;
	additionalInfo?: string;
	includeEmojis?: boolean;
	selectedProfiles?: string[];
	brandVoice?: string;
	language?: string;
}

export interface GeneratedContent {
	id: string;
	content: string;
	characterCount: number;
	platform?: string;
}

interface AIContentGenerationState {
	credits: number;
	enabled: boolean;
}

// Temporary API endpoint configuration - should be moved to API_CONFIG
const generateAIContentEndpoint: ApiEndpoint<void> = {
	createKey: () => ['social', 'generateAIContent'],
	url: '/api/social/generate-ai-content', // This will need to be updated with actual endpoint
	method: 'POST',
	contentType: 'json',
};

export const useVboutAI = () => {
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [contentGeneration, setContentGeneration] = useState<AIContentGenerationState>({
		credits: 100, // Default credits - should be fetched from user profile
		enabled: true,
	});

	const generateMessages = useCallback((options: AIGenerationOptions) => {
		const basePrompt = options.topic || '';
		const additionalContext = options.additionalInfo || '';

		let systemMessage = '';
		let userMessage = '';

		switch (options.type) {
			case 'custom-topic':
				systemMessage = `You are a social media content expert. Create engaging posts based on the given topic. 
					${options.includeEmojis ? 'Include relevant emojis.' : 'Do not include emojis.'}
					The tone should be ${options.brandVoice || 'professional'}.
					Create 3 different variations, each separated by two newlines.`;
				userMessage = `Topic: ${basePrompt}${additionalContext ? `\nAdditional context: ${additionalContext}` : ''}`;
				break;

			case 'make-confident':
				systemMessage =
					'You are a social media expert that rewrites content to be more confident, assertive, and authoritative while maintaining the core message.';
				userMessage = `Rewrite this to be more confident: ${basePrompt}`;
				break;

			case 'make-friendly':
				systemMessage =
					'You are a social media expert that rewrites content to be more friendly, approachable, and conversational while maintaining the core message.';
				userMessage = `Rewrite this to be more friendly: ${basePrompt}`;
				break;

			case 'make-professional':
				systemMessage =
					'You are a social media expert that rewrites content to be more professional, formal, and business-appropriate while maintaining the core message.';
				userMessage = `Rewrite this to be more professional: ${basePrompt}`;
				break;

			case 'top-performing':
				systemMessage =
					'You are a social media expert. Create engaging content similar to top-performing posts in the industry. Create 3 variations separated by two newlines.';
				userMessage = `Generate content for: ${basePrompt}`;
				break;

			default:
				systemMessage =
					'You are a social media content expert. Create engaging posts that resonate with the audience.';
				userMessage = basePrompt;
		}

		return [
			{ role: 'system', content: systemMessage },
			{ role: 'user', content: userMessage },
		];
	}, []);

	const mutation = useApiMutation(generateAIContentEndpoint);

	const generateContent = async (options: AIGenerationOptions) => {
		setIsGenerating(true);
		setError(null);
		setGeneratedContent([]);

		try {
			const messages = generateMessages(options);

			// For now, use mock data since the backend endpoint isn't ready
			if (process.env.NODE_ENV === 'development') {
				// Simulate API delay
				await new Promise(resolve => setTimeout(resolve, 2000));

				// Mock response based on type
				const mockContent = getMockContent(options);
				setGeneratedContent(mockContent);

				// Simulate credit deduction
				setContentGeneration(prev => ({
					...prev,
					credits: Math.max(0, prev.credits - 1),
				}));

				return mockContent;
			}

			// When backend is ready, use this:
			const response = await mutation.mutateAsync({
				messages,
				platforms: options.selectedProfiles,
				includeEmojis: options.includeEmojis,
			});

			if (response.status === 'success') {
				const contents = parseGeneratedContent(response.output);
				setGeneratedContent(contents);

				if (response.remaining_credits !== undefined) {
					setContentGeneration(prev => ({
						...prev,
						credits: response.remaining_credits,
					}));
				}

				return contents;
			} else {
				setError(response.message || 'Failed to generate content');
				return [];
			}
		} catch (err) {
			setError('Failed to generate content. Please try again.');
			return [];
		} finally {
			setIsGenerating(false);
		}
	};

	const regenerateContent = async (options: AIGenerationOptions) => {
		return generateContent(options);
	};

	const clearContent = () => {
		setGeneratedContent([]);
		setError(null);
	};

	const updateCredits = useCallback((newCredits: number) => {
		setContentGeneration(prev => ({
			...prev,
			credits: newCredits,
		}));
	}, []);

	return {
		generateContent,
		regenerateContent,
		clearContent,
		isGenerating,
		generatedContent,
		error,
		contentGeneration,
		updateCredits,
	};
};

// Helper function to parse AI response into structured content
function parseGeneratedContent(output: string): GeneratedContent[] {
	// If the output contains multiple variations separated by double newlines
	const variations = output.split(/\n\n/).filter(text => text.trim());

	if (variations.length > 1) {
		return variations.map((content, index) => ({
			id: `generated-${Date.now()}-${index}`,
			content: content.trim(),
			characterCount: content.trim().length,
		}));
	}

	// Single content response
	return [
		{
			id: `generated-${Date.now()}`,
			content: output.trim(),
			characterCount: output.trim().length,
		},
	];
}

// Mock content generator for development
function getMockContent(options: AIGenerationOptions): GeneratedContent[] {
	const baseContent = getBaseContent(options);

	return baseContent.map((content, index) => ({
		id: `generated-${Date.now()}-${index}`,
		content: options.includeEmojis ? addEmojis(content, options.type) : content,
		characterCount: content.length,
	}));
}

function getBaseContent(options: AIGenerationOptions): string[] {
	switch (options.type) {
		case 'custom-topic':
			return [
				`Discover the power of ${options.topic || 'innovation'}. Transform your approach and achieve remarkable results with our proven strategies.`,
				`Ready to revolutionize your ${options.topic || 'workflow'}? Join thousands who have already made the switch and are seeing incredible outcomes.`,
				`The future of ${options.topic || 'technology'} is here. Don't get left behind – embrace the change and lead the way forward.`,
			];
		case 'make-confident':
			return [
				`We're the industry leaders in delivering exceptional results. Our proven track record speaks for itself, with thousands of satisfied clients worldwide.`,
			];
		case 'make-friendly':
			return [
				`Hey there! We're so excited to share this with you. It's been an amazing journey, and we'd love for you to be part of it too!`,
			];
		case 'make-professional':
			return [
				`Our comprehensive solution delivers measurable results through strategic implementation and data-driven insights. Experience enterprise-grade performance with proven ROI.`,
			];
		default:
			return [
				`Unlock new possibilities with our innovative solutions. Start your journey today.`,
				`Transform your business with cutting-edge technology. See results from day one.`,
				`Join the revolution. Thousands of users are already experiencing the difference.`,
			];
	}
}

function addEmojis(content: string, type: AIGenerationType): string {
	const emojiMap = {
		'custom-topic': '🚀',
		'make-confident': '💪',
		'make-friendly': '😊',
		'make-professional': '📊',
		'top-performing': '⭐',
		'existing-post': '📝',
		article: '📰',
		'generate-more': '✨',
		translate: '🌐',
	};

	const emoji = emojiMap[type] || '✨';
	return `${emoji} ${content}`;
}
