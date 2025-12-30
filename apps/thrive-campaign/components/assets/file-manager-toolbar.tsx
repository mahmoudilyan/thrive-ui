'use client';

import { useRef } from 'react';
import {
	MdUpload,
	MdCreateNewFolder,
	MdRefresh,
	MdSelectAll,
	MdDelete,
	MdCopy,
	MdContentCut,
	MdContentPaste,
	MdDeselect,
} from 'react-icons/md';
import { Button, IconButton } from '@thrive/ui';

interface FileManagerToolbarProps {
	onUpload: (files: File[]) => void;
	onCreateFolder: () => void;
	onRefresh: () => void;
	selectedCount: number;
	onDelete: () => void;
	onCopy: () => void;
	onCut: () => void;
	onPaste: () => void;
	onSelectAll: () => void;
	onClearSelection: () => void;
	canPaste: boolean;
}

export function FileManagerToolbar({
	onUpload,
	onCreateFolder,
	onRefresh,
	selectedCount,
	onDelete,
	onCopy,
	onCut,
	onPaste,
	onSelectAll,
	onClearSelection,
	canPaste,
}: FileManagerToolbarProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		if (files.length > 0) {
			onUpload(files);
		}
		// Reset input value to allow selecting the same file again
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className="flex items-center gap-2 flex-wrap">
			{/* Upload */}
			<div>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					onChange={handleFileSelect}
					className="hidden"
				/>
				<Button leftIcon={<MdUpload />} onClick={() => fileInputRef.current?.click()} size="sm">
					Upload
				</Button>
			</div>

			{/* Create Folder */}
			<Button
				leftIcon={<MdCreateNewFolder />}
				onClick={onCreateFolder}
				size="sm"
				variant="secondary"
			>
				New Folder
			</Button>

			{/* Refresh */}
			<IconButton aria-label="Refresh" onClick={onRefresh} size="sm" variant="secondary">
				<MdRefresh />
			</IconButton>

			{/* Selection Actions */}
			{selectedCount > 0 ? (
				<div className="flex items-center gap-2 pl-4 border-l border-gray-200">
					<IconButton
						aria-label="Delete selected"
						onClick={onDelete}
						size="sm"
						variant="destructive"
					>
						<MdDelete />
					</IconButton>
					<IconButton aria-label="Copy selected" onClick={onCopy} size="sm" variant="secondary">
						<MdCopy />
					</IconButton>
					<IconButton aria-label="Cut selected" onClick={onCut} size="sm" variant="secondary">
						<MdContentCut />
					</IconButton>
					<IconButton
						aria-label="Clear selection"
						onClick={onClearSelection}
						size="sm"
						variant="secondary"
					>
						<MdDeselect />
					</IconButton>
				</div>
			) : (
				<div className="flex items-center gap-2 pl-4 border-l border-gray-200">
					<IconButton aria-label="Select all" onClick={onSelectAll} size="sm" variant="secondary">
						<MdSelectAll />
					</IconButton>
				</div>
			)}

			{/* Paste */}
			{canPaste && (
				<IconButton
					aria-label="Paste"
					onClick={onPaste}
					size="sm"
					variant="secondary"
					className="ml-2"
				>
					<MdContentPaste />
				</IconButton>
			)}
		</div>
	);
}
