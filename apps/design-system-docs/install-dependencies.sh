#!/bin/bash

# Install Dependencies for Thrive Design System Documentation
echo "🚀 Installing dependencies for Thrive Design System Documentation..."

# Change to the design-system-docs directory
cd "$(dirname "$0")"

# Install dependencies with pnpm
echo "📦 Installing packages..."
pnpm install

# Verify installation
echo "✅ Verifying installation..."
if command -v pnpm &> /dev/null; then
    echo "✓ pnpm is available"
else
    echo "❌ pnpm not found. Please install pnpm first: npm install -g pnpm"
    exit 1
fi

# Check if storybook command is available
if pnpm storybook --help &> /dev/null; then
    echo "✓ Storybook is properly installed"
else
    echo "❌ Storybook installation failed"
    exit 1
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Available commands:"
echo "  pnpm dev                    # Start Storybook development server"
echo "  pnpm build-storybook       # Build for production"
echo "  pnpm test-storybook        # Run accessibility tests"
echo ""
echo "🌟 Features included:"
echo "  ✅ MDX documentation support"
echo "  ✅ Dark mode theming"
echo "  ✅ Accessibility testing with @storybook/addon-a11y"
echo "  ✅ Figma integration support"
echo "  ✅ Custom Thrive branding"
echo "  ✅ Latest Storybook v8.4.7"
echo ""
echo "🚀 Start development server:"
echo "  pnpm dev"
echo ""
echo "📖 Documentation will be available at: http://localhost:6006"
