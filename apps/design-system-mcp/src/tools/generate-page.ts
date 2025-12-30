/**
 * Generate Page Tool
 * AI-powered page generation with multiple components
 */

import { z } from 'zod';
import { generatePage } from '../generators/code-generator.js';

export const generatePageSchema = z.object({
  description: z
    .string()
    .describe(
      'Natural language description of the page to generate. Include details about sections, features, and functionality.'
    ),
});

export type GeneratePageInput = z.infer<typeof generatePageSchema>;

/**
 * Generates a complete page with multiple components
 */
export async function generatePageTool(input: GeneratePageInput) {
  try {
    const result = await generatePage(input.description);

    return {
      success: true,
      code: result.code,
      componentsUsed: result.components,
      imports: result.imports,
      explanation: result.explanation,
      usage: 'This is a complete page component. Save it as a .tsx file and use it in your Next.js app.',
      tips: [
        'Wrap async components in Suspense if needed',
        'Add error boundaries for production',
        'Consider data fetching patterns (Server Components, etc.)',
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
      suggestion: 'Try breaking down the page into smaller components or provide more specific details.',
    };
  }
}

