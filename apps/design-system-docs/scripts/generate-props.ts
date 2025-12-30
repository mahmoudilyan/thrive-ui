import * as fs from 'fs';
import * as path from 'path';
import { Project } from 'ts-morph';

interface PropInfo {
	name: string;
	type: string;
	required: boolean;
	description?: string;
	defaultValue?: string;
}

import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

interface ComponentProps {
	[componentName: string]: {
		props: PropInfo[];
		description?: string;
	};
}

/**
 * Generate props documentation from TypeScript component files
 */
export function generatePropsDocumentation() {
	const project = new Project({
		tsConfigFilePath: path.resolve(__dirname, '../../../packages/ui/tsconfig.json'),
	});

	const componentsDir = path.resolve(__dirname, '../../../packages/ui/src/components');
	const outputPath = path.resolve(__dirname, '../src/data/component-props.json');

	const componentProps: ComponentProps = {};

	// Get all component files
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter(file => file.endsWith('.tsx') && !file.includes('.stories'))
		.map(file => path.join(componentsDir, file));

	componentFiles.forEach(filePath => {
		const sourceFile = project.addSourceFileAtPath(filePath);
		const fileName = path.basename(filePath, '.tsx');

		// Find exported interfaces/types that end with "Props"
		sourceFile.getInterfaces().forEach(interfaceDecl => {
			const interfaceName = interfaceDecl.getName();

			if (interfaceName.endsWith('Props')) {
				const componentName = interfaceName.replace(/Props$/, '');
				const props: PropInfo[] = [];

				interfaceDecl.getProperties().forEach(prop => {
					const propName = prop.getName();
					const propType = prop.getType().getText();
					const isRequired = !prop.hasQuestionToken();
					const jsDoc = prop.getJsDocs()[0];
					const description = jsDoc?.getDescription().trim();

					// Try to get default value from JSDoc tags
					const defaultTag = jsDoc?.getTags().find(tag => tag.getTagName() === 'default');
					const defaultValue = defaultTag?.getComment()?.toString();

					props.push({
						name: propName,
						type: propType,
						required: isRequired,
						description,
						defaultValue,
					});
				});

				if (props.length > 0) {
					componentProps[componentName] = {
						props,
						description: interfaceDecl.getJsDocs()[0]?.getDescription().trim(),
					};
				}
			}
		});

		// Also check for type aliases
		sourceFile.getTypeAliases().forEach(typeAlias => {
			const typeName = typeAlias.getName();

			if (typeName.endsWith('Props')) {
				const componentName = typeName.replace(/Props$/, '');
				const type = typeAlias.getType();

				if (type.isObject()) {
					const props: PropInfo[] = [];

					type.getProperties().forEach(prop => {
						const propName = prop.getName();
						const propType = prop
							.getTypeAtLocation(typeAlias)
							.getText(undefined, { maxLength: 100 });
						const declarations = prop.getDeclarations();
						const isRequired = declarations.some(
							decl => !decl.getType().isNullable() && !decl.getType().isUndefined()
						);

						props.push({
							name: propName,
							type: propType,
							required: isRequired,
						});
					});

					if (props.length > 0) {
						componentProps[componentName] = {
							props,
							description: typeAlias.getJsDocs()[0]?.getDescription().trim(),
						};
					}
				}
			}
		});
	});

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write to JSON file
	fs.writeFileSync(outputPath, JSON.stringify(componentProps, null, 2));

	console.log(`✅ Generated props for ${Object.keys(componentProps).length} components`);
	console.log(`📝 Output: ${outputPath}`);

	return componentProps;
}

// Run if called directly
if (require.main === module) {
	generatePropsDocumentation();
}
