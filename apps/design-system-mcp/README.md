# Design System MCP Server

AI-powered component generation server for the Thrive Design System.

## Overview

This MCP (Model Context Protocol) server provides intelligent component generation capabilities by indexing your design system documentation and enabling AI assistants to generate type-safe, production-ready React components.

## Features

- 🔍 **Component Discovery**: List and search all available design system components
- 📖 **Smart Documentation**: Access component props, examples, and best practices
- 🤖 **AI Generation**: Generate components using natural language descriptions
- 🔒 **Team Authentication**: Shared API key for team-wide access
- ☁️ **Cloud Deployable**: Ready for Vercel deployment

## Setup

### 1. Install Dependencies

```bash
cd apps/design-system-mcp
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Required environment variables:

- `TEAM_API_KEY`: Shared team API key for authentication
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude
- `PORT`: Server port (default: 3001)

### 3. Run Development Server

```bash
pnpm dev
```

## Usage with Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
	"mcpServers": {
		"design-system": {
			"url": "https://your-deployment-url.vercel.app",
			"headers": {
				"Authorization": "Bearer YOUR_TEAM_API_KEY"
			}
		}
	}
}
```

For local development:

```json
{
	"mcpServers": {
		"design-system": {
			"url": "http://localhost:3001"
		}
	}
}
```

## Available Tools

### `list-components`

Lists all available components with descriptions and categories.

```
Example: "What components are available?"
```

### `get-component-info`

Get detailed information about a specific component.

```
Example: "Show me details about the Avatar component"
Parameters: { componentName: "Avatar" }
```

### `generate-component`

Generate a new component using natural language.

```
Example: "Create a user profile card with avatar, name, email, and an edit button"
```

### `generate-page`

Generate a complete page with multiple components.

```
Example: "Create a contacts list page with search, filters, and data table"
```

## Deployment

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

```bash
vercel
```

## Development

```bash
# Run in development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm type-check
```

## Architecture

- **HTTP/SSE Server**: Express-based server with MCP protocol support
- **Authentication**: Simple API key middleware
- **Indexer**: Parses MDX docs and component props
- **AI Generator**: Claude-powered intelligent code generation
- **Tools**: MCP tools for component discovery and generation

## Security

- API key authentication on all requests
- Environment variables for sensitive data
- No API keys committed to repository
- Rate limiting (TODO)
- Usage logging (TODO)

## License

MIT
