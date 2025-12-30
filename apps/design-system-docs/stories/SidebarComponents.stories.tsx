import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SidebarSubItem } from '@thrive/ui';

const meta: Meta<typeof SidebarSubItem> = {
	title: 'Layout/Sidebar/SidebarSubItem',
	component: SidebarSubItem,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarSubItem>;

export const Default: Story = {
	args: {
		label: 'Sub Item',
		isActive: false,
	},
	render: args => (
		<div className="w-64 bg-gray-50 p-4 rounded-lg">
			<SidebarSubItem {...args} />
		</div>
	),
};

export const Active: Story = {
	args: {
		label: 'Active Sub Item',
		isActive: true,
	},
	render: args => (
		<div className="w-64 bg-gray-50 p-4 rounded-lg">
			<SidebarSubItem {...args} />
		</div>
	),
};

export const TreeVisualization: Story = {
	render: () => {
		const [activeId, setActiveId] = useState('segments');

		const items = [
			{ id: 'all', label: 'All Contacts' },
			{ id: 'segments', label: 'Segments' },
			{ id: 'tags', label: 'Tags' },
			{ id: 'lists', label: 'Lists' },
		];

		return (
			<div className="w-64 bg-gray-50 p-4 rounded-lg flex flex-col">
				<p className="text-xs text-gray-500 mb-2">
					Connectors are automatic via React props:
				</p>
				{items.map(item => (
					<SidebarSubItem
						key={item.id}
						label={item.label}
						isActive={activeId === item.id}
						onClick={() => setActiveId(item.id)}
					/>
				))}
				<p className="text-xs text-gray-400 mt-4">
					• First item: small top line<br />
					• Active item: curved arrow (SVG)<br />
					• Before active: vertical line<br />
					• After active: no connector
				</p>
			</div>
		);
	},
};
