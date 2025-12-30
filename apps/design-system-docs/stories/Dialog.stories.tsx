import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	Dialog as DialogBase,
	DialogContent as DialogContentBase,
	DialogDescription as DialogDescriptionBase,
	DialogFooter as DialogFooterBase,
	DialogHeader as DialogHeaderBase,
	DialogTitle as DialogTitleBase,
	DialogTrigger as DialogTriggerBase,
	Button as ButtonBase,
	Input as InputBase,
	Select as SelectBase,
	SelectContent as SelectContentBase,
	SelectItem as SelectItemBase,
	SelectTrigger as SelectTriggerBase,
	SelectValue as SelectValueBase,
	Text as TextBase,
} from '@thrive/ui';
import { MdWarning, MdDelete, MdAdd, MdFolder } from 'react-icons/md';

// Type assertions to fix React 19 compatibility
const Dialog = DialogBase as any;
const DialogContent = DialogContentBase as any;
const DialogDescription = DialogDescriptionBase as any;
const DialogFooter = DialogFooterBase as any;
const DialogHeader = DialogHeaderBase as any;
const DialogTitle = DialogTitleBase as any;
const DialogTrigger = DialogTriggerBase as any;
const Button = ButtonBase as any;
const Input = InputBase as any;
const Select = SelectBase as any;
const SelectContent = SelectContentBase as any;
const SelectItem = SelectItemBase as any;
const SelectTrigger = SelectTriggerBase as any;
const SelectValue = SelectValueBase as any;
const Text = TextBase as any;

const meta = {
	title: 'Components/Dialog',
	component: Dialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
# Dialog

A comprehensive dialog system built on Radix UI primitives, showcasing real-world examples from common application workflows.

## Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Focus management**: Traps focus within the dialog
- **Backdrop**: Overlay prevents interaction with background content
- **Animations**: Smooth open/close transitions
- **Flexible sizing**: Adapts to content with maximum width constraints
- **Close handling**: ESC key and backdrop click to close
- **Customizable**: Optional close button and custom styling

## Common Dialog Patterns

These examples are based on real dialog components used throughout the application:

- **Confirmation dialogs**: Delete confirmations with warnings
- **Form dialogs**: Create and edit workflows
- **Complex workflows**: Multi-step processes and advanced forms
- **Utility dialogs**: Email sending, folder management, etc.

## Usage

\`\`\`tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@thrive/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text goes here.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`
				`,
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="primary">Open Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Basic Dialog</DialogTitle>
					<DialogDescription>
						This is a simple dialog with a title, description, and action buttons.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="secondary">Cancel</Button>
					<Button variant="primary">Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Based on delete-folder-dialog.tsx
export const DeleteFolderConfirmation: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive" leftIcon={<MdDelete />}>
					Delete Folder
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Folder</DialogTitle>
				</DialogHeader>
				<Text>Are you sure you want to delete this folder?</Text>
				<div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<MdWarning className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium text-warning-800 mb-1">Warning</p>
							<p className="text-sm text-warning-700">
								Deleting this folder will move all items inside it to the feature's root directory.
							</p>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="secondary">Cancel</Button>
					<Button variant="destructive">Delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Based on create-folder-dialog.tsx
export const CreateFolderForm: Story = {
	render: () => {
		const [folderName, setFolderName] = React.useState('');

		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="primary" leftIcon={<MdAdd />}>
						Create Folder
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Folder</DialogTitle>
					</DialogHeader>
					<div>
						<div className="space-y-2">
							<label htmlFor="folder-name">Folder Name</label>
							<Input
								id="folder-name"
								placeholder="Enter folder name"
								value={folderName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFolderName(e.target.value)}
								onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter' && folderName.trim()) {
										// Handle create action
										alert('Folder created: ' + folderName);
									}
								}}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="secondary">Cancel</Button>
						<Button disabled={!folderName.trim()}>Create Folder</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};

// Based on bulk operation dialogs
export const BulkDeleteConfirmation: Story = {
	render: () => {
		const selectedItems = ['Campaign 1', 'Campaign 2', 'Campaign 3'];

		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="destructive">Delete Selected Items</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Multiple Items</DialogTitle>
					</DialogHeader>
					<Text>
						You are about to delete <strong>{selectedItems.length} campaigns</strong>. This action
						cannot be undone.
					</Text>
					<div className="bg-bg rounded-lg p-3">
						<p className="font-medium text-sm mb-2">Items to be deleted:</p>
						<div className="space-y-1">
							{selectedItems.map((item, index) => (
								<div key={index} className="flex items-center gap-2">
									<div className="w-2 h-2 bg-destructive-solid rounded-full"></div>
									<Text className="text-sm">{item}</Text>
								</div>
							))}
						</div>
					</div>
					<div className="bg-destructive-50 border border-destructive-200 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<MdWarning className="w-5 h-5 text-destructive-600 flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-destructive-800 mb-1">Permanent Deletion</p>
								<p className="text-sm text-destructive-700">
									This action will permanently remove all selected items and cannot be undone.
								</p>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="secondary">Cancel</Button>
						<Button variant="destructive">Delete {selectedItems.length} Items</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};

// Simplified version of the compose dialog complexity
export const AddToFolderDialog: Story = {
	render: () => {
		const [selectedFolder, setSelectedFolder] = React.useState('');
		const [createNew, setCreateNew] = React.useState(false);
		const [newFolderName, setNewFolderName] = React.useState('');

		const folders = [
			{ value: '1', label: 'Marketing Campaigns' },
			{ value: '2', label: 'Social Media Content' },
			{ value: '3', label: 'Email Templates' },
		];

		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="secondary" leftIcon={<MdFolder />}>
						Add to Folder
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add to Folder</DialogTitle>
						<DialogDescription>
							Choose an existing folder or create a new one to organize your content.
						</DialogDescription>
					</DialogHeader>
					<div>
						<div className="space-y-4">
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<label>Select Folder</label>
									<Button variant="ghost" size="sm" onClick={() => setCreateNew(!createNew)}>
										{createNew ? 'Select Existing' : 'Create New'}
									</Button>
								</div>

								{createNew ? (
									<div className="space-y-2">
										<Input
											type="text"
											placeholder="New folder name"
											value={newFolderName}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												setNewFolderName(e.target.value)
											}
										/>
									</div>
								) : (
									<Select value={selectedFolder} onValueChange={setSelectedFolder}>
										<SelectTrigger>
											<SelectValue placeholder="Choose a folder" />
										</SelectTrigger>
										<SelectContent>
											{folders.map(folder => (
												<SelectItem key={folder.value} value={folder.value}>
													{folder.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>

							<div className="bg-muted rounded-lg p-3">
								<p className="text-sm text-ink-light">
									<strong>3 items</strong> will be added to the selected folder
								</p>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="secondary">Cancel</Button>
						<Button disabled={createNew ? !newFolderName.trim() : !selectedFolder}>
							{createNew ? 'Create & Add' : 'Add to Folder'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};
