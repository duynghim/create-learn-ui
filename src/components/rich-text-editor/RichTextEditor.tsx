/**
 * RichTextEditor - A comprehensive rich text editor component built with TipTap and Mantine
 * 
 * Features:
 * - Rich text formatting (bold, italic, underline, etc.)
 * - Headings, lists, and block elements
 * - Image upload and URL insertion
 * - Link management
 * - Text alignment
 * - Undo/Redo functionality
 * - Drag and drop support
 * - Performance optimized with memoization
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { Box, Input, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

// Internal imports
import { RichTextEditorProps } from './types';
import { DEFAULT_PLACEHOLDER } from './constants';
import { useEditorConfig, useImageUpload } from './hooks';
import { ImageControls, EditorToolbar, ImageManager } from './components';

// Import CSS styles
import './styles.css';

/**
 * RichContentEditor - Main component for rich text editing
 */
const RichContentEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Content',
  withAsterisk = false,
  error,
  minHeight = 220,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
  maxFileSize,
  acceptedImageTypes,
}) => {
  // Initialize editor configuration
  const { editor, config } = useEditorConfig({
    value,
    onChange,
    config: {
      minHeight,
      maxFileSize,
      acceptedImageTypes,
    },
    disabled,
  });

  // Initialize image upload functionality
  const imageUpload = useImageUpload();

  // Sync editor content with prop value
  useEffect(() => {
    if (!editor || disabled) return;
    
    const currentContent = editor.getHTML();
    if (value !== currentContent) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor, disabled]);

  // Memoize image controls to prevent unnecessary re-renders
  const imageControls = useMemo(() => {
    if (!editor) return null;

    return (
      <ImageControls
        editor={editor}
        loading={imageUpload.loading}
        onUploadStart={imageUpload.onUploadStart}
        onUploadEnd={imageUpload.onUploadEnd}
        maxFileSize={config.maxFileSize}
        acceptedTypes={config.acceptedImageTypes}
        onError={imageUpload.onError}
      />
    );
  }, [
    editor,
    imageUpload.loading,
    imageUpload.onUploadStart,
    imageUpload.onUploadEnd,
    imageUpload.onError,
    config.maxFileSize,
    config.acceptedImageTypes,
  ]);

  // Memoize toolbar to prevent unnecessary re-renders
  const toolbar = useMemo(() => (
    <EditorToolbar 
      editor={editor} 
      imageControls={imageControls} 
    />
  ), [editor, imageControls]);

  return (
    <Input.Wrapper 
      label={label} 
      withAsterisk={withAsterisk} 
      error={error}
    >
      {/* Display upload errors */}
      {imageUpload.error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          mb="xs"
          onClose={imageUpload.clearError}
          withCloseButton
        >
          {imageUpload.error}
        </Alert>
      )}

      <Box
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          overflow: 'hidden',
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <RichTextEditor editor={editor}>
          {toolbar}
          
          <RichTextEditor.Content
            data-placeholder={placeholder}
            style={{ 
              minHeight: config.minHeight,
              cursor: disabled ? 'not-allowed' : 'text',
            }}
          />
          
          {/* Image Management */}
          <ImageManager 
            editor={editor}
            enableDeletion={!disabled}
            showHoverEffects={!disabled}
          />
        </RichTextEditor>
      </Box>
    </Input.Wrapper>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(RichContentEditor);
