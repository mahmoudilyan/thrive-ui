/**
 * MDX Documentation Parser
 * Parses MDX files to extract component documentation, examples, and best practices
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { MDXMetadata, CodeExample } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ParsedMDX {
  metadata: MDXMetadata;
  content: string;
  examples: CodeExample[];
  bestPractices: string[];
  accessibility: string[];
}

/**
 * Extracts code examples from MDX content
 */
function extractCodeExamples(content: string): CodeExample[] {
  const examples: CodeExample[] = [];
  
  // Match <CodeExample> components
  const codeExampleRegex = /<CodeExample\s+title="([^"]+)"(?:\s+description="([^"]+)")?\s+code=\{`([^`]+)`\}/g;
  
  let match;
  while ((match = codeExampleRegex.exec(content)) !== null) {
    examples.push({
      title: match[1],
      description: match[2] || undefined,
      code: match[3].trim(),
    });
  }

  return examples;
}

/**
 * Extracts best practices from MDX content
 */
function extractBestPractices(content: string): string[] {
  const practices: string[] = [];
  
  // Look for Guideline components with type="do"
  const doGuidelineRegex = /<Guideline\s+type="do"\s+title="([^"]+)">([^<]+)<\/Guideline>/g;
  
  let match;
  while ((match = doGuidelineRegex.exec(content)) !== null) {
    practices.push(`${match[1]}: ${match[2].trim()}`);
  }

  return practices;
}

/**
 * Extracts accessibility guidelines from MDX content
 */
function extractAccessibility(content: string): string[] {
  const guidelines: string[] = [];
  
  // Look for accessibility section
  const accessibilityMatch = content.match(/## Accessibility\s+([\s\S]*?)(?=##|$)/);
  
  if (accessibilityMatch) {
    const accessibilityContent = accessibilityMatch[1];
    
    // Extract list items
    const listItems = accessibilityContent.match(/^[-*]\s+(.+)$/gm);
    if (listItems) {
      guidelines.push(...listItems.map(item => item.replace(/^[-*]\s+/, '').trim()));
    }
  }

  return guidelines;
}

/**
 * Parses a single MDX file
 */
export function parseMDXFile(filePath: string): ParsedMDX | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: mdxContent } = matter(content);

    const metadata: MDXMetadata = {
      title: data.title || '',
      description: data.description || '',
      category: data.category,
      status: data.status,
      keywords: data.keywords,
      lastUpdated: data.lastUpdated,
    };

    const examples = extractCodeExamples(mdxContent);
    const bestPractices = extractBestPractices(mdxContent);
    const accessibility = extractAccessibility(mdxContent);

    return {
      metadata,
      content: mdxContent,
      examples,
      bestPractices,
      accessibility,
    };
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error);
    return null;
  }
}

/**
 * Recursively finds all MDX files in a directory
 */
function findMDXFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findMDXFiles(fullPath));
      } else if (extname(entry) === '.mdx') {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * Loads and parses all MDX documentation files
 */
export function loadMDXDocumentation(): Map<string, ParsedMDX> {
  const docsMap = new Map<string, ParsedMDX>();

  try {
    // Default path to components documentation
    const defaultPath = resolve(
      __dirname,
      '../../../design-system-docs/content/components'
    );

    // Allow override via environment variable
    const docsPath = process.env.DOCS_PATH
      ? resolve(process.cwd(), process.env.DOCS_PATH, 'components')
      : defaultPath;

    console.log(`📖 Loading MDX documentation from: ${docsPath}`);

    const mdxFiles = findMDXFiles(docsPath);

    for (const filePath of mdxFiles) {
      const parsed = parseMDXFile(filePath);
      if (parsed && parsed.metadata.title) {
        // Use the title as the key (component name)
        docsMap.set(parsed.metadata.title, parsed);
      }
    }

    console.log(`✅ Loaded documentation for ${docsMap.size} components`);
  } catch (error) {
    console.error('❌ Error loading MDX documentation:', error);
    throw error;
  }

  return docsMap;
}

