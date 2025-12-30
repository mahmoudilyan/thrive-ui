/**
 * Generate Component Tool
 * AI-powered component generation using natural language descriptions
 */

import { z } from 'zod';
import { generateComponent } from '../generators/code-generator.js';
import { GenerateComponentRequest } from '../types.js';

export const generateComponentSchema = z.object({
  description: z
    .string()
    .describe(
      'Natural language description of the component to generate. Be specific about requirements, layout, and functionality.'
    ),
  includeTypes: z
    .boolean()
    .optional()
    .describe('Include TypeScript type definitions (default: true)'),
  includeImports: z
    .boolean()
    .optional()
    .describe('Include import statements (default: true)'),
});

export type GenerateComponentInput = z.infer<typeof generateComponentSchema>;

/**
 * Generates a React component based on natural language description
 */
export async function generateComponentTool(input: GenerateComponentInput) {
  const request: GenerateComponentRequest = {
    description: input.description,
    includeTypes: input.includeTypes ?? true,
    includeImports: input.includeImports ?? true,
  };

  try {
    const result = await generateComponent(request);

    return {
      success: true,
      code: result.code,
      componentsUsed: result.components,
      imports: result.imports,
      explanation: result.explanation,
      usage: 'Copy the generated code directly into your project. All imports are from the design system (@repo/ui).',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
      suggestion: 'Try rephrasing your description or check that ANTHROPIC_API_KEY is set correctly.',
    };
  }
}

