/**
 * ImageWrapper component that provides deletion functionality for images in the editor
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import ImageDeleteButton from './ImageDeleteButton';
import { findImageAtPosition, deleteImage, validateImageDeletion } from '../utils/imageUtils';

interface ImageWrapperProps {
  /** TipTap editor instance */
  editor: Editor | null;
  /** Position of the image in the document */
  imagePos: number;
  /** Whether to show delete controls */
  showControls?: boolean;
  /** Callback when image is deleted */
  onImageDeleted?: (pos: number) => void;
  /** Callback when deletion fails */
  onDeleteError?: (error: string) => void;
}

/**
 * ImageWrapper - Wraps images with deletion controls
 */
const ImageWrapper: React.FC<ImageWrapperProps> = ({
  editor,
  imagePos,
  showControls = true,
  onImageDeleted,
  onDeleteError,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Handles image deletion with validation
   */
  const handleDelete = useCallback(async () => {
    if (!editor) return;

    const imageInfo = findImageAtPosition(editor, imagePos);
    if (!imageInfo) {
      onDeleteError?.('Image not found at the specified position');
      return;
    }

    // Validate deletion
    const validation = validateImageDeletion(editor, imageInfo);
    if (!validation.isValid) {
      onDeleteError?.(validation.warnings.join(', '));
      return;
    }

    setIsDeleting(true);

    try {
      const result = deleteImage(editor, imageInfo);
      
      if (result.success) {
        onImageDeleted?.(imagePos);
        // Focus the editor after deletion
        editor.commands.focus();
      } else {
        onDeleteError?.(result.error || 'Failed to delete image');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onDeleteError?.(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [editor, imagePos, onImageDeleted, onDeleteError]);

  /**
   * Handle keyboard events for accessibility
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Delete key or Backspace when image is selected
    if ((event.key === 'Delete' || event.key === 'Backspace') && isHovered) {
      event.preventDefault();
      handleDelete();
    }
  }, [isHovered, handleDelete]);

  /**
   * Set up keyboard event listeners
   */
  useEffect(() => {
    if (showControls && isHovered) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showControls, isHovered, handleKeyDown]);

  /**
   * Handle mouse enter
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  if (!editor || !showControls) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className="image-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'inline-block',
        transition: 'all 0.2s ease',
        outline: isHovered ? '2px solid var(--mantine-color-blue-5)' : 'none',
        borderRadius: '4px',
      }}
      data-testid="image-wrapper"
    >
      {/* Delete button overlay */}
      {(isHovered || isDeleting) && (
        <ImageDeleteButton
          editor={editor}
          imagePos={imagePos}
          onDeleteStart={() => setIsDeleting(true)}
          onDeleteEnd={() => setIsDeleting(false)}
          onDeleteError={onDeleteError}
          visible={true}
          size="xs"
          requireConfirmation={true}
          style={{
            top: -8,
            right: -8,
            backgroundColor: 'var(--mantine-color-red-6)',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
    </div>
  );
};

export default React.memo(ImageWrapper);