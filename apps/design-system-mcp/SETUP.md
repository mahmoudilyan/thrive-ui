# Setup Guide for Design System MCP Server

## Quick Start

### 1. Install Dependencies

```bash
cd apps/design-system-mcp
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

```env
TEAM_API_KEY=your-shared-team-api-key-here
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
PORT=3001
NODE_ENV=development
```

### 3. Start the Server

For development with hot reload:

```bash
pnpm dev
```

For production:

```bash
pnpm build
pnpm start
```

### 4. Configure Cursor

#### Option A: For Local Development

Add to `~/.cursor/mcp.json`:

```json
{
	"mcpServers": {
		"design-system": {
			"url": "http://localhost:3001/mcp",
			"headers": {
				"Authorization": "Bearer your-team-api-key"
			}
		}
	}
}
```

#### Option B: For Production (After Deployment)

```json
{
	"mcpServers": {
		"design-system": {
			"url": "https://your-domain.vercel.app/mcp",
			"headers": {
				"Authorization": "Bearer your-team-api-key"
			}
		}
	}
}
```

### 5. Test the Connection

Open Cursor and try these commands in the chat:

1. "What design system components are available?"
2. "Show me details about the Avatar component"
3. "Generate a user profile card with avatar, name, and email"

## Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`

2. Set environment variables in Vercel:

   ```bash
   vercel env add TEAM_API_KEY
   vercel env add ANTHROPIC_API_KEY
   ```

3. Deploy:

   ```bash
   vercel --prod
   ```

4. Update your `~/.cursor/mcp.json` with the production URL

## Troubleshooting

### Server won't start

- Check that all dependencies are installed: `pnpm install`
- Verify `.env` file exists and has valid API keys
- Check that port 3001 is not in use: `lsof -i :3001`

### Authentication errors

- Verify TEAM_API_KEY matches in both `.env` and `mcp.json`
- Make sure Authorization header includes "Bearer " prefix
- In development mode, auth is skipped if TEAM_API_KEY is not set

### Component generation fails

- Verify ANTHROPIC_API_KEY is valid
- Check you have API credits available
- Look at server logs for detailed error messages

### Components not found

- Make sure the design-system-docs app is in the correct location
- Verify paths in `.env` are correct relative to monorepo root
- Check that `component-props.json` exists and is readable

## API Keys

### Getting an Anthropic API Key

1. Go to https://console.anthropic.com
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy it to your `.env` file

### Team API Key

This is a shared secret that your team uses to authenticate with the MCP server. Generate a secure random string:

```bash
openssl rand -base64 32
```

Share this key securely with your team (use a password manager or secure vault).

## Development

### File Structure

```
src/
├── server.ts              # HTTP server entry point
├── middleware/
│   └── auth.ts            # Authentication
├── mcp/
│   ├── index.ts           # MCP protocol handler
│   └── context.ts         # Request context
├── indexer/
│   ├── index.ts           # Main indexer
│   ├── mdx-parser.ts      # Parse MDX docs
│   └── props-loader.ts    # Load component props
├── tools/
│   ├── index.ts           # Tool registry
│   ├── list-components.ts
│   ├── get-component-info.ts
│   ├── generate-component.ts
│   └── generate-page.ts
├── generators/
│   ├── ai-client.ts       # Claude API wrapper
│   └── code-generator.ts  # Component generation
└── types.ts               # TypeScript types
```

### Adding New Tools

1. Create a new file in `src/tools/`
2. Define the Zod schema for inputs
3. Implement the tool handler
4. Register in `src/tools/index.ts`

### Debugging

Enable verbose logging:

```bash
NODE_ENV=development pnpm dev
```

Check server logs for:

- Component index building
- MCP connections
- Tool calls and responses
- Errors and warnings
