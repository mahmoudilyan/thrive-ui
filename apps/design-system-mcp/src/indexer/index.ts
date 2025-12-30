/**
 * Main Indexer
 * Combines component props and MDX documentation into a searchable index
 */

import { ComponentIndex } from '../types.js';
import { loadComponentProps } from './props-loader.js';
import { loadMDXDocumentation } from './mdx-parser.js';

let cachedIndex: ComponentIndex | null = null;

/**
 * Builds the complete component index by combining props and documentation
 */
export function buildComponentIndex(): ComponentIndex {
  if (cachedIndex) {
    return cachedIndex;
  }

  console.log('🔨 Building component index...');

  const propsMap = loadComponentProps();
  const docsMap = loadMDXDocumentation();

  const index: ComponentIndex = {};

  // Combine props and documentation
  for (const [componentName, componentInfo] of propsMap.entries()) {
    const docs = docsMap.get(componentName);

    index[componentName] = {
      info: componentInfo,
      examples: docs?.examples || [],
      bestPractices: docs?.bestPractices || [],
      accessibility: docs?.accessibility || [],
      importPath: `@repo/ui`,
      category: docs?.metadata.category,
      status: docs?.metadata.status,
    };
  }

  // Add any components from docs that don't have props (edge case)
  for (const [componentName, docs] of docsMap.entries()) {
    if (!index[componentName]) {
      index[componentName] = {
        info: {
          name: componentName,
          props: [],
          description: docs.metadata.description,
        },
        examples: docs.examples,
        bestPractices: docs.bestPractices,
        accessibility: docs.accessibility,
        importPath: `@repo/ui`,
        category: docs.metadata.category,
        status: docs.metadata.status,
      };
    }
  }

  console.log(`✅ Index built with ${Object.keys(index).length} components`);
  
  cachedIndex = index;
  return index;
}

/**
 * Gets the cached component index or builds it if not cached
 */
export function getComponentIndex(): ComponentIndex {
  if (!cachedIndex) {
    return buildComponentIndex();
  }
  return cachedIndex;
}

/**
 * Refreshes the component index cache
 */
export function refreshIndex(): ComponentIndex {
  cachedIndex = null;
  return buildComponentIndex();
}

/**
 * Searches components by name, description, or keywords
 */
export function searchComponents(query: string): string[] {
  const index = getComponentIndex();
  const lowerQuery = query.toLowerCase();
  const matches: string[] = [];

  for (const [componentName, data] of Object.entries(index)) {
    const searchableText = [
      componentName,
      data.info.description || '',
      data.category || '',
    ].join(' ').toLowerCase();

    if (searchableText.includes(lowerQuery)) {
      matches.push(componentName);
    }
  }

  return matches;
}

