/**
 * Custom hook for managing editor configuration
 */

'use client';

import { useMemo } from 'react';
import { ReactRenderer, useEditor } from '@tiptap/react';
import type { Editor as CoreEditor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { EditorConfig } from '../types';
import { DEFAULT_EDITOR_CONFIG } from '../constants';
import Youtube from '@tiptap/extension-youtube';

interface UseEditorConfigProps {
  value: string;
  onChange: (html: string) => void;
  config?: Partial<EditorConfig>;
  disabled?: boolean;
}

/**
 * Custom hook for configuring and initializing the TipTap editor
 */
export const useEditorConfig = ({
  value,
  onChange,
  config = {},
  disabled = false,
}: UseEditorConfigProps) => {
  // Merge default config with provided config
  const editorConfig = useMemo(
    () => ({ ...DEFAULT_EDITOR_CONFIG, ...config }),
    [config]
  );

  // Configure editor extensions
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        link: false, // We use the Link extension separately for better control
      }),
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        allowBase64: editorConfig.allowBase64,
        HTMLAttributes: {
          class: 'editor-image editor-image-centered',
          style:
            'max-width: 600px; width: 100%; height: auto; display: block; margin: 1rem auto; object-fit: contain;',
        },
        inline: false,
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'youtube-video-centered',
        },
        controls: true,
        nocookie: true,
        progressBarColor: 'red',
        inline: false,
        allowFullscreen: true,
      }),
    ],
    [editorConfig.allowBase64]
  );

  // Initialize editor
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    editable: !disabled,
    extensions,
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
        'data-testid': 'rich-text-editor-content',
      },
      handlePaste: (view, event) => {
        // Handle pasted images with consistent styling
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              if (dataUrl) {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({
                      src: dataUrl,
                      alt: 'Pasted image',
                      class: 'editor-image editor-image-centered',
                      style:
                        'max-width: 600px; width: 100%; height: auto; display: block; margin: 1rem auto; object-fit: contain;',
                    })
                  )
                );
              }
            };
            reader.readAsDataURL(file);
          }
          return true;
        }
        return false;
      },
      handleDrop: (view, event) => {
        // Handle dropped images with consistent styling
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFile = files.find((file) => file.type.startsWith('image/'));

        if (imageFile) {
          event.preventDefault();
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl) {
              const { tr } = view.state;
              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (pos) {
                view.dispatch(
                  tr.insert(
                    pos.pos,
                    view.state.schema.nodes.image.create({
                      src: dataUrl,
                      alt: 'Dropped image',
                      class: 'editor-image editor-image-centered',
                      style:
                        'max-width: 600px; width: 100%; height: auto; display: block; margin: 1rem auto; object-fit: contain;',
                    })
                  )
                );
              }
            }
          };
          reader.readAsDataURL(imageFile);
          return true;
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        // Handle Delete and Backspace keys for image deletion
        if (event.key === 'Delete' || event.key === 'Backspace') {
          const { state } = view;
          const { selection } = state;

          // Check if we're at an image node
          const node = state.doc.nodeAt(selection.from);
          if (node && node.type.name === 'image') {
            event.preventDefault();
            const tr = state.tr.delete(
              selection.from,
              selection.from + node.nodeSize
            );
            view.dispatch(tr);
            return true;
          }

          // Check if selection contains an image
          let hasImage = false;
          state.doc.nodesBetween(selection.from, selection.to, (node) => {
            if (node.type.name === 'image') {
              hasImage = true;
              return false; // Stop iteration
            }
          });

          if (hasImage) {
            event.preventDefault();
            const tr = state.tr.deleteSelection();
            view.dispatch(tr);
            return true;
          }
        }
        return false;
      },
    },
  });

  return {
    editor,
    config: editorConfig,
  };
};
