/**
 * Request context for MCP operations
 */

import { AuthContext } from '../types.js';

export interface MCPContext {
	auth: AuthContext;
	requestId: string;
	timestamp: number;
}

/**
 * Creates an MCP context from authentication data
 */
export function createMCPContext(auth: AuthContext): MCPContext {
	return {
		auth,
		requestId: `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		timestamp: Date.now(),
	};
}

/**
 * Validates MCP context has required authentication
 */
export function validateContext(context: MCPContext): boolean {
	return context.auth.authenticated === true;
}
