# Design System Rules for Thrive Campaign

This document provides comprehensive guidelines for integrating Figma designs using the Model Context Protocol (MCP) with our existing design system.

## Design System Structure

### 1. Token Definitions

#### Color Tokens
**Location**: `@packages/ui/src/styles/globals.css`
- Uses OKLCH color space for consistent, perceptually uniform colors
- Comprehensive color palettes (50-950 shades) for Red, Gray, Orange, Yellow, Green, Teal, Blue, Indigo, Pink, Purple
- Primary brand colors with semantic naming
- Dark mode support with overrides in `.dark` class
- Semantic color tokens for backgrounds, text, borders, and icons

**Structure**:
```css
--color-primary-500: oklch(0.66 0.11 198);
--color-ink: oklch(0.37 0.03 259);
--color-bg: var(--color-gray-50);
```

#### Typography Tokens
**Location**: `@packages/ui/src/styles/globals.css` and `@packages/ui/src/components/text.tsx`
- Font families: Inter (headings/body), Manrope (display), system fallbacks
- Consistent typography scale: heading-xs through heading-3xl, body-xs through body-lg, caps variants
- Line heights and letter spacing defined for each size
- CSS custom properties for all typography tokens

**Structure**:
```css
--text-heading-lg: 1.25rem;
--leading-heading-lg: 1.75rem;
--tracking-heading-lg: -0.01em;
```

#### Spacing & Layout Tokens
- Custom spacing scale from 1px to 256px
- Border radius scale from 2px to full rounded
- Container sizes for consistent layouts
- Breakpoint definitions for responsive design

### 2. Component Library

#### Architecture
**Location**: `@packages/ui/src/components/`
- Radix UI primitives as foundation for accessibility and behavior
- Class Variance Authority (CVA) for type-safe variant systems
- Tailwind CSS for styling with custom design tokens
- Forward refs and proper TypeScript definitions

#### Component Categories
1. **Primitives**: Button, Input, Text, Avatar, Icon
2. **Layout**: PageSection, Sidebar, CenterContainer, Panel
3. **Navigation**: Breadcrumb, NavigationAccordion, DataNav
4. **Data Display**: DataTable, Card, StatCard, Badge, Tag
5. **Feedback**: Dialog, Toast, Alert, Spinner, Progress
6. **Forms**: Field, Checkbox, Radio, Select, Switch
7. **Overlay**: Popover, Tooltip, HoverCard, Drawer

#### Component Patterns
```typescript
// Standard component structure
interface ComponentProps extends BaseProps, VariantProps<typeof variants> {
  // Component-specific props
}

const Component = forwardRef<ElementRef, ComponentProps>(({ 
  variant, 
  size, 
  className, 
  ...props 
}, ref) => {
  return (
    <Primitive.Root
      ref={ref}
      className={cn(variants({ variant, size }), className)}
      {...props}
    />
  );
});
```

### 3. Frameworks & Libraries

#### Core Stack
- **React 19** with Server Components
- **Next.js 15** with App Router
- **TypeScript** with relaxed configuration for rapid development
- **Tailwind CSS** with custom theme integration
- **Class Variance Authority** for component variants
- **Radix UI** for accessible primitives

#### Build System
- **Turbo** for monorepo management
- **tsup** for component library bundling
- **Storybook** for component documentation
- **PostCSS** for CSS processing

### 4. Asset Management

#### Icons
**Location**: `@packages/ui/src/components/icons/` and `react-icons/md`
- Material Design icons as primary icon system
- Custom brand icons in SVG format
- Icon component wrapper for consistent sizing and styling
- TypeScript definitions for SVG imports

#### Media Assets
- S3 integration for asset storage and management
- Image optimization and thumbnail generation
- Asset picker component for media selection
- Support for multiple asset sources (uploads, stock photos, etc.)

### 5. Icon System

#### Implementation
```typescript
import { MdIconName } from 'react-icons/md';
import { Icon } from '@thrive/ui';

// Usage patterns
<Icon icon={<MdIconName />} size="md" />
<IconButton icon={<MdIconName />} variant="ghost" />
```

#### Guidelines
- Use Material Design icons for consistency
- Size variants: xs (12px), sm (16px), md (20px), lg (24px), xl (32px)
- Color should inherit from parent or use semantic color tokens
- Custom icons follow same sizing conventions

### 6. Styling Approach

#### Methodology
- **Tailwind CSS** with component-first approach
- Custom design tokens mapped to Tailwind utilities
- Class Variance Authority for variant management
- CSS custom properties for dynamic theming

#### Global Styles
**Location**: `@packages/ui/src/styles/globals.css`
```css
@import 'tailwindcss';
@theme static {
  /* Design tokens defined here */
}
```

#### Component Styling
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center", 
  {
    variants: {
      variant: {
        primary: "bg-primary-solid text-primary-contrast",
        secondary: "bg-secondary text-ink"
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4"
      }
    }
  }
);
```

### 7. Project Structure

```
packages/ui/
├── src/
│   ├── components/          # All UI components
│   │   ├── [component].tsx  # Individual components
│   │   ├── data-table/      # Complex component modules
│   │   ├── icons/           # Custom icons
│   │   ├── layout/          # Layout components
│   │   └── sidebar/         # Sidebar system
│   ├── styles/
│   │   ├── globals.css      # Design tokens and global styles
│   │   └── tokens.css       # Additional token definitions
│   ├── lib/                 # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript definitions
└── package.json

apps/design-system-docs/
├── stories/                 # Storybook stories
│   ├── *.stories.tsx       # Component stories
│   ├── *.mdx               # Documentation pages
│   └── assets/             # Story assets
└── package.json
```

## Implementation Guidelines

### Component Creation
1. Start with Radix UI primitive when available
2. Define TypeScript interface with proper generics
3. Use CVA for variant definitions
4. Implement forward refs for DOM access
5. Add proper display names and documentation
6. Create comprehensive Storybook stories

### Design Token Usage
1. Always use CSS custom properties from globals.css
2. Prefer semantic tokens over primitive colors
3. Ensure dark mode compatibility
4. Test color contrast ratios
5. Use consistent spacing scale

### Responsive Design
1. Mobile-first approach with Tailwind breakpoints
2. Use container queries where appropriate
3. Implement proper touch targets (min 44px)
4. Test across device sizes and orientations

### Accessibility
1. Leverage Radix UI's built-in accessibility features
2. Provide proper ARIA labels and descriptions
3. Ensure keyboard navigation works correctly
4. Test with screen readers
5. Maintain proper focus management

### Performance
1. Use React.memo for expensive components
2. Implement proper tree shaking
3. Lazy load heavy components
4. Optimize asset loading and caching
5. Monitor bundle size impact

## Figma Integration Guidelines

### Design Handoff
1. Verify color tokens match Figma color styles
2. Confirm typography scales align with design system
3. Check spacing and sizing consistency
4. Validate component state variations
5. Ensure icon usage matches design

### Component Mapping
1. Map Figma components to existing UI components
2. Create new components for unique designs
3. Maintain consistent naming conventions
4. Document component usage patterns
5. Update Storybook stories to match designs

### Quality Assurance
1. Cross-reference designs with implemented components
2. Validate responsive behavior matches designs
3. Test interactive states and animations
4. Ensure accessibility standards are met
5. Review with design team for approval