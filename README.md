# Thrive Campaign Monorepo

VBOUT 3.0 DASHBOARD USING REACT
Welcome to the Thrive Campaign monorepo! This repository contains the client-side application code for the VBOUT platform, built with modern web technologies for optimal performance and developer experience.

## Package Manager

This project uses **pnpm** for package management. Make sure you have pnpm installed:

```bash
npm install -g pnpm
```

## Monorepo Structure

```
├── apps/
│   ├── thrive-campaigns/          # Main campaign application
│   └── design-system-docs/        # Storybook documentation
├── packages/
│   └── ui/                        # Shared UI component library
├── .eslintrc.json                 # Root ESLint configuration
├── .editorconfig                  # Root editor configuration
├── tsconfig.json                  # Root TypeScript configuration
├── pnpm-workspace.yaml           # pnpm workspace configuration
└── turbo.json                     # Turborepo configuration
```

## Environment Variables

Environment variables are managed centrally in the root directory. Create your environment files in the root:

- `.env` - Default environment variables
- `.env.local` - Local overrides (gitignored)
- `.env.development` - Development-specific variables (gitignored)
- `.env.production` - Production-specific variables (gitignored)

The Next.js application is configured to automatically load these from the root directory.

## Tech Stack

### Core Technologies

- **Next.js 15 (App Router)** - [Documentation](https://nextjs.org/docs)
  - Server Components
  - App Router
  - Optimized for performance
- **React 19** - [Documentation](https://react.dev/)
  - Latest features and improvements
  - Enhanced performance
- **TypeScript** - [Documentation](https://www.typescriptlang.org/)
  - Strong type safety
  - Better developer experience

### UI and Styling

- **Chakra UI V3** - [Documentation](https://chakra-ui.com/)
  - Modern component library
  - Accessible components
  - Customizable theming

### State Management and Data Fetching

- **Zustand** - [Documentation](https://zustand-demo.pmnd.rs/)
  - Lightweight state management
  - Simple and flexible API
- **TanStack Query (React Query)** - [Documentation](https://tanstack.com/query/latest)
  - Powerful data-fetching library
  - Cache management
  - Server state synchronization

## Project Structure

```
├── app/                    # Next.js application routes
│   └── (dashboard)/       # Dashboard-related pages
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   ├── campaigns/        # Campaign-related components
│   ├── contacts/         # Contact-related components
│   ├── [module_name]/    # Module-specific components
│   └── ui/              # Shared UI components
│       ├── icon/        # Custom icons
│       ├── layout/      # Layout components
│       ├── theme.ts     # Theme customization
│       └── types/       # UI-related types
├── providers/            # Application providers
├── services/            # API services
├── store/               # State management
├── types/               # TypeScript types
├── lib/                 # Utility functions
└── constants/           # Constants and dummy data
```

## Code Formatting and Linting

To maintain consistent code quality across different IDEs and editors, we use ESLint and Prettier with strict configuration. These tools should be integrated with your IDE for the best development experience.

### Configuration Files

The project includes the following configuration files:

- `.eslintrc.json` - ESLint rules configuration
- `.prettierrc` - Prettier formatting rules

### IDE Integration

#### VS Code

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	}
}
```

#### WebStorm / IntelliJ IDEA

- Enable ESLint under Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
- Enable Prettier under Languages & Frameworks → JavaScript → Prettier
- Check "Run on save" for both tools

#### Other IDEs

For other IDEs, ensure:

1. ESLint integration is enabled
2. Prettier is set as the default formatter
3. Format on save is enabled
4. ESLint fix on save is enabled

> **Important**: These settings are crucial for maintaining code consistency/ Please make sure they are properly configured in your IDE.

## Icons Usage

We use Material Icons throughout the application for consistency:

- **Primary Choice**: Use regular Material Icons (not outlined) from `react-icons/md`
  ```typescript
  import { MdSearch, MdHome } from 'react-icons/md';
  ```
- **Custom Icons**: Located in `src/components/ui/icons/`
  - Use for VBOUT-specific or custom-designed icons
  - Follow the established naming convention: `[icon-name]-icon.tsx`

## Key Features

- Modern React development with Server Components
- Type-safe development with TypeScript
- Efficient state management with Zustand
- Robust data fetching with TanStack Query
- Accessible, utilized, and Customizable UI with Chakra UI
- Modular and maintainable code structure
- Custom UI components and theming

## Project Rules and Best Practices

### Directory Structure

- All source code must be in the `src` directory
- Each module should have its own directory under `src/components/`
- Shared UI components go in `src/components/ui/`
- Module-specific components stay in their module directory

### Component Creation Rules

1. **Directory Structure**

   - Create a new directory for each component
   - Use kebab-case for directory names
   - Example: `email-campaigns/campaign-list/`

2. **File Naming**

   - Use kebab-case for all files
   - Main component file matches directory name
   - Example:
     ```
     campaign-list/
     ├── campaign-list.tsx
     ├── campaign-list.types.ts  // Optional if needed, If there will be a lot of props for the component
     └── index.ts
     ```

3. **Component Organization**

   - One main component per directory
   - Export component through index.ts
   - Keep related utilities and types in the same directory

4. **Code Style**
   - Use TypeScript for all components
   - Export components as named exports
   - Define prop interfaces in `.types.ts` // Optional if needed

### Module Structure

1. **Module Directory**

   ```
   email-campaigns/
   ├── components/           # Module-specific components
   ├── hooks/               # Custom hooks only for this module
   ├── utils/               # Helper functions only for this module
   ├── types/               # Type definitions only for this module
   └── index.ts            # Export the module
   ```

2. **Feature Organization**
   - Group related features in a module
   - Share common utilities at module level
   - Keep module-specific types together

### Coding Standards

1. **Components**

   - Use functional components
   - Implement proper TypeScript types
   - Keep components focused and single-responsibility
   - Extract complex logic to hooks

2. **State Management**

   - Use Zustand for global state
   - Keep state minimal and normalized
   - Use local state for UI-only state

3. **API Integration**

   - Use TanStack Query for data fetching
   - Keep API calls in services directory
   - Handle loading and error states

4. **UI Components**
   - Use Chakra UI components when possible
   - Maintain consistent spacing and layout
   - Follow accessibility guidelines
   - Use Material Icons (non-outlined) as primary icons

### File Locations

1. **Components**: `src/components/[module-name]/`
2. **Types**: `src/types/[module-name]/types.ts`
3. **Services**: `src/services/[module-name]/queries.ts`
4. **Store**: `src/store/[module-name]/store.ts`
5. **Icons**: `src/components/ui/icons/[icon-name]-icon.tsx`

### Import Rules

1. Use absolute imports with `@/` prefix
2. Group imports in the following order:

   ```typescript
   // External dependencies
   import { useState } from 'react';
   import { Box } from '@chakra-ui/react';

   // Internal modules
   import { useCampaignStore } from '@/store/campaigns';
   import { getCampaignList } from '@/services/campaigns';

   // Local imports
   import { CampaignItem } from './campaign-item';
   import type { CampaignListProps } from './types';
   ```

### Performance Guidelines

1. Use React.memo for expensive renders
2. Implement proper query caching
3. Lazy load routes and large components
4. Optimize images and assets
5. Monitor bundle size

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use `nvm` or `fnm` for version management)
- pnpm package manager
- Git

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   # Copy and customize environment variables
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   pnpm run dev
   ```
5. Open [http://localhost:3011](http://localhost:3011) in your browser

### Available Scripts

- `pnpm run dev` - Start development server for all apps
- `pnpm run build` - Build all apps for production
- `pnpm run lint` - Run ESLint across all packages
- `pnpm run format` - Format code with Prettier
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run clean` - Clean build artifacts

## Development Guidelines

- Follow TypeScript best practices
- Use Server Components when possible
- Implement proper error boundaries
- Ensure accessibility compliance
- Write maintainable and self-documenting code
- Follow the established project structure
- Use appropriate naming conventions

## AI Development Support

This project is configured with AI-powered development tools to enhance team productivity. The `.windsurfrules` and `.cursorrules` configurations provide:

- Expert guidance for our tech stack
- Framework-specific best practices
- Code structure recommendations
- Implementation strategies
- Testing and validation approaches

Team members are encouraged to use these AI tools to maintain consistency and accelerate development while adhering to our established patterns and practices.
