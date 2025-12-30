/**
 * Authentication middleware for team API key validation
 */

import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
	auth?: {
		authenticated: boolean;
		apiKey?: string;
		timestamp: number;
	};
}

/**
 * Simple API key authentication middleware
 * Validates the Authorization header against the TEAM_API_KEY environment variable
 */
export function authenticateRequest(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void {
	const teamApiKey = process.env.TEAM_API_KEY;

	// Skip auth in development if no key is set
	if (!teamApiKey && process.env.NODE_ENV === 'development') {
		req.auth = {
			authenticated: true,
			timestamp: Date.now(),
		};
		return next();
	}

	if (!teamApiKey) {
		res.status(500).json({
			error: 'Server configuration error: TEAM_API_KEY not set',
		});
		return;
	}

	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({
			error: 'Missing Authorization header',
			message: 'Include Authorization: Bearer <TEAM_API_KEY> in your request headers',
		});
		return;
	}

	// Support both "Bearer <key>" and just "<key>"
	const providedKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

	if (providedKey !== teamApiKey) {
		res.status(403).json({
			error: 'Invalid API key',
			message: 'The provided API key is not valid',
		});
		return;
	}

	// Attach auth context to request
	req.auth = {
		authenticated: true,
		apiKey: providedKey,
		timestamp: Date.now(),
	};

	next();
}

/**
 * Validates that request has authentication context
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
	if (!req.auth?.authenticated) {
		res.status(401).json({
			error: 'Authentication required',
		});
		return;
	}
	next();
}
