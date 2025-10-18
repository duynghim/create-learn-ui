'use client';

import React, { useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { Box, Input } from '@mantine/core';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';

type Props = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  withAsterisk?: boolean;
  error?: string | null;
  minHeight?: number;
  placeholder?: string;
};

const RichContentEditor: React.FC<Props> = ({
  value,
  onChange,
  label = 'Content',
  withAsterisk = false,
  error,
  minHeight = 220,
  placeholder,
}) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    // ✨ key fix: avoid SSR hydration mismatch
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Keep editor content in sync if the external value changes
  useEffect(() => {
    if (!editor) return;
    const html = editor.getHTML();
    if (value !== html) {
      // ✨ pass false so this doesn't emit an update and re-loop
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  return (
    <Input.Wrapper label={label} withAsterisk={withAsterisk} error={error}>
      <Box
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          overflow: 'hidden',
        }}
      >
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            data-placeholder={placeholder || 'Write the full content here…'}
            style={{ minHeight }}
          />
        </RichTextEditor>
      </Box>
    </Input.Wrapper>
  );
};

export default RichContentEditor;
