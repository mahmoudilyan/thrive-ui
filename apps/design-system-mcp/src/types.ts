/**
 * Shared TypeScript types for the Design System MCP Server
 */

export interface ComponentProp {
	name: string;
	type: string;
	required: boolean;
	description?: string;
	defaultValue?: string;
}

export interface ComponentInfo {
	name: string;
	props: ComponentProp[];
	description?: string;
}

export interface ComponentIndex {
	[componentName: string]: {
		info: ComponentInfo;
		examples: CodeExample[];
		bestPractices: string[];
		accessibility: string[];
		importPath: string;
		category?: string;
		status?: string;
	};
}

export interface CodeExample {
	title: string;
	description?: string;
	code: string;
}

export interface MDXMetadata {
	title: string;
	description: string;
	category?: string;
	status?: string;
	keywords?: string[];
	lastUpdated?: string;
}

export interface GenerateComponentRequest {
	description: string;
	includeTypes?: boolean;
	includeImports?: boolean;
}

export interface GenerateComponentResponse {
	code: string;
	components: string[];
	imports: string[];
	explanation?: string;
}

export interface AuthContext {
	authenticated: boolean;
	apiKey?: string;
	timestamp: number;
}
