/**
 * ImageControls component for handling image uploads in the RichTextEditor
 */

'use client';

import React, { useRef, useCallback } from 'react';
import { Tooltip, Loader } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconPhotoPlus, IconLink } from '@tabler/icons-react';
import { ImageControlsProps, EditorError } from '../types';
import { processFileUploadWithValidation } from '../utils';
import { IMAGE_ACCEPT_TYPES, TOOLTIP_DELAYS } from '../constants';

/**
 * ImageControls component for uploading and inserting images
 */
const ImageControls: React.FC<ImageControlsProps> = ({
  editor,
  loading,
  onUploadStart,
  onUploadEnd,
  maxFileSize,
  acceptedTypes,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Handles file selection from input
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file || !editor) return;

      onUploadStart();

      try {
        const result = await processFileUploadWithValidation(
          file,
          maxFileSize,
          acceptedTypes
        );

        editor
          .chain()
          .focus()
          .setImage({
            src: result.dataUrl,
            alt: result.fileName,
            title: result.fileName,
          })
          .run();
      } catch (error) {
        const editorError = error as EditorError;
        onError(editorError.message);
        console.error('Image upload failed:', editorError);
      } finally {
        onUploadEnd();
        // Clear the input value to allow re-uploading the same file
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [editor, maxFileSize, acceptedTypes, onUploadStart, onUploadEnd, onError]
  );

  /**
   * Handles inserting image by URL
   */
  const handleInsertByUrl = useCallback(() => {
    if (!editor) {
      onError('Editor is not ready');
      return;
    }

    const url = globalThis.prompt('Enter image URL:');

    if (url?.trim()) {
      const trimmedUrl = url.trim();

      // Basic URL validation
      try {
        new URL(trimmedUrl);
        editor
          .chain()
          .focus()
          .setImage({
            src: trimmedUrl,
            alt: 'Image from URL',
            title: 'Image from URL',
          })
          .run();
      } catch {
        onError('Please enter a valid URL');
      }
    }
  }, [editor, onError]);

  /**
   * Triggers file input click
   */
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <RichTextEditor.ControlsGroup>
      <Tooltip
        label="Upload image from device"
        openDelay={TOOLTIP_DELAYS.OPEN}
        closeDelay={TOOLTIP_DELAYS.CLOSE}
      >
        <RichTextEditor.Control
          onClick={handleUploadClick}
          aria-label="Upload image from device"
          disabled={loading || !editor}
        >
          {loading ? <Loader size="xs" /> : <IconPhotoPlus size={16} />}
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip
        label="Insert image by URL"
        openDelay={TOOLTIP_DELAYS.OPEN}
        closeDelay={TOOLTIP_DELAYS.CLOSE}
      >
        <RichTextEditor.Control
          onClick={handleInsertByUrl}
          aria-label="Insert image by URL"
          disabled={loading || !editor}
        >
          <IconLink size={16} />
        </RichTextEditor.Control>
      </Tooltip>

      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT_TYPES}
        hidden
        onChange={handleFileChange}
        aria-label="Image file input"
      />
    </RichTextEditor.ControlsGroup>
  );
};

export default React.memo(ImageControls);
