/**
 * Get Component Info Tool
 * Retrieves detailed information about a specific component
 */

import { z } from 'zod';
import { getComponentIndex } from '../indexer/index.js';

export const getComponentInfoSchema = z.object({
	componentName: z.string().describe('Name of the component to get information about'),
});

export type GetComponentInfoInput = z.infer<typeof getComponentInfoSchema>;

export interface GetComponentInfoOutput {
	name: string;
	description: string;
	category?: string;
	status?: string;
	importPath: string;
	importExample: string;
	props: Array<{
		name: string;
		type: string;
		required: boolean;
		description?: string;
		defaultValue?: string;
	}>;
	examples: Array<{
		title: string;
		description?: string;
		code: string;
	}>;
	bestPractices: string[];
	accessibility: string[];
}

/**
 * Gets detailed information about a specific component
 */
export async function getComponentInfo(
	input: GetComponentInfoInput
): Promise<GetComponentInfoOutput> {
	const index = getComponentIndex();
	const componentData = index[input.componentName];

	if (!componentData) {
		// Try case-insensitive search
		const lowerName = input.componentName.toLowerCase();
		const match = Object.keys(index).find(key => key.toLowerCase() === lowerName);

		if (match) {
			return getComponentInfo({ componentName: match });
		}

		throw new Error(
			`Component "${input.componentName}" not found. Use list-components to see available components.`
		);
	}

	const { info, examples, bestPractices, accessibility, category, status, importPath } =
		componentData;

	// Generate import example
	const importExample = `import { ${input.componentName} } from '${importPath}';`;

	return {
		name: input.componentName,
		description: info.description || 'No description available',
		category,
		status,
		importPath,
		importExample,
		props: info.props,
		examples,
		bestPractices,
		accessibility,
	};
}
