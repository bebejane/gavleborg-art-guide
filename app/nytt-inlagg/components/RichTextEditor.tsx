'use client';

import s from './RichTextEditor.module.scss';
import '@mantine/tiptap/styles.css';
import cn from 'classnames';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { Markdown } from 'tiptap-markdown';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

export type RichTextEditorProps = {
	id: string;
	value?: string;
	withAsterisk?: boolean;
	label: string;
	markdown?: boolean;
	simple?: boolean;
	onChange?: (value: string) => void;
	error?: string;
};

export default function RichTextEditorComponent(props: RichTextEditorProps) {
	const { id, value, withAsterisk, label, error, markdown, simple, onChange } = props;
	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Link,
			Highlight,
			Markdown.configure({
				breaks: true,
			}),
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
		],
		onUpdate: ({ editor }) => {
			//@ts-ignore
			onChange(markdown ? editor.storage.markdown?.getMarkdown() : editor.getHTML());
		},
		content: value,
	});

	useEffect(() => {
		if (!value && editor) editor.commands.clearContent();
	}, [editor, value]);

	return (
		<>
			<label htmlFor={id} className={s.label}>
				{label} {withAsterisk && <span className={s.asterisk}>*</span>}
			</label>
			<RichTextEditor
				editor={editor}
				defaultValue={value}
				id={id}
				className={cn(s.editor, error && s.invalid)}
				data-path={id}
			>
				<RichTextEditor.Toolbar>
					{simple ? (
						<RichTextEditor.ControlsGroup>
							<RichTextEditor.Italic />
						</RichTextEditor.ControlsGroup>
					) : (
						<>
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
						</>
					)}
				</RichTextEditor.Toolbar>

				<RichTextEditor.Content />
			</RichTextEditor>
			{error && (
				<p className={s.error} data-size='sm'>
					Plats är obligatoriskt
				</p>
			)}
		</>
	);
}
