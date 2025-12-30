'use client';

import React, { ReactNode, DragEvent, useState } from 'react';

interface UploadDropzoneProps {
	children: ReactNode;
	onUpload: (files: File[]) => void;
}

export function UploadDropzone({ children, onUpload }: UploadDropzoneProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			onUpload(files);
		}
	};

	return (
		<div
			className="relative h-full"
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{children}

			{isDragOver && (
				<div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center text-lg text-blue-600 z-10">
					Drop files here to upload
				</div>
			)}
		</div>
	);
}
