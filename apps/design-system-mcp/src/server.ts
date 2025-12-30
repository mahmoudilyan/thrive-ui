/**
 * HTTP/SSE Server for Design System MCP
 * Main entry point for the MCP server with HTTP transport
 */

import express from 'express';
import { config } from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
	ListToolsRequestSchema,
	CallToolRequestSchema,
	Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { authenticateRequest, AuthenticatedRequest } from './middleware/auth.js';
import { createMCPContext } from './mcp/context.js';
import { getToolRegistry } from './tools/index.js';
import { buildComponentIndex } from './indexer/index.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		service: 'design-system-mcp',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
	});
});

// Initialize component index on startup
console.log('🚀 Initializing Design System MCP Server...');
try {
	buildComponentIndex();
	console.log('✅ Component index ready');
} catch (error) {
	console.error('❌ Failed to build component index:', error);
	process.exit(1);
}

/**
 * Creates an MCP server instance for a request
 */
function createMCPServerInstance(req: AuthenticatedRequest): Server {
	const context = createMCPContext({
		authenticated: req.auth?.authenticated || false,
		apiKey: req.auth?.apiKey,
		timestamp: req.auth?.timestamp || Date.now(),
	});

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

// MCP endpoint with SSE transport
app.get('/mcp', authenticateRequest, async (req: AuthenticatedRequest, res) => {
	console.log('📡 New MCP connection established');

	const server = createMCPServerInstance(req);
	const transport = new SSEServerTransport('/mcp', res);

	await server.connect(transport);
	console.log('✅ MCP server connected via SSE');
});

// MCP message endpoint - matches the SSE transport endpoint
app.post('/mcp', authenticateRequest, async (req: AuthenticatedRequest, res) => {
	// This endpoint is handled by the SSE transport
	// The SSE transport will handle the actual message routing
	res.status(200).end();
});

// Root endpoint
app.get('/', (req, res) => {
	res.json({
		name: 'Design System MCP Server',
		version: '1.0.0',
		description: 'AI-powered component generation for Thrive Design System',
		endpoints: {
			health: '/health',
			mcp: '/mcp',
		},
		documentation: 'https://github.com/your-org/thrive-campaign',
	});
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error('❌ Server error:', err);
	res.status(500).json({
		error: 'Internal server error',
		message: process.env.NODE_ENV === 'development' ? err.message : undefined,
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`\n🎉 Design System MCP Server running on port ${PORT}`);
	console.log(`📍 MCP endpoint: http://localhost:${PORT}/mcp`);
	console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});

export default app;
