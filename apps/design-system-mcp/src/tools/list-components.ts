/**
 * List Components Tool
 * Returns all available design system components with descriptions and categories
 */

import { z } from 'zod';
import { getComponentIndex } from '../indexer/index.js';

export const listComponentsSchema = z.object({
  category: z.string().optional().describe('Filter by category (e.g., "Components", "Layout")'),
  status: z.string().optional().describe('Filter by status (e.g., "stable", "beta")'),
});

export type ListComponentsInput = z.infer<typeof listComponentsSchema>;

export interface ListComponentsOutput {
  components: Array<{
    name: string;
    description: string;
    category?: string;
    status?: string;
    propsCount: number;
    examplesCount: number;
  }>;
  total: number;
  categories: string[];
}

/**
 * Lists all available components with optional filtering
 */
export async function listComponents(
  input: ListComponentsInput
): Promise<ListComponentsOutput> {
  const index = getComponentIndex();
  const allCategories = new Set<string>();

  let components = Object.entries(index).map(([name, data]) => {
    if (data.category) {
      allCategories.add(data.category);
    }

    return {
      name,
      description: data.info.description || 'No description available',
      category: data.category,
      status: data.status,
      propsCount: data.info.props.length,
      examplesCount: data.examples.length,
    };
  });

  // Apply filters
  if (input.category) {
    components = components.filter(
      (c) => c.category?.toLowerCase() === input.category?.toLowerCase()
    );
  }

  if (input.status) {
    components = components.filter(
      (c) => c.status?.toLowerCase() === input.status?.toLowerCase()
    );
  }

  // Sort by name
  components.sort((a, b) => a.name.localeCompare(b.name));

  return {
    components,
    total: components.length,
    categories: Array.from(allCategories).sort(),
  };
}

