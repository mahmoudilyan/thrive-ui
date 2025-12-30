/**
 * Component Props Loader
 * Loads and indexes component prop definitions from component-props.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ComponentInfo, ComponentProp } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PropsJSON {
	[componentName: string]: {
		props: Array<{
			name: string;
			type: string;
			required: boolean;
			description?: string;
			defaultValue?: string;
		}>;
		description?: string;
	};
}

/**
 * Loads component props from the JSON file
 */
export function loadComponentProps(): Map<string, ComponentInfo> {
	const propsMap = new Map<string, ComponentInfo>();

	try {
		// Default path relative to monorepo structure
		const defaultPath = resolve(
			__dirname,
			'../../../design-system-docs/src/data/component-props.json'
		);

		// Allow override via environment variable
		const propsPath = process.env.PROPS_PATH
			? resolve(process.cwd(), process.env.PROPS_PATH)
			: defaultPath;

		const propsData = readFileSync(propsPath, 'utf-8');
		const propsJSON: PropsJSON = JSON.parse(propsData);

		// Convert to our ComponentInfo format
		for (const [componentName, data] of Object.entries(propsJSON)) {
			const props: ComponentProp[] = data.props.map(prop => ({
				name: prop.name,
				type: prop.type,
				required: prop.required,
				description: prop.description,
				defaultValue: prop.defaultValue,
			}));

			propsMap.set(componentName, {
				name: componentName,
				props,
				description: data.description,
			});
		}

		console.log(`✅ Loaded props for ${propsMap.size} components`);
	} catch (error) {
		console.error('❌ Error loading component props:', error);
		throw error;
	}

	return propsMap;
}

/**
 * Gets props for a specific component
 */
export function getComponentProps(
	propsMap: Map<string, ComponentInfo>,
	componentName: string
): ComponentInfo | undefined {
	return propsMap.get(componentName);
}
