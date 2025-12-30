'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
	MdFormatBold,
	MdFormatItalic,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdLink,
	MdUndo,
	MdRedo,
	MdCode,
	MdEmojiEmotions,
} from 'react-icons/md';
import { Box, IconButton, Flex } from '@thrive/ui';

interface TiptapEditorProps {
	content: string;
	onUpdate: (content: string) => void;
	minHeight?: number;
	placeholder?: string;
}

export function TiptapEditor({
	content,
	onUpdate,
	minHeight = 220,
	placeholder = 'Type your message here...',
}: TiptapEditorProps) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-primary underline',
				},
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onUpdate(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: 'prose prose-sm max-w-none focus:outline-none p-4',
			},
		},
	});

	if (!editor) {
		return null;
	}

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	};

	const handleShortcode = () => {
		// TODO: Implement shortcode picker
		console.log('Open shortcode picker');
	};

	const handleEmoji = () => {
		// TODO: Implement emoji picker
		console.log('Open emoji picker');
	};

	return (
		<Box className="border border-border rounded-lg overflow-hidden">
			{/* Toolbar */}
			<Flex className="border-b border-border p-2 gap-1 bg-gray-50 flex-wrap">
				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'bg-gray-200' : ''}
					aria-label="Bold"
				>
					<MdFormatBold />
				</IconButton>

				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'bg-gray-200' : ''}
					aria-label="Italic"
				>
					<MdFormatItalic />
				</IconButton>

				<div className="w-px bg-gray-300 mx-1" />

				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
					aria-label="Bullet list"
				>
					<MdFormatListBulleted />
				</IconButton>

				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
					aria-label="Numbered list"
				>
					<MdFormatListNumbered />
				</IconButton>

				<div className="w-px bg-gray-300 mx-1" />

				<IconButton
					size="sm"
					variant="ghost"
					onClick={setLink}
					className={editor.isActive('link') ? 'bg-gray-200' : ''}
					aria-label="Add link"
				>
					<MdLink />
				</IconButton>

				<div className="w-px bg-gray-300 mx-1" />

				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					aria-label="Undo"
				>
					<MdUndo />
				</IconButton>

				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					aria-label="Redo"
				>
					<MdRedo />
				</IconButton>

				<div className="flex-1" />

				<IconButton
					size="sm"
					variant="ghost"
					onClick={handleShortcode}
					aria-label="Insert shortcode"
				>
					<MdCode />
				</IconButton>

				<IconButton size="sm" variant="ghost" onClick={handleEmoji} aria-label="Insert emoji">
					<MdEmojiEmotions />
				</IconButton>
			</Flex>

			{/* Editor Content */}
			<Box className="bg-white overflow-y-auto" style={{ minHeight: `${minHeight}px` }}>
				<EditorContent editor={editor} />
			</Box>
		</Box>
	);
}
