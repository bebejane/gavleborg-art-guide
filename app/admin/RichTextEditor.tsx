'use client';

import s from './RichTextEditor.module.scss';
import '@mantine/tiptap/styles.css';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

export type RichTextEditorProps = {
	withAsterisk?: boolean;
	label: string;
	onChange?: (value: string) => void;
	value?: string;
	id: string;
};

export default function RichTextEditorComponent({ withAsterisk, id, label, value, onChange }: RichTextEditorProps) {
	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Link,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
		],
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		content: value,
	});

	return (
		<>
			<label htmlFor={id} className={s.label}>
				{label} {withAsterisk && <span className={s.asterisk}>*</span>}
			</label>
			<RichTextEditor editor={editor} id={id} className={s.editor}>
				<RichTextEditor.Toolbar>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Blockquote />
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Link />
						<RichTextEditor.Unlink />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>
				</RichTextEditor.Toolbar>

				<RichTextEditor.Content />
			</RichTextEditor>
		</>
	);
}
