/**
 * Tool Registry
 * Central registry for all MCP tools
 */

import { MCPContext } from '../mcp/context.js';
import { listComponents, listComponentsSchema } from './list-components.js';
import { getComponentInfo, getComponentInfoSchema } from './get-component-info.js';
import { generateComponentTool, generateComponentSchema } from './generate-component.js';
import { generatePageTool, generatePageSchema } from './generate-page.js';

export interface MCPTool {
	name: string;
	description: string;
	inputSchema: {
		type: 'object';
		properties: Record<string, unknown>;
		required?: string[];
	};
	handler: (input: unknown) => Promise<unknown>;
}

/**
 * Converts Zod schema to JSON Schema format for MCP
 */
function zodToJsonSchema(zodSchema: any): any {
	// Simple conversion - in production, use @zod-to-json-schema
	const shape = zodSchema._def.shape();
	const properties: Record<string, any> = {};
	const required: string[] = [];

	for (const [key, value] of Object.entries(shape)) {
		const field = value as any;
		properties[key] = {
			type: 'string', // Simplified - would need proper type mapping
			description: field.description || '',
		};

		if (!field.isOptional()) {
			required.push(key);
		}
	}

	return {
		type: 'object',
		properties,
		required: required.length > 0 ? required : undefined,
	};
}

/**
 * Gets the tool registry with all available tools
 */
export function getToolRegistry(context: MCPContext): Map<string, MCPTool> {
	const tools = new Map<string, MCPTool>();

	// List Components Tool
	tools.set('list-components', {
		name: 'list-components',
		description:
			'List all available design system components with optional filtering by category or status',
		inputSchema: zodToJsonSchema(listComponentsSchema),
		handler: async input => listComponents(input as any),
	});

	// Get Component Info Tool
	tools.set('get-component-info', {
		name: 'get-component-info',
		description:
			'Get detailed information about a specific component including props, examples, best practices, and accessibility guidelines',
		inputSchema: zodToJsonSchema(getComponentInfoSchema),
		handler: async input => getComponentInfo(input as any),
	});

	// Generate Component Tool
	tools.set('generate-component', {
		name: 'generate-component',
		description:
			'Generate a React/TypeScript component using AI based on natural language description. Uses design system components and follows best practices.',
		inputSchema: zodToJsonSchema(generateComponentSchema),
		handler: async input => generateComponentTool(input as any),
	});

	// Generate Page Tool
	tools.set('generate-page', {
		name: 'generate-page',
		description:
			'Generate a complete page with multiple components using AI. Creates production-ready page layouts with proper structure.',
		inputSchema: zodToJsonSchema(generatePageSchema),
		handler: async input => generatePageTool(input as any),
	});

	return tools;
}
