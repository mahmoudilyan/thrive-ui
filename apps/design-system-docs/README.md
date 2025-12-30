# Thrive Design System Documentation

Complete documentation and interactive component library for the Thrive Design System.

## 🎯 What's Included

This is a unified repository containing:

1. **Documentation Website** (Next.js 15) - Modern documentation with MDX
2. **Storybook** - Interactive component explorer and development environment

Both run from the same directory with shared dependencies.

## 🚀 Quick Start

### Install Dependencies

```bash
# From the design-system-docs directory
cd /Users/mahmoudilyan/Sites/thrive-campaign/apps/design-system-docs
pnpm install
```

### Run Everything

Start both the documentation site and Storybook simultaneously:

```bash
pnpm dev
```

This starts:

- **📖 Documentation Site**: http://localhost:3002
- **📚 Storybook**: http://localhost:6006

### Run Individually

**Documentation Site Only:**

```bash
pnpm dev:docs
```

Visit: http://localhost:3002

**Storybook Only:**

```bash
pnpm dev:storybook
# or
pnpm storybook
```

Visit: http://localhost:6006

## 📁 Structure

```
design-system-docs/
├── src/                        # Next.js documentation site
│   ├── app/                    # App Router pages (MDX)
│   │   ├── introduction/       # Getting started
│   │   ├── foundation/         # Design tokens, colors, etc.
│   │   ├── components/         # Component docs
│   │   └── patterns/           # UI patterns
│   ├── components/             # React components
│   │   ├── home/              # Home page components
│   │   ├── layout/            # Site layout
│   │   ├── mdx/               # MDX custom components
│   │   └── providers/         # Context providers
│   └── lib/                   # Utilities
├── stories/                    # Storybook stories
├── .storybook/                 # Storybook configuration
├── public/                     # Static assets
├── package.json                # Unified dependencies
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── README.md                   # This file
```

## 📝 Available Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `pnpm dev`             | Run both docs and Storybook  |
| `pnpm dev:docs`        | Run documentation site only  |
| `pnpm dev:storybook`   | Run Storybook only           |
| `pnpm storybook`       | Alias for dev:storybook      |
| `pnpm build`           | Build both for production    |
| `pnpm build:docs`      | Build documentation site     |
| `pnpm build:storybook` | Build Storybook              |
| `pnpm start`           | Start production docs server |
| `pnpm lint`            | Run ESLint                   |
| `pnpm clean`           | Clean all build artifacts    |

## 🎨 Documentation Site

The documentation site is built with:

- **Next.js 15** - App Router
- **React 19** - Latest React features
- **MDX** - Markdown with React components
- **Tailwind CSS** - Utility-first styling
- **Dark Mode** - Built-in theme switching

### Adding Documentation Pages

1. Create a new `.mdx` file in `src/app/`
2. Add metadata:

   ```mdx
   export const metadata = {
   	title: 'Page Title - Thrive Design System',
   	description: 'Page description',
   };

   ;
   ```

3. Write your content
4. Update navigation in `src/components/layout/site-nav.tsx`

### Custom MDX Components

Available in all MDX files:

```mdx
<Callout type="info">Information callout</Callout>

<ComponentPreview>
	<Button>Preview</Button>
</ComponentPreview>
```

## 📚 Storybook

Interactive component explorer built with Storybook 8.

### Adding Stories

Create a new story file in `stories/`:

```tsx
// stories/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '@thrive/ui';

const meta: Meta<typeof MyComponent> = {
	title: 'Components/MyComponent',
	component: MyComponent,
};

export default meta;

export const Default: StoryObj<typeof MyComponent> = {
	args: {
		// component props
	},
};
```

## 🔧 Development Workflow

### Typical Workflow

1. **Start development environment:**

   ```bash
   pnpm dev
   ```

2. **Develop components** in `../../packages/ui/src/components/`

3. **Document in Storybook** by creating stories in `stories/`

4. **Write documentation** in `src/app/` using MDX

5. **Preview changes:**
   - Component behavior: http://localhost:6006
   - Documentation: http://localhost:3002

### Hot Reloading

Both the documentation site and Storybook support hot module replacement:

- Changes to components automatically reflect in both
- MDX files update instantly
- Styles apply without page reload

## 🌐 Deployment

### Documentation Site

Deploy to Vercel:

```bash
vercel
```

Or build and deploy manually:

```bash
pnpm build:docs
# Deploy the .next directory
```

### Storybook

Deploy to Chromatic or any static host:

```bash
pnpm build:storybook
# Deploy the storybook-static directory
```

## 📦 Dependencies

The design system documentation depends on:

- `@thrive/ui` - The component library (workspace dependency)
- React 19
- Next.js 15
- Storybook 8

## 🧹 Maintenance

### Clean Build Artifacts

```bash
pnpm clean
```

### Reinstall Dependencies

```bash
pnpm clean
pnpm install
```

### Update Dependencies

```bash
pnpm update
```

## 📖 Learn More

- [Storybook Documentation](https://storybook.js.org/)
- [Thrive UI Package](../../packages/ui/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test locally with `pnpm dev`
4. Submit a pull request

## 📄 License

MIT License

---

**Happy documenting! 📝✨**
