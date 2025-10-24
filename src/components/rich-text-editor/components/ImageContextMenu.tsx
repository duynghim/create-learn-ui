/**
 * ImageContextMenu component for providing right-click context menu for images
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Menu, Portal } from '@mantine/core';
import { IconTrash, IconCopy, IconDownload } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { findImageAtPosition, deleteImage, validateImageDeletion } from '../utils/imageUtils';

interface ImageContextMenuProps {
  /** TipTap editor instance */
  editor: Editor | null;
  /** Position of the image in the document */
  imagePos: number;
  /** Whether the context menu is open */
  opened: boolean;
  /** Callback when menu should close */
  onClose: () => void;
  /** Position where the menu should appear */
  position: { x: number; y: number };
  /** Callback when image is deleted */
  onImageDeleted?: (pos: number) => void;
  /** Callback when deletion fails */
  onDeleteError?: (error: string) => void;
}

/**
 * ImageContextMenu - Context menu for image operations
 */
const ImageContextMenu: React.FC<ImageContextMenuProps> = ({
  editor,
  imagePos,
  opened,
  onClose,
  position,
  onImageDeleted,
  onDeleteError,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Handle image deletion with validation
   */
  const handleDelete = useCallback(async () => {
    if (!editor) return;

    const imageInfo = findImageAtPosition(editor, imagePos);
    if (!imageInfo) {
      onDeleteError?.('Image not found at the specified position');
      onClose();
      return;
    }

    // Validate deletion
    const validation = validateImageDeletion(editor, imageInfo);
    if (!validation.isValid) {
      onDeleteError?.(validation.warnings.join(', '));
      onClose();
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
      onClose();
    }
  }, [editor, imagePos, onImageDeleted, onDeleteError, onClose]);

  /**
   * Handle copy image URL to clipboard
   */
  const handleCopyUrl = useCallback(async () => {
    if (!editor) return;

    const imageInfo = findImageAtPosition(editor, imagePos);
    if (!imageInfo) {
      onDeleteError?.('Image not found');
      onClose();
      return;
    }

    try {
      await navigator.clipboard.writeText(imageInfo.src);
      onClose();
    } catch (error) {
      onDeleteError?.('Failed to copy image URL to clipboard');
      onClose();
    }
  }, [editor, imagePos, onDeleteError, onClose]);

  /**
   * Handle download image
   */
  const handleDownload = useCallback(() => {
    if (!editor) return;

    const imageInfo = findImageAtPosition(editor, imagePos);
    if (!imageInfo) {
      onDeleteError?.('Image not found');
      onClose();
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = imageInfo.src;
      link.download = imageInfo.alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onClose();
    } catch (error) {
      onDeleteError?.('Failed to download image');
      onClose();
    }
  }, [editor, imagePos, onDeleteError, onClose]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        handleDelete();
        break;
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          handleCopyUrl();
        }
        break;
      case 'd':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          handleDownload();
        }
        break;
    }
  }, [onClose, handleDelete, handleCopyUrl, handleDownload]);

  /**
   * Focus the menu when it opens for keyboard navigation
   */
  useEffect(() => {
    if (opened && menuRef.current) {
      menuRef.current.focus();
    }
  }, [opened]);

  if (!editor) {
    return null;
  }

  return (
    <Portal>
      <Menu
        opened={opened}
        onClose={onClose}
        position="bottom-start"
        withArrow
        shadow="md"
        offset={5}
      >
        <Menu.Target>
          <div
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              width: 1,
              height: 1,
              pointerEvents: 'none',
            }}
          />
        </Menu.Target>

        <Menu.Dropdown
          ref={menuRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          style={{ outline: 'none' }}
        >
          <Menu.Label>Image Actions</Menu.Label>
          
          <Menu.Item
            leftSection={<IconCopy size={14} />}
            onClick={handleCopyUrl}
            disabled={isDeleting}
          >
            Copy Image URL (Ctrl+C)
          </Menu.Item>
          
          <Menu.Item
            leftSection={<IconDownload size={14} />}
            onClick={handleDownload}
            disabled={isDeleting}
          >
            Download Image (Ctrl+D)
          </Menu.Item>
          
          <Menu.Divider />
          
          <Menu.Item
            leftSection={<IconTrash size={14} />}
            onClick={handleDelete}
            disabled={isDeleting}
            color="red"
          >
            {isDeleting ? 'Deleting...' : 'Delete Image (Del)'}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Portal>
  );
};

export default React.memo(ImageContextMenu);