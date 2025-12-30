/**
 * Code Generator
 * Generates React/TypeScript components using AI and design system knowledge
 */

import { getComponentIndex } from '../indexer/index.js';
import { generateWithClaude } from './ai-client.js';
import { GenerateComponentRequest, GenerateComponentResponse } from '../types.js';

/**
 * Creates a comprehensive system prompt with design system context
 */
function createSystemPrompt(): string {
  const index = getComponentIndex();
  
  // Get a summary of available components
  const componentSummary = Object.entries(index)
    .map(([name, data]) => {
      const props = data.info.props.slice(0, 5).map(p => 
        `${p.name}${p.required ? '' : '?'}: ${p.type}`
      ).join(', ');
      
      return `- ${name}: ${data.info.description || 'No description'} (${data.info.props.length} props)`;
    })
    .join('\n');

  return `You are an expert React/TypeScript developer specializing in the Thrive Design System.

## Your Role
Generate production-ready, type-safe React components using ONLY the available design system components.

## Available Components
${componentSummary}

## Design System Rules
1. ALWAYS use components from '@repo/ui' - never create custom HTML elements
2. Use Material Icons from 'react-icons/md' for all icons
3. Follow TypeScript best practices with proper typing
4. Use functional components with hooks
5. Follow React 19 and Next.js 15 patterns
6. Ensure components are accessible (ARIA attributes, semantic HTML)
7. Use the exact prop signatures from the design system
8. Import only what you need

## Code Style
- Use arrow functions for components
- Prefer const over let
- Use descriptive variable names
- Add JSDoc comments for complex logic
- Follow consistent spacing and formatting

## Response Format
Generate complete, working code that can be directly used. Include:
1. All necessary imports
2. Proper TypeScript types/interfaces
3. The component implementation
4. Export statement

Do NOT include:
- Markdown code fences
- Explanatory text before/after code
- Mock data (unless requested)
- Comments explaining basic React concepts`;
}

/**
 * Creates a detailed prompt with component examples
 */
function createUserPrompt(
  request: GenerateComponentRequest,
  relevantComponents: string[]
): string {
  const index = getComponentIndex();
  
  let prompt = `Generate a React component based on this description:\n"${request.description}"\n\n`;

  // Add relevant component details
  if (relevantComponents.length > 0) {
    prompt += '## Relevant Components to Use:\n\n';
    
    for (const componentName of relevantComponents.slice(0, 3)) {
      const data = index[componentName];
      if (data) {
        prompt += `### ${componentName}\n`;
        prompt += `Import: import { ${componentName} } from '@repo/ui';\n\n`;
        
        // Add props
        if (data.info.props.length > 0) {
          prompt += 'Props:\n';
          for (const prop of data.info.props.slice(0, 10)) {
            const optional = prop.required ? '' : '?';
            const defaultVal = prop.defaultValue ? ` (default: ${prop.defaultValue})` : '';
            prompt += `- ${prop.name}${optional}: ${prop.type}${defaultVal}\n`;
            if (prop.description) {
              prompt += `  ${prop.description}\n`;
            }
          }
          prompt += '\n';
        }

        // Add an example if available
        if (data.examples.length > 0) {
          prompt += `Example:\n\`\`\`tsx\n${data.examples[0].code}\n\`\`\`\n\n`;
        }
      }
    }
  }

  prompt += '\nGenerate the complete component code now:';
  
  return prompt;
}

/**
 * Finds relevant components based on the description
 */
function findRelevantComponents(description: string): string[] {
  const index = getComponentIndex();
  const lowerDesc = description.toLowerCase();
  const matches: { name: string; score: number }[] = [];

  // Keywords that map to components
  const keywordMap: Record<string, string[]> = {
    button: ['Button', 'IconButton'],
    input: ['Input', 'NumberInput', 'RichTextInput', 'Textarea'],
    form: ['Field', 'Input', 'Button', 'Select'],
    table: ['DataTable'],
    card: ['Card'],
    avatar: ['Avatar'],
    badge: ['Badge'],
    dialog: ['Dialog'],
    modal: ['Dialog'],
    dropdown: ['DropdownMenu', 'Select'],
    select: ['Select', 'SelectCheckboxSearchable', 'SelectMultiCategory'],
    list: ['DataTable'],
    navigation: ['PrimarySidebar', 'Tabs'],
    tabs: ['Tabs'],
    date: ['DatePicker', 'Calendar'],
    calendar: ['Calendar', 'DatePicker'],
    rating: ['Rating'],
    slider: ['Slider'],
    switch: ['Switch'],
    checkbox: ['Checkbox'],
    radio: ['Radio', 'RadioGroup'],
    tooltip: ['Tooltip'],
    progress: ['ProgressRoot', 'Spinner'],
    loading: ['Spinner', 'Skeleton'],
    empty: ['EmptyState'],
    icon: ['Icon', 'UiIcon'],
  };

  // Score based on keywords
  for (const [keyword, componentNames] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      for (const name of componentNames) {
        const existing = matches.find(m => m.name === name);
        if (existing) {
          existing.score += 2;
        } else {
          matches.push({ name, score: 2 });
        }
      }
    }
  }

  // Score based on component description match
  for (const [name, data] of Object.entries(index)) {
    const componentText = [
      name,
      data.info.description || '',
      data.category || '',
    ].join(' ').toLowerCase();

    // Check for word matches
    const descWords = lowerDesc.split(/\s+/);
    for (const word of descWords) {
      if (word.length > 3 && componentText.includes(word)) {
        const existing = matches.find(m => m.name === name);
        if (existing) {
          existing.score += 1;
        } else {
          matches.push({ name, score: 1 });
        }
      }
    }
  }

  // Sort by score and return top matches
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 5).map(m => m.name);
}

/**
 * Extracts imports from generated code
 */
function extractImports(code: string): string[] {
  const imports: string[] = [];
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const components = match[1].split(',').map(c => c.trim());
    imports.push(...components);
  }
  
  return imports;
}

/**
 * Extracts used components from generated code
 */
function extractUsedComponents(code: string): string[] {
  const index = getComponentIndex();
  const used: string[] = [];
  
  for (const componentName of Object.keys(index)) {
    // Look for JSX usage: <ComponentName or </ComponentName
    const regex = new RegExp(`</?${componentName}[\\s>]`, 'g');
    if (regex.test(code)) {
      used.push(componentName);
    }
  }
  
  return [...new Set(used)];
}

/**
 * Generates a component based on natural language description
 */
export async function generateComponent(
  request: GenerateComponentRequest
): Promise<GenerateComponentResponse> {
  // Find relevant components
  const relevantComponents = findRelevantComponents(request.description);

  // Create prompts
  const systemPrompt = createSystemPrompt();
  const userPrompt = createUserPrompt(request, relevantComponents);

  // Generate code with Claude
  const generatedCode = await generateWithClaude(userPrompt, systemPrompt, {
    maxTokens: 3000,
    temperature: 0.5,
  });

  // Clean up code (remove markdown code fences if present)
  let cleanCode = generatedCode.trim();
  if (cleanCode.startsWith('```')) {
    cleanCode = cleanCode.replace(/^```(?:tsx?|typescript|javascript)?\n?/, '');
    cleanCode = cleanCode.replace(/\n?```$/, '');
  }

  // Extract metadata
  const imports = extractImports(cleanCode);
  const components = extractUsedComponents(cleanCode);

  return {
    code: cleanCode.trim(),
    imports,
    components,
    explanation: `Generated component using: ${components.join(', ')}`,
  };
}

/**
 * Generates a complete page with multiple components
 */
export async function generatePage(description: string): Promise<GenerateComponentResponse> {
  const request: GenerateComponentRequest = {
    description: `${description}\n\nThis is a full page component, so include proper layout structure with PageSection or appropriate layout components. Make it complete and production-ready.`,
    includeTypes: true,
    includeImports: true,
  };

  return generateComponent(request);
}

