import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarPanel, SidebarItem, SidebarSubItem } from '@thrive/ui';
import type { SidebarPanelProps } from '@thrive/ui';
import {
	MdOutlineDashboard,
	MdDashboard,
	MdPeopleOutline,
	MdPeople,
	MdOutlineCampaign,
	MdCampaign,
	MdOutlineSettings,
	MdSettings,
	MdOutlineFolder,
	MdFolder,
} from 'react-icons/md';

const meta: Meta<typeof SidebarPanel> = {
	title: 'Layout/Sidebar/SidebarPanel',
	component: SidebarPanel,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		title: {
			control: 'text',
			description: 'Panel title displayed in the header',
		},
		isOpen: {
			control: 'boolean',
			description: 'Whether the panel is visible',
		},
		animationDuration: {
			control: { type: 'number', min: 0, max: 1000, step: 50 },
			description: 'Animation duration in milliseconds',
		},
	},
};

export default meta;
type Story = StoryObj<typeof SidebarPanel>;

// Full width wrapper with toggle button
const FullWidthWrapper = ({
	children,
	isOpen,
	onToggle,
}: {
	children: React.ReactNode;
	isOpen: boolean;
	onToggle: () => void;
}) => (
	<div className="h-screen w-full bg-gray-100 flex">
		{children}
		<div className="flex-1 flex items-center justify-center p-8">
			<button
				className="px-4 py-2 bg-primary-solid text-white rounded-md hover:bg-primary-solid/90 transition-colors"
				onClick={onToggle}
			>
				{isOpen ? 'Close Panel' : 'Open Panel'}
			</button>
		</div>
	</div>
);

export const Default: Story = {
	args: {
		title: 'Dashboard',
		isOpen: true,
		animationDuration: 300,
	},
	render: function Render(args) {
		const [isOpen, setIsOpen] = useState(args.isOpen ?? true);

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel {...args} isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
					<SidebarItem label="Overview" />
					<SidebarItem label="Analytics" />
					<SidebarItem label="Reports" />
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const WithIcons: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		const [activeItem, setActiveItem] = useState('dashboard');

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel title="Navigation" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
					<SidebarItem
						label="Dashboard"
						iconOutlined={MdOutlineDashboard}
						iconFilled={MdDashboard}
						isActive={activeItem === 'dashboard'}
						onClick={() => setActiveItem('dashboard')}
					/>
					<SidebarItem
						label="Campaigns"
						iconOutlined={MdOutlineCampaign}
						iconFilled={MdCampaign}
						isActive={activeItem === 'campaigns'}
						onClick={() => setActiveItem('campaigns')}
					/>
					<SidebarItem
						label="Contacts"
						iconOutlined={MdPeopleOutline}
						iconFilled={MdPeople}
						isActive={activeItem === 'contacts'}
						onClick={() => setActiveItem('contacts')}
					/>
					<SidebarItem
						label="Settings"
						iconOutlined={MdOutlineSettings}
						iconFilled={MdSettings}
						isActive={activeItem === 'settings'}
						onClick={() => setActiveItem('settings')}
					/>
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const WithNestedItems: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		const [activeItem, setActiveItem] = useState('contacts');
		const [activeSubItem, setActiveSubItem] = useState('all-contacts');

		const handleItemClick = (itemId: string, firstSubItemId?: string) => {
			setActiveItem(itemId);
			if (firstSubItemId) {
				setActiveSubItem(firstSubItemId);
			}
		};

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel title="Contacts" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
					<SidebarItem
						label="Contacts"
						iconOutlined={MdPeopleOutline}
						iconFilled={MdPeople}
						isActive={activeItem === 'contacts'}
						onClick={() => handleItemClick('contacts', 'all-contacts')}
					>
						<SidebarSubItem
							label="All Contacts"
							isActive={activeSubItem === 'all-contacts'}
							onClick={() => setActiveSubItem('all-contacts')}
						/>
						<SidebarSubItem
							label="Segments"
							isActive={activeSubItem === 'segments'}
							onClick={() => setActiveSubItem('segments')}
						/>
						<SidebarSubItem
							label="Tags"
							isActive={activeSubItem === 'tags'}
							onClick={() => setActiveSubItem('tags')}
						/>
					</SidebarItem>
					<SidebarItem
						label="Campaigns"
						iconOutlined={MdOutlineCampaign}
						iconFilled={MdCampaign}
						isActive={activeItem === 'campaigns'}
						onClick={() => handleItemClick('campaigns', 'active')}
					>
						<SidebarSubItem
							label="Active"
							isActive={activeSubItem === 'active'}
							onClick={() => setActiveSubItem('active')}
						/>
						<SidebarSubItem
							label="Drafts"
							isActive={activeSubItem === 'drafts'}
							onClick={() => setActiveSubItem('drafts')}
						/>
						<SidebarSubItem
							label="Archived"
							isActive={activeSubItem === 'archived'}
							onClick={() => setActiveSubItem('archived')}
						/>
					</SidebarItem>
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const WithSubSubItems: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		const [activeParent, setActiveParent] = useState('contacts');
		const [activeChild, setActiveChild] = useState<string | null>('segments');
		const [activeSubItem, setActiveSubItem] = useState('vip-customers');

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel title="Contacts" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
					{/* Top level item with nested structure */}
					<SidebarItem
						label="Contacts"
						iconOutlined={MdPeopleOutline}
						iconFilled={MdPeople}
						isActive={activeParent === 'contacts'}
						onClick={() => {
							setActiveParent('contacts');
							setActiveChild('segments');
							setActiveSubItem('vip-customers');
						}}
					>
						<SidebarSubItem
							label="All Contacts"
							isActive={activeSubItem === 'all-contacts'}
							onClick={() => {
								setActiveChild(null);
								setActiveSubItem('all-contacts');
							}}
						/>
						{/* Sub item that shows sub-sub items when active */}
						<SidebarItem
							label="Segments"
							iconOutlined={MdOutlineFolder}
							iconFilled={MdFolder}
							isActive={activeChild === 'segments'}
							onClick={() => {
								setActiveChild('segments');
								setActiveSubItem('vip-customers');
							}}
						>
							<SidebarSubItem
								label="VIP Customers"
								isActive={activeSubItem === 'vip-customers'}
								onClick={() => setActiveSubItem('vip-customers')}
							/>
							<SidebarSubItem
								label="New Subscribers"
								isActive={activeSubItem === 'new-subscribers'}
								onClick={() => setActiveSubItem('new-subscribers')}
							/>
							<SidebarSubItem
								label="Inactive Users"
								isActive={activeSubItem === 'inactive-users'}
								onClick={() => setActiveSubItem('inactive-users')}
							/>
						</SidebarItem>
						<SidebarSubItem
							label="Tags"
							isActive={activeSubItem === 'tags'}
							onClick={() => {
								setActiveChild(null);
								setActiveSubItem('tags');
							}}
						/>
					</SidebarItem>

					{/* Another top level item */}
					<SidebarItem
						label="Campaigns"
						iconOutlined={MdOutlineCampaign}
						iconFilled={MdCampaign}
						isActive={activeParent === 'campaigns'}
						onClick={() => {
							setActiveParent('campaigns');
							setActiveChild(null);
							setActiveSubItem('email-campaigns');
						}}
					>
						<SidebarSubItem
							label="Email Campaigns"
							isActive={activeSubItem === 'email-campaigns'}
							onClick={() => setActiveSubItem('email-campaigns')}
						/>
						<SidebarSubItem
							label="SMS Campaigns"
							isActive={activeSubItem === 'sms-campaigns'}
							onClick={() => setActiveSubItem('sms-campaigns')}
						/>
					</SidebarItem>
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const DeepNesting: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		const [activeLevel1, setActiveLevel1] = useState('level-1');
		const [activeLevel2, setActiveLevel2] = useState('level-2');
		const [activeLevel3, setActiveLevel3] = useState('level-3');
		const [activeItem, setActiveItem] = useState('deep-item-1');

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel
					title="Deep Nesting Example"
					isOpen={isOpen}
					onToggle={() => setIsOpen(!isOpen)}
				>
					<SidebarItem
						label="Level 1"
						iconOutlined={MdOutlineFolder}
						iconFilled={MdFolder}
						isActive={activeLevel1 === 'level-1'}
						onClick={() => {
							setActiveLevel1('level-1');
							setActiveLevel2('level-2');
							setActiveLevel3('level-3');
							setActiveItem('deep-item-1');
						}}
					>
						<SidebarItem
							label="Level 2"
							iconOutlined={MdOutlineFolder}
							iconFilled={MdFolder}
							isActive={activeLevel2 === 'level-2'}
							onClick={() => {
								setActiveLevel2('level-2');
								setActiveLevel3('level-3');
								setActiveItem('deep-item-1');
							}}
						>
							<SidebarItem
								label="Level 3"
								iconOutlined={MdOutlineFolder}
								iconFilled={MdFolder}
								isActive={activeLevel3 === 'level-3'}
								onClick={() => {
									setActiveLevel3('level-3');
									setActiveItem('deep-item-1');
								}}
							>
								<SidebarSubItem
									label="Deep Item 1"
									isActive={activeItem === 'deep-item-1'}
									onClick={() => setActiveItem('deep-item-1')}
								/>
								<SidebarSubItem
									label="Deep Item 2"
									isActive={activeItem === 'deep-item-2'}
									onClick={() => setActiveItem('deep-item-2')}
								/>
								<SidebarSubItem
									label="Deep Item 3"
									isActive={activeItem === 'deep-item-3'}
									onClick={() => setActiveItem('deep-item-3')}
								/>
							</SidebarItem>
						</SidebarItem>
					</SidebarItem>
					<SidebarItem
						label="Another Section"
						iconOutlined={MdOutlineSettings}
						iconFilled={MdSettings}
						isActive={activeLevel1 === 'another'}
						onClick={() => {
							setActiveLevel1('another');
							setActiveLevel2('');
							setActiveLevel3('');
							setActiveItem('');
						}}
					/>
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const Collapsed: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel title="Dashboard" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
					<SidebarItem label="Overview" />
					<SidebarItem label="Analytics" />
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const CustomAnimation: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel
					title="Slow Animation"
					isOpen={isOpen}
					onToggle={() => setIsOpen(!isOpen)}
					animationDuration={600}
				>
					<SidebarItem label="Item 1" />
					<SidebarItem label="Item 2" />
					<SidebarItem label="Item 3" />
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const WithoutToggle: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel title="Fixed Panel" isOpen={true}>
					<SidebarItem label="This panel has no internal toggle" />
					<SidebarItem label="Use external button to control" />
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};

export const LongContent: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		const items = Array.from({ length: 20 }, (_, i) => `Navigation Item ${i + 1}`);

		return (
			<FullWidthWrapper isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
				<SidebarPanel
					title="Scrollable Content"
					isOpen={isOpen}
					onToggle={() => setIsOpen(!isOpen)}
				>
					{items.map((item, index) => (
						<SidebarItem key={index} label={item} />
					))}
				</SidebarPanel>
			</FullWidthWrapper>
		);
	},
};
