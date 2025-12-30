import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	DropdownMenu,
	DropdownMenuLabel,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuShortcut,
	Button,
	IconButton,
	ButtonGroup,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuContent,
} from '@thrive/ui';
import {
	MdMoreVert,
	MdExpandMore,
	MdEdit,
	MdDelete,
	MdShare,
	MdDownload,
	MdSettings,
	MdVisibility,
	MdContentCopy,
	MdArchive,
	MdPlayArrow,
	MdPause,
	MdRefresh,
	MdPersonAdd,
	MdGroup,
	MdAnalytics,
	MdAttachFile,
	MdTask,
	MdFolder,
} from 'react-icons/md';

const meta = {
	title: 'Components/Dropdown Menu',
	component: DropdownMenu,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
# Dropdown Menu

Flexible dropdown menu components built on Radix UI primitives, showcasing real-world patterns from the Thrive Campaign application.

## Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Flexible positioning**: Smart placement with collision detection
- **Rich interactions**: Support for various item types (action, checkbox, radio)
- **Nested menus**: Sub-menus for complex navigation structures
- **Shortcuts**: Display keyboard shortcuts and commands
- **Icons**: Support for icons and visual indicators
- **State management**: Built-in selection and callback handling

## Usage

\`\`\`tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
} from '@thrive/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
\`\`\`

## Real-world Examples

These examples are based on actual dropdown menus used throughout the Thrive Campaign application, showing common patterns for actions, settings, and user interactions.
				`,
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<MdEdit className="mr-2" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem>
					<MdContentCopy className="mr-2" />
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<MdDelete className="mr-2" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

// Based on campaign actions from the real application
export const CampaignActions: Story = {
	render: () => {
		const [campaignStatus, setCampaignStatus] = React.useState<'draft' | 'sent'>('draft');

		const handleAction = (value: string) => {
			console.log('Action selected:', value);
			if (value === 'toggle-status') {
				setCampaignStatus(campaignStatus === 'draft' ? 'sent' : 'draft');
			}
		};

		return (
			<DropdownMenu>
				<ButtonGroup attached>
					{campaignStatus === 'sent' ? (
						<Button variant="secondary" size="sm">
							<MdAnalytics className="mr-2" />
							Analytics
						</Button>
					) : (
						<Button variant="secondary" size="sm">
							<MdEdit className="mr-2" />
							Edit
						</Button>
					)}
					<DropdownMenuTrigger asChild>
						<IconButton variant="secondary" size="sm" icon={<MdExpandMore />} />
					</DropdownMenuTrigger>
				</ButtonGroup>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<MdVisibility className="mr-2" />
						Preview
					</DropdownMenuItem>
					<DropdownMenuItem>
						<MdShare className="mr-2" />
						Public Preview
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<MdEdit className="mr-2" />
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem>
						<MdContentCopy className="mr-2" />
						Copy
					</DropdownMenuItem>
					<DropdownMenuItem>
						<MdGroup className="mr-2" />
						Copy to Account
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<MdAttachFile className="mr-2" />
						Attach to Campaign Group
					</DropdownMenuItem>
					<DropdownMenuItem>
						<MdTask className="mr-2" />
						Add to Task
					</DropdownMenuItem>
					<DropdownMenuItem>
						<MdTask className="mr-2" />
						Create Task
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive hover:text-destructive">
						<MdDelete className="mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

export const TableRowActions: Story = {
	render: () => {
		const handleAction = (value: string) => {
			alert(`Action: ${value}`);
		};

		return (
			<div className="w-full max-w-2xl">
				<div className="text-sm text-ink-muted mb-4">Example table row with dropdown actions:</div>
				<div className="border rounded-lg bg-panel">
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center space-x-4">
							<div className="h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
								<MdFolder className="w-5 h-5 text-primary-600" />
							</div>
							<div>
								<div className="font-medium text-ink-dark">Summer Campaign 2024</div>
								<div className="text-sm text-ink-light">Email • Created 2 days ago</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<IconButton variant="ghost" size="sm">
										<MdMoreVert />
									</IconButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>View Details</DropdownMenuItem>
									<DropdownMenuItem>Edit Campaign</DropdownMenuItem>
									<DropdownMenuItem>Duplicate</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>View Analytics</DropdownMenuItem>
									<DropdownMenuItem>Export Data</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Archive</DropdownMenuItem>
									<DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</div>
		);
	},
};

export const ViewOptionsMenu: Story = {
	render: () => {
		const [viewOptions, setViewOptions] = React.useState({
			showGrid: true,
			showPreview: false,
			showDetails: true,
			compactMode: false,
		});

		const handleOptionChange = (option: string, checked: boolean) => {
			setViewOptions(prev => ({
				...prev,
				[option]: checked,
			}));
		};

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary">
						<MdSettings className="mr-2" />
						View Options
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Display Options</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked={viewOptions.showGrid}
						onCheckedChange={checked => handleOptionChange('showGrid', checked)}
					>
						Show Grid View
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={viewOptions.showPreview}
						onCheckedChange={checked => handleOptionChange('showPreview', checked)}
					>
						Show Preview Panel
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={viewOptions.showDetails}
						onCheckedChange={checked => handleOptionChange('showDetails', checked)}
					>
						Show Details
					</DropdownMenuCheckboxItem>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked={viewOptions.compactMode}
						onCheckedChange={checked => handleOptionChange('compactMode', checked)}
					>
						Compact Mode
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

export const SortingMenu: Story = {
	render: () => {
		const [sortBy, setSortBy] = React.useState('date');
		const [sortOrder, setSortOrder] = React.useState('desc');

		return (
			<div className="flex gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="sm">
							Sort: {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Status'}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Sort by</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
							<DropdownMenuRadioItem value="date">Date Created</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="performance">Performance</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="sm">
							{sortOrder === 'asc' ? 'Ascending' : 'Descending'}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
							<DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};

export const UserProfileMenu: Story = {
	render: () => {
		const handleAction = (value: string) => {
			if (value === 'logout') {
				alert('Logging out...');
			} else {
				console.log('Profile action:', value);
			}
		};

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-10 w-10 rounded-full">
						<div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
							JD
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">John Doe</p>
							<p className="text-xs leading-none text-ink-muted">john@company.com</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						Profile Settings
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Billing & Usage
						<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>Team Management</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<MdPersonAdd className="mr-2" />
							Invite Users
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Send Email Invitation</DropdownMenuItem>
							<DropdownMenuItem>Generate Invite Link</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Bulk Import</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuItem>
						Support & Help
						<DropdownMenuShortcut>⌘?</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						Log Out
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

export const BulkActionsMenu: Story = {
	render: () => {
		const [selectedCount] = React.useState(5);

		const handleBulkAction = (value: string) => {
			alert(`Bulk action "${value}" on ${selectedCount} items`);
		};

		return (
			<div className="space-y-4">
				<div className="text-sm text-ink-muted">{selectedCount} items selected</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary">
							Bulk Actions
							<MdExpandMore className="ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Actions for {selectedCount} items</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<MdDownload className="mr-2" />
							Export Selected
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MdContentCopy className="mr-2" />
							Duplicate All
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<MdFolder className="mr-2" />
							Move to Folder
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MdAttachFile className="mr-2" />
							Add Tags
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<MdArchive className="mr-2" />
							Archive All
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive">
							<MdDelete className="mr-2" />
							Delete All
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};
