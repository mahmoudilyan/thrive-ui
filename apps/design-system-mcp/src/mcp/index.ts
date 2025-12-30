/**
 * MCP Protocol Handler
 * Handles Model Context Protocol communication
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	ListToolsRequestSchema,
	CallToolRequestSchema,
	Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { MCPContext } from './context.js';
import { getToolRegistry } from '../tools/index.js';

/**
 * Creates and configures the MCP server
 */
export function createMCPServer(context: MCPContext): Server {
	const server = new Server(
		{
			name: 'design-system-mcp',
			version: '1.0.0',
		},
		{
			capabilities: {
				tools: {},
			},
		}
	);

	// Get tool registry
	const toolRegistry = getToolRegistry(context);

	// Handle tool listing
	server.setRequestHandler(ListToolsRequestSchema, async () => {
		const tools: Tool[] = Array.from(toolRegistry.values()).map(tool => ({
			name: tool.name,
			description: tool.description,
			inputSchema: tool.inputSchema,
		}));

		return { tools };
	});

	// Handle tool calls
	server.setRequestHandler(CallToolRequestSchema, async request => {
		const toolName = request.params.name;
		const tool = toolRegistry.get(toolName);

		if (!tool) {
			throw new Error(`Unknown tool: ${toolName}`);
		}

		try {
			const result = await tool.handler(request.params.arguments || {});
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({
							error: errorMessage,
							tool: toolName,
						}),
					},
				],
				isError: true,
			};
		}
	});

	return server;
}

/**
 * Runs the MCP server with stdio transport
 */
export async function runStdioServer(context: MCPContext): Promise<void> {
	const server = createMCPServer(context);
	const transport = new StdioServerTransport();
	await server.connect(transport);

	console.error('MCP Server running on stdio');
}
