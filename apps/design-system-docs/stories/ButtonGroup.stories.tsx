import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup, Button, IconButton } from '@thrive/ui';
import {
	MdFormatBold,
	MdFormatItalic,
	MdFormatUnderlined,
	MdFormatAlignLeft,
	MdFormatAlignCenter,
	MdFormatAlignRight,
	MdViewList,
	MdViewModule,
	MdViewStream,
	MdZoomIn,
	MdZoomOut,
	MdFullscreen,
} from 'react-icons/md';

const meta = {
	title: 'Components/ButtonGroup',
	component: ButtonGroup,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
# Button Group

A container component for grouping related buttons together. Supports both attached and detached styles, with horizontal and vertical orientations.

## Features

- **Attached mode**: Buttons are visually connected with shared borders
- **Detached mode**: Buttons are separated with consistent spacing
- **Orientations**: Horizontal (default) or vertical layout
- **Size variants**: xs, sm, default, lg
- **Accessible**: Proper ARIA roles and keyboard navigation
- **Flexible**: Works with regular buttons and icon buttons

## Usage

\`\`\`tsx
import { ButtonGroup, Button } from '@thrive/ui';

// Basic attached group
<ButtonGroup>
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>

// Detached group
<ButtonGroup attached={false}>
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</ButtonGroup>
\`\`\`
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		attached: {
			control: 'boolean',
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
	},
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: {
		attached: true,
		orientation: 'horizontal',
		children: (
			<>
				<Button variant="secondary">Left</Button>
				<Button variant="secondary">Center</Button>
				<Button variant="secondary">Right</Button>
			</>
		),
	},
	render: args => (
		<ButtonGroup {...args}>
			<Button variant="secondary">Left</Button>
			<Button variant="secondary">Center</Button>
			<Button variant="secondary">Right</Button>
		</ButtonGroup>
	),
};

export const Attached: Story = {
	args: {
		attached: true,
		orientation: 'horizontal',
		children: (
			<>
				<Button variant="secondary">Left</Button>
				<Button variant="secondary">Center</Button>
				<Button variant="secondary">Right</Button>
			</>
		),
	},
	render: () => (
		<div className="space-y-6">
			<div>
				<h4 className="text-sm font-medium mb-3">Text Formatting</h4>
				<ButtonGroup attached>
					<IconButton variant="secondary" icon={<MdFormatBold />} aria-label="Bold" />
					<IconButton variant="secondary" icon={<MdFormatItalic />} aria-label="Italic" />
					<IconButton variant="secondary" icon={<MdFormatUnderlined />} aria-label="Underline" />
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Text Alignment</h4>
				<ButtonGroup attached>
					<IconButton variant="secondary" icon={<MdFormatAlignLeft />} aria-label="Align left" />
					<IconButton
						variant="secondary"
						icon={<MdFormatAlignCenter />}
						aria-label="Align center"
					/>
					<IconButton variant="secondary" icon={<MdFormatAlignRight />} aria-label="Align right" />
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">View Options</h4>
				<ButtonGroup attached>
					<IconButton variant="secondary" icon={<MdViewList />} aria-label="List view" />
					<IconButton variant="secondary" icon={<MdViewModule />} aria-label="Grid view" />
					<IconButton variant="secondary" icon={<MdViewStream />} aria-label="Stream view" />
				</ButtonGroup>
			</div>
		</div>
	),
};

export const Detached: Story = {
	args: {
		attached: false,
		orientation: 'horizontal',
		children: (
			<>
				<Button variant="primary">Save</Button>
				<Button variant="secondary">Cancel</Button>
			</>
		),
	},
	render: () => (
		<div className="space-y-6">
			<div>
				<h4 className="text-sm font-medium mb-3">Form Actions</h4>
				<ButtonGroup attached={false}>
					<Button variant="primary">Save</Button>
					<Button variant="secondary">Cancel</Button>
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Dialog Actions</h4>
				<ButtonGroup attached={false}>
					<Button variant="destructive">Delete</Button>
					<Button variant="secondary">Cancel</Button>
					<Button variant="primary">Confirm</Button>
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Navigation</h4>
				<ButtonGroup attached={false}>
					<Button variant="secondary">Previous</Button>
					<Button variant="secondary">Next</Button>
				</ButtonGroup>
			</div>
		</div>
	),
};

export const Vertical: Story = {
	args: {
		attached: true,
		orientation: 'vertical',
		children: (
			<>
				<Button variant="secondary">Top</Button>
				<Button variant="secondary">Middle</Button>
				<Button variant="secondary">Bottom</Button>
			</>
		),
	},
	render: () => (
		<div className="space-y-6">
			<div>
				<h4 className="text-sm font-medium mb-3">Vertical Attached</h4>
				<ButtonGroup orientation="vertical" attached>
					<Button variant="secondary">Top</Button>
					<Button variant="secondary">Middle</Button>
					<Button variant="secondary">Bottom</Button>
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Vertical Detached</h4>
				<ButtonGroup orientation="vertical" attached={false}>
					<Button variant="primary">Primary Action</Button>
					<Button variant="secondary">Secondary Action</Button>
					<Button variant="ghost">Tertiary Action</Button>
				</ButtonGroup>
			</div>
		</div>
	),
};

export const AllSizes: Story = {
	args: {
		attached: true,
		orientation: 'horizontal',
		children: (
			<>
				<Button variant="secondary">Left</Button>
				<Button variant="secondary">Center</Button>
				<Button variant="secondary">Right</Button>
			</>
		),
	},
	render: () => (
		<div className="space-y-6">
			<div>
				<h4 className="text-sm font-medium mb-3">Extra Small</h4>
				<ButtonGroup size="xs">
					<Button variant="secondary">XS</Button>
					<Button variant="secondary">Size</Button>
					<Button variant="secondary">Group</Button>
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Small</h4>
				<ButtonGroup size="sm">
					<Button variant="secondary">Small</Button>
					<Button variant="secondary">Size</Button>
					<Button variant="secondary">Group</Button>
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Default</h4>
				<ButtonGroup>
					<Button variant="secondary">Default</Button>
					<Button variant="secondary">Size</Button>
					<Button variant="secondary">Group</Button>
				</ButtonGroup>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Large</h4>
				<ButtonGroup size="lg">
					<Button variant="secondary">Large</Button>
					<Button variant="secondary">Size</Button>
					<Button variant="secondary">Group</Button>
				</ButtonGroup>
			</div>
		</div>
	),
};

export const WithToggleState: Story = {
	args: {
		attached: true,
		orientation: 'horizontal',
		children: (
			<>
				<Button variant="secondary">Left</Button>
				<Button variant="secondary">Center</Button>
				<Button variant="secondary">Right</Button>
			</>
		),
	},
	render: () => {
		const [activeAlign, setActiveAlign] = React.useState('left');
		const [activeView, setActiveView] = React.useState('list');
		const [formatting, setFormatting] = React.useState({
			bold: false,
			italic: false,
			underline: false,
		});

		return (
			<div className="space-y-6">
				<div>
					<h4 className="text-sm font-medium mb-3">Text Alignment (Single Select)</h4>
					<ButtonGroup attached>
						<IconButton
							variant={activeAlign === 'left' ? 'primary' : 'secondary'}
							icon={<MdFormatAlignLeft />}
							onClick={() => setActiveAlign('left')}
							aria-label="Align left"
						/>
						<IconButton
							variant={activeAlign === 'center' ? 'primary' : 'secondary'}
							icon={<MdFormatAlignCenter />}
							onClick={() => setActiveAlign('center')}
							aria-label="Align center"
						/>
						<IconButton
							variant={activeAlign === 'right' ? 'primary' : 'secondary'}
							icon={<MdFormatAlignRight />}
							onClick={() => setActiveAlign('right')}
							aria-label="Align right"
						/>
					</ButtonGroup>
				</div>

				<div>
					<h4 className="text-sm font-medium mb-3">Text Formatting (Multi Select)</h4>
					<ButtonGroup attached>
						<IconButton
							variant={formatting.bold ? 'primary' : 'secondary'}
							icon={<MdFormatBold />}
							onClick={() => setFormatting(prev => ({ ...prev, bold: !prev.bold }))}
							aria-label="Bold"
						/>
						<IconButton
							variant={formatting.italic ? 'primary' : 'secondary'}
							icon={<MdFormatItalic />}
							onClick={() => setFormatting(prev => ({ ...prev, italic: !prev.italic }))}
							aria-label="Italic"
						/>
						<IconButton
							variant={formatting.underline ? 'primary' : 'secondary'}
							icon={<MdFormatUnderlined />}
							onClick={() => setFormatting(prev => ({ ...prev, underline: !prev.underline }))}
							aria-label="Underline"
						/>
					</ButtonGroup>
				</div>

				<div>
					<h4 className="text-sm font-medium mb-3">View Type</h4>
					<ButtonGroup attached>
						<IconButton
							variant={activeView === 'list' ? 'primary' : 'secondary'}
							icon={<MdViewList />}
							onClick={() => setActiveView('list')}
							aria-label="List view"
						/>
						<IconButton
							variant={activeView === 'grid' ? 'primary' : 'secondary'}
							icon={<MdViewModule />}
							onClick={() => setActiveView('grid')}
							aria-label="Grid view"
						/>
						<IconButton
							variant={activeView === 'stream' ? 'primary' : 'secondary'}
							icon={<MdViewStream />}
							onClick={() => setActiveView('stream')}
							aria-label="Stream view"
						/>
					</ButtonGroup>
				</div>
			</div>
		);
	},
};
