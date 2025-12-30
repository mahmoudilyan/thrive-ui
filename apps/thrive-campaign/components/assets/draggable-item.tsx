'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Drag and Drop Types
const ItemTypes = {
	FILE: 'file',
	FOLDER: 'folder',
};

interface DragItem {
	key: string;
	name: string;
	type: 'file' | 'folder';
}

interface S3Item {
	name: string;
	type: 'file' | 'folder';
	size?: number;
	lastModified?: Date;
	url?: string;
	thumbnailUrl?: string;
	key: string;
}

interface DraggableItemProps {
	item: S3Item;
	children: React.ReactNode;
	onDrop?: (dragItem: DragItem, dropTarget: S3Item) => void;
	onExternalFileDrop?: (files: File[], dropTarget: S3Item) => void;
}

export function DraggableItem({ item, children, onDrop, onExternalFileDrop }: DraggableItemProps) {
	const [isExternalDragOver, setIsExternalDragOver] = useState(false);
	const isDraggingRef = useRef(false);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: item.type === 'folder' ? ItemTypes.FOLDER : ItemTypes.FILE,
		item: { key: item.key, name: item.name, type: item.type } as DragItem,
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
		end: () => {
			// Reset dragging state after drag ends
			setTimeout(() => {
				isDraggingRef.current = false;
			}, 0);
		},
	}));

	// Set dragging state when drag starts
	useEffect(() => {
		isDraggingRef.current = isDragging;
	}, [isDragging]);

	const [{ isOver, canDrop }, drop] = useDrop(() => ({
		accept: [ItemTypes.FILE, ItemTypes.FOLDER],
		canDrop: () => item.type === 'folder',
		drop: (dragItem: DragItem | any) => {
			if (item.type !== 'folder') return;

			// Internal drag and drop only
			if (onDrop) {
				onDrop(dragItem, item);
			}
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		}),
	}));

	// Handle native drag events for external files
	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			// Only handle external file drags, not internal drag operations
			if (e.dataTransfer.types.includes('Files')) {
				if (item.type !== 'folder') return;
				e.preventDefault();
				e.stopPropagation();
				setIsExternalDragOver(true);
			}
		},
		[item.type]
	);

	const handleDragEnter = useCallback(
		(e: React.DragEvent) => {
			// Only handle external file drags
			if (e.dataTransfer.types.includes('Files')) {
				if (item.type !== 'folder') return;
				e.preventDefault();
				e.stopPropagation();
				setIsExternalDragOver(true);
			}
		},
		[item.type]
	);

	const handleDragLeave = useCallback(
		(e: React.DragEvent) => {
			// Only handle external file drags
			if (e.dataTransfer.types.includes('Files')) {
				if (item.type !== 'folder') return;
				e.preventDefault();
				e.stopPropagation();

				// Only set to false if we're leaving the element completely
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX;
				const y = e.clientY;

				if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
					setIsExternalDragOver(false);
				}
			}
		},
		[item.type]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			// Only handle external file drops
			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				if (item.type !== 'folder') return;
				e.preventDefault();
				e.stopPropagation();

				setIsExternalDragOver(false);

				const files = Array.from(e.dataTransfer.files);
				if (onExternalFileDrop) {
					onExternalFileDrop(files, item);
				}
			}
		},
		[item.type, onExternalFileDrop, item]
	);

	// Handle context menu - allow it to bubble up for MenuContextTrigger
	const handleContextMenu = useCallback(() => {
		// Don't prevent default - let the context menu work
		// The event will bubble up to the MenuContextTrigger
	}, []);

	// Combine drag and drop refs using react-dnd's combine refs utility
	const dragDropRef = (node: HTMLDivElement | null) => {
		// Apply drag ref to all items
		drag(node);
		// Apply drop ref only to folders
		if (item.type === 'folder') {
			drop(node);
		}
	};

	// Determine if should show highlight
	const showHighlight = item.type === 'folder' && ((isOver && canDrop) || isExternalDragOver);

	return (
		<div
			ref={dragDropRef}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			className={`group relative w-40 h-40 ${
				showHighlight ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''
			}`}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onContextMenu={handleContextMenu}
			draggable={false} // Prevent browser native drag
		>
			{children}
		</div>
	);
}

// Export types that might be needed by the parent component
export type { S3Item, DragItem };
