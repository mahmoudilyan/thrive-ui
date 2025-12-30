'use client';

import { Contact } from '@/types/contacts/index';
import { Row } from '@tanstack/react-table';
import { useMemo, useState, useEffect, useRef, memo, useCallback } from 'react';
import { AvatarCheckbox } from '@thrive/ui';
import { randomPalette } from '@/lib/utils';

const ContactAvatarCheckbox = ({ row }: { row: Row<Contact> }) => {
	// Memoize the color palette to prevent regeneration on every render
	const variant = useMemo<
		| 'normal'
		| 'blue'
		| 'red'
		| 'yellow'
		| 'orange'
		| 'purple'
		| 'pink'
		| 'green'
		| 'indigo'
		| 'teal'
	>(() => randomPalette(), [row.original.id]);

	const [isHovered, setIsHovered] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Store row toggle function in a ref to avoid recreating callback
	const rowToggleRef = useRef(row.toggleSelected);
	rowToggleRef.current = row.toggleSelected;

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Find the closest table row
		const tableRow = container.closest('tr');
		if (!tableRow) return;

		const handleMouseEnter = () => setIsHovered(true);
		const handleMouseLeave = () => setIsHovered(false);

		tableRow.addEventListener('mouseenter', handleMouseEnter);
		tableRow.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			tableRow.removeEventListener('mouseenter', handleMouseEnter);
			tableRow.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	// Stable callback that doesn't recreate on every render
	const handleChange = useCallback((value: boolean) => {
		rowToggleRef.current(!!value);
	}, []);

	const isSelected = row.getIsSelected();

	return (
		<div ref={containerRef}>
			<AvatarCheckbox
				checked={isSelected}
				onCheckedChange={handleChange}
				aria-label="Select row"
				size="sm"
				name={row.original.letters}
				src={row.original.picture}
				variant={variant}
				isHovered={isHovered}
			/>
		</div>
	);
};

ContactAvatarCheckbox.displayName = 'ContactAvatarCheckbox';

export default memo(ContactAvatarCheckbox, (prevProps, nextProps) => {
	// Only re-render if selection state or contact data actually changed
	const prevSelected = prevProps.row.getIsSelected();
	const nextSelected = nextProps.row.getIsSelected();
	const prevContactId = prevProps.row.original.id;
	const nextContactId = nextProps.row.original.id;

	return prevSelected === nextSelected && prevContactId === nextContactId;
});
