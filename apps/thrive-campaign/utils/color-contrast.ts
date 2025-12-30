// Common status colors in your application
export const STATUS_COLORS = {
  success: '#38A169', // green.500
  error: '#E53E3E',   // red.500
  warning: '#D69E2E', // yellow.500
  info: '#3182CE',    // blue.500
  default: '#718096', // gray.500
  active: '#38A169',  // green.500
  inactive: '#718096', // gray.500
  pending: '#D69E2E',  // yellow.500
} as const;

// Type for status colors
export type StatusColor = keyof typeof STATUS_COLORS;

// Cache for color contrast calculations
const colorContrastCache = new Map<string, string>();

// Pre-calculate contrast for common colors
Object.values(STATUS_COLORS).forEach(color => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? 'blackAlpha.900' : 'whiteAlpha.900';
  
  colorContrastCache.set(color, textColor);
});

/**
 * Get contrasting text color (black or white) for a given background color
 * Uses cached values for common colors, calculates for new ones
 * @param backgroundColor - Hex color code (with or without #)
 * @returns Chakra UI color token for text
 */
export function getContrastTextColor(backgroundColor: string): string {
  const color = backgroundColor.startsWith('#') ? backgroundColor : `#${backgroundColor}`;
  
  // Check cache first
  if (colorContrastCache.has(color)) {
    return colorContrastCache.get(color)!;
  }

  // Calculate for new colors
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? 'blackAlpha.900' : 'whiteAlpha.900';
  
  // Cache the result
  colorContrastCache.set(color, textColor);
  return textColor;
}
