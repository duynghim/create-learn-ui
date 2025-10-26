/**
 * EditorToolbar component for the RichTextEditor
 */

'use client';

import React from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { EditorToolbarProps } from '../types';
import Youtube from '@tiptap/extension-youtube';
import { YoutubeControls } from './youtube-extension/YoutubeControl';

/**
 * EditorToolbar component containing all editor controls
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  imageControls,
}) => {
  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor.Toolbar sticky stickyOffset={0}>
      {/* Text formatting controls */}
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Highlight />
        <RichTextEditor.Code />
      </RichTextEditor.ControlsGroup>

      {/* Heading controls */}
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>

      {/* Block and list controls */}
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Blockquote />
        <RichTextEditor.Hr />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Subscript />
        <RichTextEditor.Superscript />
      </RichTextEditor.ControlsGroup>

      {/* Link controls */}
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup>

      {/* Alignment controls */}
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.AlignLeft />
        <RichTextEditor.AlignCenter />
        <RichTextEditor.AlignJustify />
        <RichTextEditor.AlignRight />
      </RichTextEditor.ControlsGroup>

      {/* Image controls */}
      <RichTextEditor.ControlsGroup>
        {imageControls}
        <YoutubeControls editor={editor} />
      </RichTextEditor.ControlsGroup>

      {/* Undo/Redo controls */}
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Undo />
        <RichTextEditor.Redo />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
  );
};

export default React.memo(EditorToolbar);
